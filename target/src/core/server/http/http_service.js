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
exports.HttpService = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../utils");
const csp_1 = require("../csp");
const router_1 = require("./router");
const http_config_1 = require("./http_config");
const http_server_1 = require("./http_server");
const https_redirect_server_1 = require("./https_redirect_server");
const lifecycle_handlers_1 = require("./lifecycle_handlers");
/** @internal */
class HttpService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        const { logger, configService, env } = coreContext;
        this.logger = logger;
        this.env = env;
        this.log = logger.get('http');
        this.config$ = rxjs_1.combineLatest([
            configService.atPath(http_config_1.config.path),
            configService.atPath(csp_1.config.path),
        ]).pipe(operators_1.map(([http, csp]) => new http_config_1.HttpConfig(http, csp)));
        this.httpServer = new http_server_1.HttpServer(logger, 'Kibana');
        this.httpsRedirectServer = new https_redirect_server_1.HttpsRedirectServer(logger.get('http', 'redirect', 'server'));
    }
    async setup(deps) {
        this.requestHandlerContext = deps.context.createContextContainer();
        this.configSubscription = this.config$.subscribe(() => {
            if (this.httpServer.isListening()) {
                // If the server is already running we can't make any config changes
                // to it, so we warn and don't allow the config to pass through.
                this.log.warn('Received new HTTP config after server was started. Config will **not** be applied.');
            }
        });
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        if (this.shouldListen(config)) {
            await this.runNotReadyServer(config);
        }
        const { registerRouter, ...serverContract } = await this.httpServer.setup(config);
        lifecycle_handlers_1.registerCoreHandlers(serverContract, config, this.env);
        this.internalSetup = {
            ...serverContract,
            createRouter: (path, pluginId = this.coreContext.coreId) => {
                const enhanceHandler = this.requestHandlerContext.createHandler.bind(null, pluginId);
                const router = new router_1.Router(path, this.log, enhanceHandler);
                registerRouter(router);
                return router;
            },
            registerRouteHandlerContext: (pluginOpaqueId, contextName, provider) => this.requestHandlerContext.registerContext(pluginOpaqueId, contextName, provider),
        };
        return this.internalSetup;
    }
    // this method exists because we need the start contract to create the `CoreStart` used to start
    // the `plugin` and `legacy` services.
    getStartContract() {
        return {
            ...utils_1.pick(this.internalSetup, ['auth', 'basePath', 'getServerInfo']),
            isListening: () => this.httpServer.isListening(),
        };
    }
    async start() {
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        if (this.shouldListen(config)) {
            if (this.notReadyServer) {
                this.log.debug('stopping NotReady server');
                await this.notReadyServer.stop();
                this.notReadyServer = undefined;
            }
            // If a redirect port is specified, we start an HTTP server at this port and
            // redirect all requests to the SSL port.
            if (config.ssl.enabled && config.ssl.redirectHttpFromPort !== undefined) {
                await this.httpsRedirectServer.start(config);
            }
            await this.httpServer.start();
        }
        return this.getStartContract();
    }
    /**
     * Indicates if http server has configured to start listening on a configured port.
     * We shouldn't start http service in two cases:
     * 1. If `server.autoListen` is explicitly set to `false`.
     * 2. When the process is run as dev cluster master in which case cluster manager
     * will fork a dedicated process where http service will be set up instead.
     * @internal
     * */
    shouldListen(config) {
        return !this.coreContext.env.isDevClusterMaster && config.autoListen;
    }
    async stop() {
        if (this.configSubscription === undefined) {
            return;
        }
        this.configSubscription.unsubscribe();
        this.configSubscription = undefined;
        if (this.notReadyServer) {
            await this.notReadyServer.stop();
        }
        await this.httpServer.stop();
        await this.httpsRedirectServer.stop();
    }
    async runNotReadyServer(config) {
        this.log.debug('starting NotReady server');
        const httpServer = new http_server_1.HttpServer(this.logger, 'NotReady');
        const { server } = await httpServer.setup(config);
        this.notReadyServer = server;
        // use hapi server while KibanaResponseFactory doesn't allow specifying custom headers
        // https://github.com/elastic/kibana/issues/33779
        this.notReadyServer.route({
            path: '/{p*}',
            method: '*',
            handler: (req, responseToolkit) => {
                this.log.debug(`Kibana server is not ready yet ${req.method}:${req.url.href}.`);
                // If server is not ready yet, because plugins or core can perform
                // long running tasks (build assets, saved objects migrations etc.)
                // we should let client know that and ask to retry after 30 seconds.
                return responseToolkit
                    .response('Kibana server is not ready yet')
                    .code(503)
                    .header('Retry-After', '30');
            },
        });
        await this.notReadyServer.start();
    }
}
exports.HttpService = HttpService;
