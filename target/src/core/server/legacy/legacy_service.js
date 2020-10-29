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
exports.LegacyService = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const csp_1 = require("../csp");
const dev_1 = require("../dev");
const http_1 = require("../http");
const plugins_1 = require("./plugins");
const config_1 = require("./config");
const legacy_internals_1 = require("./legacy_internals");
function getLegacyRawConfig(config, pathConfig) {
    const rawConfig = config.toRaw();
    // Elasticsearch config is solely handled by the core and legacy platform
    // shouldn't have direct access to it.
    if (rawConfig.elasticsearch !== undefined) {
        delete rawConfig.elasticsearch;
    }
    return {
        ...rawConfig,
        // We rely heavily in the default value of 'path.data' in the legacy world and,
        // since it has been moved to NP, it won't show up in RawConfig.
        path: pathConfig,
    };
}
/** @internal */
class LegacyService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        /** Symbol to represent the legacy platform as a fake "plugin". Used by the ContextService */
        this.legacyId = Symbol();
        const { logger, configService } = coreContext;
        this.log = logger.get('legacy-service');
        this.devConfig$ = configService
            .atPath(dev_1.config.path)
            .pipe(operators_1.map((rawConfig) => new dev_1.DevConfig(rawConfig)));
        this.httpConfig$ = rxjs_1.combineLatest(configService.atPath(http_1.config.path), configService.atPath(csp_1.config.path)).pipe(operators_1.map(([http, csp]) => new http_1.HttpConfig(http, csp)));
    }
    async discoverPlugins() {
        this.update$ = rxjs_1.combineLatest(this.coreContext.configService.getConfig$(), this.coreContext.configService.atPath('path')).pipe(operators_1.tap(([config, pathConfig]) => {
            if (this.kbnServer !== undefined) {
                this.kbnServer.applyLoggingConfiguration(getLegacyRawConfig(config, pathConfig));
            }
        }), operators_1.tap({ error: (err) => this.log.error(err) }), operators_1.publishReplay(1));
        this.configSubscription = this.update$.connect();
        this.settings = await this.update$
            .pipe(operators_1.first(), operators_1.map(([config, pathConfig]) => getLegacyRawConfig(config, pathConfig)))
            .toPromise();
        const { pluginSpecs, pluginExtendedConfig, disabledPluginSpecs, uiExports, navLinks, } = await plugins_1.findLegacyPluginSpecs(this.settings, this.coreContext.logger, this.coreContext.env.packageInfo);
        plugins_1.logLegacyThirdPartyPluginDeprecationWarning({
            specs: pluginSpecs,
            log: this.log,
        });
        this.legacyPlugins = {
            pluginSpecs,
            disabledPluginSpecs,
            uiExports,
            navLinks,
        };
        const deprecationProviders = await pluginSpecs
            .map((spec) => spec.getDeprecationsProvider())
            .reduce(async (providers, current) => {
            if (current) {
                return [...(await providers), await config_1.convertLegacyDeprecationProvider(current)];
            }
            return providers;
        }, Promise.resolve([]));
        deprecationProviders.forEach((provider) => this.coreContext.configService.addDeprecationProvider('', provider));
        this.legacyRawConfig = pluginExtendedConfig;
        // check for unknown uiExport types
        if (uiExports.unknown && uiExports.unknown.length > 0) {
            throw new Error(`Unknown uiExport types: ${uiExports.unknown
                .map(({ pluginSpec, type }) => `${type} from ${pluginSpec.getId()}`)
                .join(', ')}`);
        }
        return {
            pluginSpecs,
            disabledPluginSpecs,
            uiExports,
            navLinks,
            pluginExtendedConfig,
            settings: this.settings,
        };
    }
    async setup(setupDeps) {
        this.log.debug('setting up legacy service');
        if (!this.legacyPlugins) {
            throw new Error('Legacy service has not discovered legacy plugins yet. Ensure LegacyService.discoverPlugins() is called before LegacyService.setup()');
        }
        // propagate the instance uuid to the legacy config, as it was the legacy way to access it.
        this.legacyRawConfig.set('server.uuid', setupDeps.core.uuid.getInstanceUuid());
        this.setupDeps = setupDeps;
        this.legacyInternals = new legacy_internals_1.LegacyInternals(this.legacyPlugins.uiExports, this.legacyRawConfig, setupDeps.core.http.server);
    }
    async start(startDeps) {
        const { setupDeps } = this;
        if (!setupDeps || !this.legacyPlugins) {
            throw new Error('Legacy service is not setup yet.');
        }
        this.log.debug('starting legacy service');
        // Receive initial config and create kbnServer/ClusterManager.
        if (this.coreContext.env.isDevClusterMaster) {
            await this.createClusterManager(this.legacyRawConfig);
        }
        else {
            this.kbnServer = await this.createKbnServer(this.settings, this.legacyRawConfig, setupDeps, startDeps, this.legacyPlugins);
        }
    }
    async stop() {
        this.log.debug('stopping legacy service');
        if (this.configSubscription !== undefined) {
            this.configSubscription.unsubscribe();
            this.configSubscription = undefined;
        }
        if (this.kbnServer !== undefined) {
            await this.kbnServer.close();
            this.kbnServer = undefined;
        }
    }
    async createClusterManager(config) {
        const basePathProxy$ = this.coreContext.env.cliArgs.basePath
            ? rxjs_1.combineLatest([this.devConfig$, this.httpConfig$]).pipe(operators_1.first(), operators_1.map(([dev, http]) => new http_1.BasePathProxyServer(this.coreContext.logger.get('server'), http, dev)))
            : rxjs_1.EMPTY;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { ClusterManager } = require('../../../cli/cluster/cluster_manager');
        return new ClusterManager(this.coreContext.env.cliArgs, config, await basePathProxy$.toPromise());
    }
    async createKbnServer(settings, config, setupDeps, startDeps, legacyPlugins) {
        const coreStart = {
            capabilities: startDeps.core.capabilities,
            elasticsearch: startDeps.core.elasticsearch,
            http: {
                auth: startDeps.core.http.auth,
                basePath: startDeps.core.http.basePath,
                getServerInfo: startDeps.core.http.getServerInfo,
            },
            savedObjects: {
                getScopedClient: startDeps.core.savedObjects.getScopedClient,
                createScopedRepository: startDeps.core.savedObjects.createScopedRepository,
                createInternalRepository: startDeps.core.savedObjects.createInternalRepository,
                createSerializer: startDeps.core.savedObjects.createSerializer,
                getTypeRegistry: startDeps.core.savedObjects.getTypeRegistry,
            },
            metrics: {
                getOpsMetrics$: startDeps.core.metrics.getOpsMetrics$,
            },
            uiSettings: { asScopedToClient: startDeps.core.uiSettings.asScopedToClient },
            auditTrail: startDeps.core.auditTrail,
        };
        const router = setupDeps.core.http.createRouter('', this.legacyId);
        const coreSetup = {
            capabilities: setupDeps.core.capabilities,
            context: setupDeps.core.context,
            elasticsearch: {
                legacy: {
                    client: setupDeps.core.elasticsearch.legacy.client,
                    createClient: setupDeps.core.elasticsearch.legacy.createClient,
                },
            },
            http: {
                createCookieSessionStorageFactory: setupDeps.core.http.createCookieSessionStorageFactory,
                registerRouteHandlerContext: setupDeps.core.http.registerRouteHandlerContext.bind(null, this.legacyId),
                createRouter: () => router,
                resources: setupDeps.core.httpResources.createRegistrar(router),
                registerOnPreRouting: setupDeps.core.http.registerOnPreRouting,
                registerOnPreAuth: setupDeps.core.http.registerOnPreAuth,
                registerAuth: setupDeps.core.http.registerAuth,
                registerOnPostAuth: setupDeps.core.http.registerOnPostAuth,
                registerOnPreResponse: setupDeps.core.http.registerOnPreResponse,
                basePath: setupDeps.core.http.basePath,
                auth: {
                    get: setupDeps.core.http.auth.get,
                    isAuthenticated: setupDeps.core.http.auth.isAuthenticated,
                },
                csp: setupDeps.core.http.csp,
                getServerInfo: setupDeps.core.http.getServerInfo,
            },
            logging: {
                configure: (config$) => setupDeps.core.logging.configure([], config$),
            },
            savedObjects: {
                setClientFactoryProvider: setupDeps.core.savedObjects.setClientFactoryProvider,
                addClientWrapper: setupDeps.core.savedObjects.addClientWrapper,
                registerType: setupDeps.core.savedObjects.registerType,
                getImportExportObjectLimit: setupDeps.core.savedObjects.getImportExportObjectLimit,
            },
            status: {
                core$: setupDeps.core.status.core$,
            },
            uiSettings: {
                register: setupDeps.core.uiSettings.register,
            },
            uuid: {
                getInstanceUuid: setupDeps.core.uuid.getInstanceUuid,
            },
            auditTrail: setupDeps.core.auditTrail,
            getStartServices: () => Promise.resolve([coreStart, startDeps.plugins, {}]),
        };
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const KbnServer = require('../../../legacy/server/kbn_server');
        const kbnServer = new KbnServer(settings, config, {
            env: {
                mode: this.coreContext.env.mode,
                packageInfo: this.coreContext.env.packageInfo,
            },
            setupDeps: {
                core: coreSetup,
                plugins: setupDeps.plugins,
            },
            startDeps: {
                core: coreStart,
                plugins: startDeps.plugins,
            },
            __internals: {
                http: {
                    registerStaticDir: setupDeps.core.http.registerStaticDir,
                },
                hapiServer: setupDeps.core.http.server,
                kibanaMigrator: startDeps.core.savedObjects.migrator,
                uiPlugins: setupDeps.uiPlugins,
                elasticsearch: setupDeps.core.elasticsearch,
                rendering: setupDeps.core.rendering,
                savedObjectsClientProvider: startDeps.core.savedObjects.clientProvider,
                legacy: this.legacyInternals,
            },
            logger: this.coreContext.logger,
        }, legacyPlugins);
        // The kbnWorkerType check is necessary to prevent the repl
        // from being started multiple times in different processes.
        // We only want one REPL.
        if (this.coreContext.env.cliArgs.repl && process.env.kbnWorkerType === 'server') {
            require('../../../cli/repl').startRepl(kbnServer);
        }
        const { autoListen } = await this.httpConfig$.pipe(operators_1.first()).toPromise();
        if (autoListen) {
            try {
                await kbnServer.listen();
            }
            catch (err) {
                await kbnServer.close();
                throw err;
            }
        }
        else {
            await kbnServer.ready();
        }
        return kbnServer;
    }
}
exports.LegacyService = LegacyService;
