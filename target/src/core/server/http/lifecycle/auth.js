"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adoptToHapiAuthFormat = exports.AuthResultType = void 0;
const router_1 = require("../router");
/** @public */
var AuthResultType;
(function (AuthResultType) {
    AuthResultType["authenticated"] = "authenticated";
    AuthResultType["notHandled"] = "notHandled";
    AuthResultType["redirected"] = "redirected";
})(AuthResultType = exports.AuthResultType || (exports.AuthResultType = {}));
const authResult = {
    authenticated(data = {}) {
        return {
            type: AuthResultType.authenticated,
            state: data.state,
            requestHeaders: data.requestHeaders,
            responseHeaders: data.responseHeaders,
        };
    },
    notHandled() {
        return {
            type: AuthResultType.notHandled,
        };
    },
    redirected(headers) {
        return {
            type: AuthResultType.redirected,
            headers,
        };
    },
    isAuthenticated(result) {
        return result?.type === AuthResultType.authenticated;
    },
    isNotHandled(result) {
        return result?.type === AuthResultType.notHandled;
    },
    isRedirected(result) {
        return result?.type === AuthResultType.redirected;
    },
};
const toolkit = {
    authenticated: authResult.authenticated,
    notHandled: authResult.notHandled,
    redirected: authResult.redirected,
};
/** @public */
function adoptToHapiAuthFormat(fn, log, onAuth = () => undefined) {
    return async function interceptAuth(request, responseToolkit) {
        const hapiResponseAdapter = new router_1.HapiResponseAdapter(responseToolkit);
        const kibanaRequest = router_1.KibanaRequest.from(request, undefined, false);
        try {
            const result = await fn(kibanaRequest, router_1.lifecycleResponseFactory, toolkit);
            if (router_1.isKibanaResponse(result)) {
                return hapiResponseAdapter.handle(result);
            }
            if (authResult.isAuthenticated(result)) {
                onAuth(request, {
                    state: result.state,
                    requestHeaders: result.requestHeaders,
                    responseHeaders: result.responseHeaders,
                });
                return responseToolkit.authenticated({ credentials: result.state || {} });
            }
            if (authResult.isRedirected(result)) {
                // we cannot redirect a user when resources with optional auth requested
                if (kibanaRequest.route.options.authRequired === 'optional') {
                    return responseToolkit.continue;
                }
                return hapiResponseAdapter.handle(router_1.lifecycleResponseFactory.redirected({
                    // hapi doesn't accept string[] as a valid header
                    headers: result.headers,
                }));
            }
            if (authResult.isNotHandled(result)) {
                if (kibanaRequest.route.options.authRequired === 'optional') {
                    return responseToolkit.continue;
                }
                return hapiResponseAdapter.handle(router_1.lifecycleResponseFactory.unauthorized());
            }
            throw new Error(`Unexpected result from Authenticate. Expected AuthResult or KibanaResponse, but given: ${result}.`);
        }
        catch (error) {
            log.error(error);
            return hapiResponseAdapter.toInternalError();
        }
    };
}
exports.adoptToHapiAuthFormat = adoptToHapiAuthFormat;
