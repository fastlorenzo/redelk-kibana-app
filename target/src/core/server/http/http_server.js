"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const tslib_1 = require("tslib");
const inert_1 = tslib_1.__importDefault(require("inert"));
const url_1 = tslib_1.__importDefault(require("url"));
const http_tools_1 = require("./http_tools");
const auth_1 = require("./lifecycle/auth");
const on_pre_auth_1 = require("./lifecycle/on_pre_auth");
const on_post_auth_1 = require("./lifecycle/on_post_auth");
const on_pre_routing_1 = require("./lifecycle/on_pre_routing");
const on_pre_response_1 = require("./lifecycle/on_pre_response");
const router_1 = require("./router");
const cookie_session_storage_1 = require("./cookie_session_storage");
const auth_state_storage_1 = require("./auth_state_storage");
const auth_headers_storage_1 = require("./auth_headers_storage");
const base_path_service_1 = require("./base_path_service");
class HttpServer {
    constructor(logger, name) {
        this.logger = logger;
        this.name = name;
        this.registeredRouters = new Set();
        this.authRegistered = false;
        this.cookieSessionStorageCreated = false;
        this.stopped = false;
        this.authState = new auth_state_storage_1.AuthStateStorage(() => this.authRegistered);
        this.authRequestHeaders = new auth_headers_storage_1.AuthHeadersStorage();
        this.authResponseHeaders = new auth_headers_storage_1.AuthHeadersStorage();
        this.log = logger.get('http', 'server', name);
    }
    isListening() {
        return this.server !== undefined && this.server.listener.listening;
    }
    registerRouter(router) {
        if (this.isListening()) {
            throw new Error('Routers can be registered only when HTTP server is stopped.');
        }
        this.registeredRouters.add(router);
    }
    async setup(config) {
        const serverOptions = http_tools_1.getServerOptions(config);
        const listenerOptions = http_tools_1.getListenerOptions(config);
        this.server = http_tools_1.createServer(serverOptions, listenerOptions);
        await this.server.register([inert_1.default]);
        this.config = config;
        const basePathService = new base_path_service_1.BasePath(config.basePath);
        this.setupBasePathRewrite(config, basePathService);
        this.setupConditionalCompression(config);
        return {
            registerRouter: this.registerRouter.bind(this),
            registerStaticDir: this.registerStaticDir.bind(this),
            registerOnPreRouting: this.registerOnPreRouting.bind(this),
            registerOnPreAuth: this.registerOnPreAuth.bind(this),
            registerAuth: this.registerAuth.bind(this),
            registerOnPostAuth: this.registerOnPostAuth.bind(this),
            registerOnPreResponse: this.registerOnPreResponse.bind(this),
            createCookieSessionStorageFactory: (cookieOptions) => this.createCookieSessionStorageFactory(cookieOptions, config.basePath),
            basePath: basePathService,
            csp: config.csp,
            auth: {
                get: this.authState.get,
                isAuthenticated: this.authState.isAuthenticated,
            },
            getAuthHeaders: this.authRequestHeaders.get,
            getServerInfo: () => ({
                name: config.name,
                hostname: config.host,
                port: config.port,
                protocol: this.server.info.protocol,
            }),
            // Return server instance with the connection options so that we can properly
            // bridge core and the "legacy" Kibana internally. Once this bridge isn't
            // needed anymore we shouldn't return the instance from this method.
            server: this.server,
        };
    }
    async start() {
        if (this.server === undefined) {
            throw new Error('Http server is not setup up yet');
        }
        if (this.stopped) {
            this.log.warn(`start called after stop`);
            return;
        }
        this.log.debug('starting http server');
        for (const router of this.registeredRouters) {
            for (const route of router.getRoutes()) {
                this.log.debug(`registering route handler for [${route.path}]`);
                // Hapi does not allow payload validation to be specified for 'head' or 'get' requests
                const validate = router_1.isSafeMethod(route.method) ? undefined : { payload: true };
                const { authRequired, tags, body = {}, timeout } = route.options;
                const { accepts: allow, maxBytes, output, parse } = body;
                // Hapi does not allow timeouts on payloads to be specified for 'head' or 'get' requests
                const payloadTimeout = router_1.isSafeMethod(route.method) || timeout == null ? undefined : timeout;
                const kibanaRouteState = {
                    xsrfRequired: route.options.xsrfRequired ?? !router_1.isSafeMethod(route.method),
                };
                this.server.route({
                    handler: route.handler,
                    method: route.method,
                    path: route.path,
                    options: {
                        auth: this.getAuthOption(authRequired),
                        app: kibanaRouteState,
                        tags: tags ? Array.from(tags) : undefined,
                        // TODO: This 'validate' section can be removed once the legacy platform is completely removed.
                        // We are telling Hapi that NP routes can accept any payload, so that it can bypass the default
                        // validation applied in ./http_tools#getServerOptions
                        // (All NP routes are already required to specify their own validation in order to access the payload)
                        validate,
                        payload: [allow, maxBytes, output, parse, payloadTimeout].some((v) => typeof v !== 'undefined')
                            ? {
                                allow,
                                maxBytes,
                                output,
                                parse,
                                timeout: payloadTimeout,
                            }
                            : undefined,
                        timeout: timeout != null
                            ? {
                                socket: timeout + 1,
                            }
                            : undefined,
                    },
                });
            }
        }
        await this.server.start();
        const serverPath = this.config && this.config.rewriteBasePath && this.config.basePath !== undefined
            ? this.config.basePath
            : '';
        this.log.info(`http server running at ${this.server.info.uri}${serverPath}`);
    }
    async stop() {
        this.stopped = true;
        if (this.server === undefined) {
            return;
        }
        this.log.debug('stopping http server');
        await this.server.stop();
    }
    getAuthOption(authRequired = true) {
        if (this.authRegistered === false)
            return undefined;
        if (authRequired === true) {
            return { mode: 'required' };
        }
        if (authRequired === 'optional') {
            return { mode: 'optional' };
        }
        if (authRequired === false) {
            return false;
        }
    }
    setupBasePathRewrite(config, basePathService) {
        if (config.basePath === undefined || !config.rewriteBasePath) {
            return;
        }
        this.registerOnPreRouting((request, response, toolkit) => {
            const oldUrl = request.url.href;
            const newURL = basePathService.remove(oldUrl);
            const shouldRedirect = newURL !== oldUrl;
            if (shouldRedirect) {
                return toolkit.rewriteUrl(newURL);
            }
            return response.notFound();
        });
    }
    setupConditionalCompression(config) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`setupConditionalCompression called after stop`);
        }
        const { enabled, referrerWhitelist: list } = config.compression;
        if (!enabled) {
            this.log.debug('HTTP compression is disabled');
            this.server.ext('onRequest', (request, h) => {
                request.info.acceptEncoding = '';
                return h.continue;
            });
        }
        else if (list) {
            this.log.debug(`HTTP compression is only enabled for any referrer in the following: ${list}`);
            this.server.ext('onRequest', (request, h) => {
                const { referrer } = request.info;
                if (referrer !== '') {
                    const { hostname } = url_1.default.parse(referrer);
                    if (!hostname || !list.includes(hostname)) {
                        request.info.acceptEncoding = '';
                    }
                }
                return h.continue;
            });
        }
    }
    registerOnPreAuth(fn) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`registerOnPreAuth called after stop`);
        }
        this.server.ext('onPreAuth', on_pre_auth_1.adoptToHapiOnPreAuth(fn, this.log));
    }
    registerOnPostAuth(fn) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`registerOnPostAuth called after stop`);
        }
        this.server.ext('onPostAuth', on_post_auth_1.adoptToHapiOnPostAuthFormat(fn, this.log));
    }
    registerOnPreRouting(fn) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`registerOnPreRouting called after stop`);
        }
        this.server.ext('onRequest', on_pre_routing_1.adoptToHapiOnRequest(fn, this.log));
    }
    registerOnPreResponse(fn) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`registerOnPreResponse called after stop`);
        }
        this.server.ext('onPreResponse', on_pre_response_1.adoptToHapiOnPreResponseFormat(fn, this.log));
    }
    async createCookieSessionStorageFactory(cookieOptions, basePath) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`createCookieSessionStorageFactory called after stop`);
        }
        if (this.cookieSessionStorageCreated) {
            throw new Error('A cookieSessionStorageFactory was already created');
        }
        this.cookieSessionStorageCreated = true;
        const sessionStorageFactory = await cookie_session_storage_1.createCookieSessionStorageFactory(this.logger.get('http', 'server', this.name, 'cookie-session-storage'), this.server, cookieOptions, basePath);
        return sessionStorageFactory;
    }
    registerAuth(fn) {
        if (this.server === undefined) {
            throw new Error('Server is not created yet');
        }
        if (this.stopped) {
            this.log.warn(`registerAuth called after stop`);
        }
        if (this.authRegistered) {
            throw new Error('Auth interceptor was already registered');
        }
        this.authRegistered = true;
        this.server.auth.scheme('login', () => ({
            authenticate: auth_1.adoptToHapiAuthFormat(fn, this.log, (req, { state, requestHeaders, responseHeaders }) => {
                this.authState.set(req, state);
                if (responseHeaders) {
                    this.authResponseHeaders.set(req, responseHeaders);
                }
                if (requestHeaders) {
                    this.authRequestHeaders.set(req, requestHeaders);
                    // we mutate headers only for the backward compatibility with the legacy platform.
                    // where some plugin read directly from headers to identify whether a user is authenticated.
                    Object.assign(req.headers, requestHeaders);
                }
            }),
        }));
        this.server.auth.strategy('session', 'login');
        // The default means that the `session` strategy that is based on `login` schema defined above will be
        // automatically assigned to all routes that don't contain an auth config.
        // should be applied for all routes if they don't specify auth strategy in route declaration
        // https://github.com/hapijs/hapi/blob/master/API.md#-serverauthdefaultoptions
        this.server.auth.default('session');
        this.registerOnPreResponse((request, preResponseInfo, t) => {
            const authResponseHeaders = this.authResponseHeaders.get(request);
            return t.next({ headers: authResponseHeaders });
        });
    }
    registerStaticDir(path, dirPath) {
        if (this.server === undefined) {
            throw new Error('Http server is not setup up yet');
        }
        if (this.stopped) {
            this.log.warn(`registerStaticDir called after stop`);
        }
        this.server.route({
            path,
            method: 'GET',
            handler: {
                directory: {
                    path: dirPath,
                    listing: false,
                    lookupCompressed: true,
                },
            },
            options: { auth: false },
        });
    }
}
exports.HttpServer = HttpServer;
