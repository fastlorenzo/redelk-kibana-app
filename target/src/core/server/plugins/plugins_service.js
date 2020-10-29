"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginsService = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const operators_1 = require("rxjs/operators");
const discovery_1 = require("./discovery");
const plugins_config_1 = require("./plugins_config");
const plugins_system_1 = require("./plugins_system");
const utils_1 = require("../../utils");
/** @internal */
class PluginsService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.pluginConfigDescriptors = new Map();
        this.uiPluginInternalInfo = new Map();
        this.log = coreContext.logger.get('plugins-service');
        this.pluginsSystem = new plugins_system_1.PluginsSystem(coreContext);
        this.configService = coreContext.configService;
        this.config$ = coreContext.configService
            .atPath('plugins')
            .pipe(operators_1.map((rawConfig) => new plugins_config_1.PluginsConfig(rawConfig, coreContext.env)));
    }
    async discover() {
        this.log.debug('Discovering plugins');
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        const { error$, plugin$ } = discovery_1.discover(config, this.coreContext);
        await this.handleDiscoveryErrors(error$);
        await this.handleDiscoveredPlugins(plugin$);
        const uiPlugins = this.pluginsSystem.uiPlugins();
        return {
            // Return dependency tree
            pluginTree: this.pluginsSystem.getPluginDependencies(),
            uiPlugins: {
                internal: this.uiPluginInternalInfo,
                public: uiPlugins,
                browserConfigs: this.generateUiPluginsConfigs(uiPlugins),
            },
        };
    }
    async setup(deps) {
        this.log.debug('Setting up plugins service');
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        let contracts = new Map();
        const initialize = config.initialize && !this.coreContext.env.isDevClusterMaster;
        if (initialize) {
            contracts = await this.pluginsSystem.setupPlugins(deps);
            this.registerPluginStaticDirs(deps);
        }
        else {
            this.log.info('Plugin initialization disabled.');
        }
        return {
            initialized: initialize,
            contracts,
        };
    }
    async start(deps) {
        this.log.debug('Plugins service starts plugins');
        const contracts = await this.pluginsSystem.startPlugins(deps);
        return { contracts };
    }
    async stop() {
        this.log.debug('Stopping plugins service');
        await this.pluginsSystem.stopPlugins();
    }
    generateUiPluginsConfigs(uiPlugins) {
        return new Map([...uiPlugins]
            .filter(([pluginId, _]) => {
            const configDescriptor = this.pluginConfigDescriptors.get(pluginId);
            return (configDescriptor &&
                configDescriptor.exposeToBrowser &&
                Object.values(configDescriptor?.exposeToBrowser).some((exposed) => exposed));
        })
            .map(([pluginId, plugin]) => {
            const configDescriptor = this.pluginConfigDescriptors.get(pluginId);
            return [
                pluginId,
                this.configService.atPath(plugin.configPath).pipe(operators_1.map((config) => utils_1.pick(config || {}, Object.entries(configDescriptor.exposeToBrowser)
                    .filter(([_, exposed]) => exposed)
                    .map(([key, _]) => key)))),
            ];
        }));
    }
    async handleDiscoveryErrors(error$) {
        // At this stage we report only errors that can occur when new platform plugin
        // manifest is present, otherwise we can't be sure that the plugin is for the new
        // platform and let legacy platform to handle it.
        const errorTypesToReport = [
            discovery_1.PluginDiscoveryErrorType.IncompatibleVersion,
            discovery_1.PluginDiscoveryErrorType.InvalidManifest,
        ];
        const errors = await error$
            .pipe(operators_1.filter((error) => errorTypesToReport.includes(error.type)), operators_1.tap((pluginError) => this.log.error(pluginError)), operators_1.toArray())
            .toPromise();
        if (errors.length > 0) {
            throw new Error(`Failed to initialize plugins:${errors.map((err) => `\n\t${err.message}`).join('')}`);
        }
    }
    async handleDiscoveredPlugins(plugin$) {
        const pluginEnableStatuses = new Map();
        await plugin$
            .pipe(operators_1.mergeMap(async (plugin) => {
            const configDescriptor = plugin.getConfigDescriptor();
            if (configDescriptor) {
                this.pluginConfigDescriptors.set(plugin.name, configDescriptor);
                if (configDescriptor.deprecations) {
                    this.coreContext.configService.addDeprecationProvider(plugin.configPath, configDescriptor.deprecations);
                }
                await this.coreContext.configService.setSchema(plugin.configPath, configDescriptor.schema);
            }
            const isEnabled = await this.coreContext.configService.isEnabledAtPath(plugin.configPath);
            if (pluginEnableStatuses.has(plugin.name)) {
                throw new Error(`Plugin with id "${plugin.name}" is already registered!`);
            }
            if (plugin.includesUiPlugin) {
                this.uiPluginInternalInfo.set(plugin.name, {
                    requiredBundles: plugin.requiredBundles,
                    publicTargetDir: path_1.default.resolve(plugin.path, 'target/public'),
                    publicAssetsDir: path_1.default.resolve(plugin.path, 'public/assets'),
                });
            }
            pluginEnableStatuses.set(plugin.name, { plugin, isEnabled });
        }))
            .toPromise();
        for (const [pluginName, { plugin, isEnabled }] of pluginEnableStatuses) {
            // validate that `requiredBundles` ids point to a discovered plugin which `includesUiPlugin`
            for (const requiredBundleId of plugin.requiredBundles) {
                if (!pluginEnableStatuses.has(requiredBundleId)) {
                    throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${pluginName}" but it is missing.`);
                }
                if (!pluginEnableStatuses.get(requiredBundleId).plugin.includesUiPlugin) {
                    throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${pluginName}" but it doesn't have a UI bundle.`);
                }
            }
            const pluginEnablement = this.shouldEnablePlugin(pluginName, pluginEnableStatuses);
            if (pluginEnablement.enabled) {
                this.pluginsSystem.addPlugin(plugin);
            }
            else if (isEnabled) {
                this.log.info(`Plugin "${pluginName}" has been disabled since the following direct or transitive dependencies are missing or disabled: [${pluginEnablement.missingDependencies.join(', ')}]`);
            }
            else {
                this.log.info(`Plugin "${pluginName}" is disabled.`);
            }
        }
        this.log.debug(`Discovered ${pluginEnableStatuses.size} plugins.`);
    }
    shouldEnablePlugin(pluginName, pluginEnableStatuses, parents = []) {
        const pluginInfo = pluginEnableStatuses.get(pluginName);
        if (pluginInfo === undefined || !pluginInfo.isEnabled) {
            return {
                enabled: false,
                missingDependencies: [],
            };
        }
        const missingDependencies = pluginInfo.plugin.requiredPlugins
            .filter((dep) => !parents.includes(dep))
            .filter((dependencyName) => !this.shouldEnablePlugin(dependencyName, pluginEnableStatuses, [...parents, pluginName])
            .enabled);
        if (missingDependencies.length === 0) {
            return {
                enabled: true,
            };
        }
        return {
            enabled: false,
            missingDependencies,
        };
    }
    registerPluginStaticDirs(deps) {
        for (const [pluginName, pluginInfo] of this.uiPluginInternalInfo) {
            deps.http.registerStaticDir(`/plugins/${pluginName}/assets/{path*}`, pluginInfo.publicAssetsDir);
        }
    }
}
exports.PluginsService = PluginsService;
