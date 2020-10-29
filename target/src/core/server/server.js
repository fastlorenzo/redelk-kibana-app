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
exports.Server = void 0;
const config_1 = require("./config");
const core_app_1 = require("./core_app");
const audit_trail_1 = require("./audit_trail");
const elasticsearch_1 = require("./elasticsearch");
const http_1 = require("./http");
const http_resources_1 = require("./http_resources");
const rendering_1 = require("./rendering");
const legacy_1 = require("./legacy");
const logging_1 = require("./logging");
const ui_settings_1 = require("./ui_settings");
const plugins_1 = require("./plugins");
const saved_objects_1 = require("../server/saved_objects");
const metrics_1 = require("./metrics");
const capabilities_1 = require("./capabilities");
const uuid_1 = require("./uuid");
const status_service_1 = require("./status/status_service");
const csp_1 = require("./csp");
const elasticsearch_2 = require("./elasticsearch");
const http_2 = require("./http");
const logging_2 = require("./logging");
const dev_1 = require("./dev");
const path_1 = require("./path");
const kibana_config_1 = require("./kibana_config");
const saved_objects_2 = require("./saved_objects");
const ui_settings_2 = require("./ui_settings");
const utils_1 = require("../utils");
const context_1 = require("./context");
const coreId = Symbol('core');
const rootConfigPath = '';
class Server {
    constructor(rawConfigProvider, env, loggingSystem) {
        this.env = env;
        this.loggingSystem = loggingSystem;
        this.logger = this.loggingSystem.asLoggerFactory();
        this.log = this.logger.get('server');
        this.configService = new config_1.ConfigService(rawConfigProvider, env, this.logger);
        const core = { coreId, configService: this.configService, env, logger: this.logger };
        this.context = new context_1.ContextService(core);
        this.http = new http_1.HttpService(core);
        this.rendering = new rendering_1.RenderingService(core);
        this.plugins = new plugins_1.PluginsService(core);
        this.legacy = new legacy_1.LegacyService(core);
        this.elasticsearch = new elasticsearch_1.ElasticsearchService(core);
        this.savedObjects = new saved_objects_1.SavedObjectsService(core);
        this.uiSettings = new ui_settings_1.UiSettingsService(core);
        this.capabilities = new capabilities_1.CapabilitiesService(core);
        this.uuid = new uuid_1.UuidService(core);
        this.metrics = new metrics_1.MetricsService(core);
        this.status = new status_service_1.StatusService(core);
        this.coreApp = new core_app_1.CoreApp(core);
        this.httpResources = new http_resources_1.HttpResourcesService(core);
        this.auditTrail = new audit_trail_1.AuditTrailService(core);
        this.logging = new logging_1.LoggingService(core);
    }
    #pluginsInitialized;
    async setup() {
        this.log.debug('setting up server');
        // Discover any plugins before continuing. This allows other systems to utilize the plugin dependency graph.
        const { pluginTree, uiPlugins } = await this.plugins.discover();
        const legacyPlugins = await this.legacy.discoverPlugins();
        // Immediately terminate in case of invalid configuration
        await this.configService.validate();
        await legacy_1.ensureValidConfiguration(this.configService, legacyPlugins);
        const contextServiceSetup = this.context.setup({
            // We inject a fake "legacy plugin" with dependencies on every plugin so that legacy plugins:
            // 1) Can access context from any NP plugin
            // 2) Can register context providers that will only be available to other legacy plugins and will not leak into
            //    New Platform plugins.
            pluginDependencies: new Map([...pluginTree, [this.legacy.legacyId, [...pluginTree.keys()]]]),
        });
        const auditTrailSetup = this.auditTrail.setup();
        const uuidSetup = await this.uuid.setup();
        const httpSetup = await this.http.setup({
            context: contextServiceSetup,
        });
        const capabilitiesSetup = this.capabilities.setup({ http: httpSetup });
        const elasticsearchServiceSetup = await this.elasticsearch.setup({
            http: httpSetup,
        });
        const savedObjectsSetup = await this.savedObjects.setup({
            http: httpSetup,
            elasticsearch: elasticsearchServiceSetup,
            legacyPlugins,
        });
        const uiSettingsSetup = await this.uiSettings.setup({
            http: httpSetup,
            savedObjects: savedObjectsSetup,
        });
        await this.metrics.setup({ http: httpSetup });
        const renderingSetup = await this.rendering.setup({
            http: httpSetup,
            legacyPlugins,
            uiPlugins,
        });
        const httpResourcesSetup = this.httpResources.setup({
            http: httpSetup,
            rendering: renderingSetup,
        });
        const statusSetup = this.status.setup({
            elasticsearch: elasticsearchServiceSetup,
            savedObjects: savedObjectsSetup,
        });
        const loggingSetup = this.logging.setup({
            loggingSystem: this.loggingSystem,
        });
        const coreSetup = {
            capabilities: capabilitiesSetup,
            context: contextServiceSetup,
            elasticsearch: elasticsearchServiceSetup,
            http: httpSetup,
            savedObjects: savedObjectsSetup,
            status: statusSetup,
            uiSettings: uiSettingsSetup,
            uuid: uuidSetup,
            rendering: renderingSetup,
            httpResources: httpResourcesSetup,
            auditTrail: auditTrailSetup,
            logging: loggingSetup,
        };
        const pluginsSetup = await this.plugins.setup(coreSetup);
        this.#pluginsInitialized = pluginsSetup.initialized;
        await this.legacy.setup({
            core: { ...coreSetup, plugins: pluginsSetup, rendering: renderingSetup },
            plugins: utils_1.mapToObject(pluginsSetup.contracts),
            uiPlugins,
        });
        this.registerCoreContext(coreSetup);
        this.coreApp.setup(coreSetup);
        return coreSetup;
    }
    async start() {
        this.log.debug('starting server');
        const auditTrailStart = this.auditTrail.start();
        const elasticsearchStart = await this.elasticsearch.start({
            auditTrail: auditTrailStart,
        });
        const savedObjectsStart = await this.savedObjects.start({
            elasticsearch: elasticsearchStart,
            pluginsInitialized: this.#pluginsInitialized,
        });
        const capabilitiesStart = this.capabilities.start();
        const uiSettingsStart = await this.uiSettings.start();
        const metricsStart = await this.metrics.start();
        const httpStart = this.http.getStartContract();
        this.coreStart = {
            capabilities: capabilitiesStart,
            elasticsearch: elasticsearchStart,
            http: httpStart,
            metrics: metricsStart,
            savedObjects: savedObjectsStart,
            uiSettings: uiSettingsStart,
            auditTrail: auditTrailStart,
        };
        const pluginsStart = await this.plugins.start(this.coreStart);
        await this.legacy.start({
            core: {
                ...this.coreStart,
                plugins: pluginsStart,
            },
            plugins: utils_1.mapToObject(pluginsStart.contracts),
        });
        await this.http.start();
        await this.rendering.start({
            legacy: this.legacy,
        });
        return this.coreStart;
    }
    async stop() {
        this.log.debug('stopping server');
        await this.legacy.stop();
        await this.plugins.stop();
        await this.savedObjects.stop();
        await this.elasticsearch.stop();
        await this.http.stop();
        await this.uiSettings.stop();
        await this.rendering.stop();
        await this.metrics.stop();
        await this.status.stop();
        await this.logging.stop();
        await this.auditTrail.stop();
    }
    registerCoreContext(coreSetup) {
        coreSetup.http.registerRouteHandlerContext(coreId, 'core', async (context, req, res) => {
            const coreStart = this.coreStart;
            const savedObjectsClient = coreStart.savedObjects.getScopedClient(req);
            return {
                savedObjects: {
                    client: savedObjectsClient,
                    typeRegistry: coreStart.savedObjects.getTypeRegistry(),
                },
                elasticsearch: {
                    legacy: {
                        client: coreStart.elasticsearch.legacy.client.asScoped(req),
                    },
                },
                uiSettings: {
                    client: coreStart.uiSettings.asScopedToClient(savedObjectsClient),
                },
                auditor: coreStart.auditTrail.asScoped(req),
            };
        });
    }
    async setupCoreConfig() {
        const schemas = [
            [path_1.config.path, path_1.config.schema],
            [csp_1.config.path, csp_1.config.schema],
            [elasticsearch_2.config.path, elasticsearch_2.config.schema],
            [logging_2.config.path, logging_2.config.schema],
            [http_2.config.path, http_2.config.schema],
            [plugins_1.config.path, plugins_1.config.schema],
            [dev_1.config.path, dev_1.config.schema],
            [kibana_config_1.config.path, kibana_config_1.config.schema],
            [saved_objects_2.savedObjectsConfig.path, saved_objects_2.savedObjectsConfig.schema],
            [saved_objects_2.savedObjectsMigrationConfig.path, saved_objects_2.savedObjectsMigrationConfig.schema],
            [ui_settings_2.config.path, ui_settings_2.config.schema],
            [metrics_1.opsConfig.path, metrics_1.opsConfig.schema],
        ];
        this.configService.addDeprecationProvider(rootConfigPath, config_1.coreDeprecationProvider);
        this.configService.addDeprecationProvider(elasticsearch_2.config.path, elasticsearch_2.config.deprecations);
        this.configService.addDeprecationProvider(ui_settings_2.config.path, ui_settings_2.config.deprecations);
        for (const [path, schema] of schemas) {
            await this.configService.setSchema(path, schema);
        }
    }
}
exports.Server = Server;
