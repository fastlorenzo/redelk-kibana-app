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
exports.PluginWrapper = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const type_detect_1 = tslib_1.__importDefault(require("type-detect"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const config_schema_1 = require("@kbn/config-schema");
/**
 * Lightweight wrapper around discovered plugin that is responsible for instantiating
 * plugin and dispatching proper context and dependencies into plugin's lifecycle hooks.
 *
 * @internal
 */
class PluginWrapper {
    constructor(params) {
        this.params = params;
        this.startDependencies$ = new rxjs_1.Subject();
        this.startDependencies = this.startDependencies$.pipe(operators_1.first()).toPromise();
        this.path = params.path;
        this.manifest = params.manifest;
        this.opaqueId = params.opaqueId;
        this.initializerContext = params.initializerContext;
        this.log = params.initializerContext.logger.get();
        this.name = params.manifest.id;
        this.configPath = params.manifest.configPath;
        this.requiredPlugins = params.manifest.requiredPlugins;
        this.optionalPlugins = params.manifest.optionalPlugins;
        this.requiredBundles = params.manifest.requiredBundles;
        this.includesServerPlugin = params.manifest.server;
        this.includesUiPlugin = params.manifest.ui;
    }
    /**
     * Instantiates plugin and calls `setup` function exposed by the plugin initializer.
     * @param setupContext Context that consists of various core services tailored specifically
     * for the `setup` lifecycle event.
     * @param plugins The dictionary where the key is the dependency name and the value
     * is the contract returned by the dependency's `setup` function.
     */
    async setup(setupContext, plugins) {
        this.instance = this.createPluginInstance();
        return this.instance.setup(setupContext, plugins);
    }
    /**
     * Calls `start` function exposed by the initialized plugin.
     * @param startContext Context that consists of various core services tailored specifically
     * for the `start` lifecycle event.
     * @param plugins The dictionary where the key is the dependency name and the value
     * is the contract returned by the dependency's `start` function.
     */
    async start(startContext, plugins) {
        if (this.instance === undefined) {
            throw new Error(`Plugin "${this.name}" can't be started since it isn't set up.`);
        }
        const startContract = await this.instance.start(startContext, plugins);
        this.startDependencies$.next([startContext, plugins, startContract]);
        return startContract;
    }
    /**
     * Calls optional `stop` function exposed by the plugin initializer.
     */
    async stop() {
        if (this.instance === undefined) {
            throw new Error(`Plugin "${this.name}" can't be stopped since it isn't set up.`);
        }
        if (typeof this.instance.stop === 'function') {
            await this.instance.stop();
        }
        this.instance = undefined;
    }
    getConfigDescriptor() {
        if (!this.manifest.server) {
            return null;
        }
        const pluginPathServer = path_1.join(this.path, 'server');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pluginDefinition = require(pluginPathServer);
        if (!('config' in pluginDefinition)) {
            this.log.debug(`"${pluginPathServer}" does not export "config".`);
            return null;
        }
        const configDescriptor = pluginDefinition.config;
        if (!config_schema_1.isConfigSchema(configDescriptor.schema)) {
            throw new Error('Configuration schema expected to be an instance of Type');
        }
        return configDescriptor;
    }
    createPluginInstance() {
        this.log.debug('Initializing plugin');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pluginDefinition = require(path_1.join(this.path, 'server'));
        if (!('plugin' in pluginDefinition)) {
            throw new Error(`Plugin "${this.name}" does not export "plugin" definition (${this.path}).`);
        }
        const { plugin: initializer } = pluginDefinition;
        if (!initializer || typeof initializer !== 'function') {
            throw new Error(`Definition of plugin "${this.name}" should be a function (${this.path}).`);
        }
        const instance = initializer(this.initializerContext);
        if (!instance || typeof instance !== 'object') {
            throw new Error(`Initializer for plugin "${this.manifest.id}" is expected to return plugin instance, but returned "${type_detect_1.default(instance)}".`);
        }
        if (typeof instance.setup !== 'function') {
            throw new Error(`Instance of plugin "${this.name}" does not define "setup" function.`);
        }
        return instance;
    }
}
exports.PluginWrapper = PluginWrapper;
