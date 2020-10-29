"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResourcesService = void 0;
class HttpResourcesService {
    constructor(core) {
        this.logger = core.logger.get('http-resources');
    }
    setup(deps) {
        this.logger.debug('setting up HttpResourcesService');
        return {
            createRegistrar: this.createRegistrar.bind(this, deps),
        };
    }
    start() { }
    stop() { }
    createRegistrar(deps, router) {
        return {
            register: (route, handler) => {
                return router.get(route, (context, request, response) => {
                    return handler(context, request, {
                        ...response,
                        ...this.createResponseToolkit(deps, context, request, response),
                    });
                });
            },
        };
    }
    createResponseToolkit(deps, context, request, response) {
        const cspHeader = deps.http.csp.header;
        return {
            async renderCoreApp(options = {}) {
                const body = await deps.rendering.render(request, context.core.uiSettings.client, {
                    includeUserSettings: true,
                });
                return response.ok({
                    body,
                    headers: { ...options.headers, 'content-security-policy': cspHeader },
                });
            },
            async renderAnonymousCoreApp(options = {}) {
                const body = await deps.rendering.render(request, context.core.uiSettings.client, {
                    includeUserSettings: false,
                });
                return response.ok({
                    body,
                    headers: { ...options.headers, 'content-security-policy': cspHeader },
                });
            },
            renderHtml(options) {
                return response.ok({
                    body: options.body,
                    headers: {
                        ...options.headers,
                        'content-type': 'text/html',
                        'content-security-policy': cspHeader,
                    },
                });
            },
            renderJs(options) {
                return response.ok({
                    body: options.body,
                    headers: {
                        ...options.headers,
                        'content-type': 'text/javascript',
                        'content-security-policy': cspHeader,
                    },
                });
            },
        };
    }
}
exports.HttpResourcesService = HttpResourcesService;
