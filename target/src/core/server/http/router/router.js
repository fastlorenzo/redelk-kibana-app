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
exports.Router = void 0;
const config_schema_1 = require("@kbn/config-schema");
const errors_1 = require("../../elasticsearch/legacy/errors");
const request_1 = require("./request");
const response_1 = require("./response");
const route_1 = require("./route");
const response_adapter_1 = require("./response_adapter");
const error_wrapper_1 = require("./error_wrapper");
const validator_1 = require("./validator");
function getRouteFullPath(routerPath, routePath) {
    // If router's path ends with slash and route's path starts with slash,
    // we should omit one of them to have a valid concatenated path.
    const routePathStartIndex = routerPath.endsWith('/') && routePath.startsWith('/') ? 1 : 0;
    return `${routerPath}${routePath.slice(routePathStartIndex)}`;
}
/**
 * Create the validation schemas for a route
 *
 * @returns Route schemas if `validate` is specified on the route, otherwise
 * undefined.
 */
function routeSchemasFromRouteConfig(route, routeMethod) {
    // The type doesn't allow `validate` to be undefined, but it can still
    // happen when it's used from JavaScript.
    if (route.validate === undefined) {
        throw new Error(`The [${routeMethod}] at [${route.path}] does not have a 'validate' specified. Use 'false' as the value if you want to bypass validation.`);
    }
    if (route.validate !== false) {
        Object.entries(route.validate).forEach(([key, schema]) => {
            if (!(config_schema_1.isConfigSchema(schema) || typeof schema === 'function')) {
                throw new Error(`Expected a valid validation logic declared with '@kbn/config-schema' package or a RouteValidationFunction at key: [${key}].`);
            }
        });
    }
    if (route.validate) {
        return validator_1.RouteValidator.from(route.validate);
    }
}
/**
 * Create a valid options object with "sensible" defaults + adding some validation to the options fields
 *
 * @param method HTTP verb for these options
 * @param routeConfig The route config definition
 */
function validOptions(method, routeConfig) {
    const shouldNotHavePayload = ['head', 'get'].includes(method);
    const { options = {}, validate } = routeConfig;
    const shouldValidateBody = (validate && !!validate.body) || !!options.body;
    const { output } = options.body || {};
    if (typeof output === 'string' && !route_1.validBodyOutput.includes(output)) {
        throw new Error(`[options.body.output: '${output}'] in route ${method.toUpperCase()} ${routeConfig.path} is not valid. Only '${route_1.validBodyOutput.join("' or '")}' are valid.`);
    }
    const body = shouldNotHavePayload
        ? undefined
        : {
            // If it's not a GET (requires payload) but no body validation is required (or no body options are specified),
            // We assume the route does not care about the body => use the memory-cheapest approach (stream and no parsing)
            output: !shouldValidateBody ? 'stream' : undefined,
            parse: !shouldValidateBody ? false : undefined,
            // User's settings should overwrite any of the "desired" values
            ...options.body,
        };
    return { ...options, body };
}
/**
 * @internal
 */
class Router {
    constructor(routerPath, log, enhanceWithContext) {
        this.routerPath = routerPath;
        this.log = log;
        this.enhanceWithContext = enhanceWithContext;
        this.routes = [];
        this.handleLegacyErrors = error_wrapper_1.wrapErrors;
        const buildMethod = (method) => (route, handler) => {
            const routeSchemas = routeSchemasFromRouteConfig(route, method);
            this.routes.push({
                handler: async (req, responseToolkit) => await this.handle({
                    routeSchemas,
                    request: req,
                    responseToolkit,
                    handler: this.enhanceWithContext(handler),
                }),
                method,
                path: getRouteFullPath(this.routerPath, route.path),
                options: validOptions(method, route),
            });
        };
        this.get = buildMethod('get');
        this.post = buildMethod('post');
        this.delete = buildMethod('delete');
        this.put = buildMethod('put');
        this.patch = buildMethod('patch');
    }
    getRoutes() {
        return [...this.routes];
    }
    async handle({ routeSchemas, request, responseToolkit, handler, }) {
        let kibanaRequest;
        const hapiResponseAdapter = new response_adapter_1.HapiResponseAdapter(responseToolkit);
        try {
            kibanaRequest = request_1.KibanaRequest.from(request, routeSchemas);
        }
        catch (e) {
            return hapiResponseAdapter.toBadRequest(e.message);
        }
        try {
            const kibanaResponse = await handler(kibanaRequest, response_1.kibanaResponseFactory);
            return hapiResponseAdapter.handle(kibanaResponse);
        }
        catch (e) {
            this.log.error(e);
            // forward 401 (boom) error from ES
            if (errors_1.LegacyElasticsearchErrorHelpers.isNotAuthorizedError(e)) {
                return e;
            }
            return hapiResponseAdapter.toInternalError();
        }
    }
}
exports.Router = Router;
