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
exports.isRealRequest = exports.ensureRawRequest = exports.KibanaRequest = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../../utils");
const route_1 = require("./route");
const socket_1 = require("./socket");
const validator_1 = require("./validator");
const requestSymbol = Symbol('request');
/**
 * Kibana specific abstraction for an incoming request.
 * @public
 */
class KibanaRequest {
    constructor(request, params, query, body, 
    // @ts-expect-error we will use this flag as soon as http request proxy is supported in the core
    // until that time we have to expose all the headers
    withoutSecretHeaders) {
        this.params = params;
        this.query = query;
        this.body = body;
        this.withoutSecretHeaders = withoutSecretHeaders;
        this.url = request.url;
        this.headers = utils_1.deepFreeze({ ...request.headers });
        this.isSystemRequest =
            request.headers['kbn-system-request'] === 'true' ||
                // Remove support for `kbn-system-api` in 8.x. Used only by legacy platform.
                request.headers['kbn-system-api'] === 'true';
        // prevent Symbol exposure via Object.getOwnPropertySymbols()
        Object.defineProperty(this, requestSymbol, {
            value: request,
            enumerable: false,
        });
        this.route = utils_1.deepFreeze(this.getRouteInfo(request));
        this.socket = new socket_1.KibanaSocket(request.raw.req.socket);
        this.events = this.getEvents(request);
        this.auth = {
            // missing in fakeRequests, so we cast to false
            isAuthenticated: Boolean(request.auth?.isAuthenticated),
        };
    }
    /**
     * Factory for creating requests. Validates the request before creating an
     * instance of a KibanaRequest.
     * @internal
     */
    static from(req, routeSchemas = {}, withoutSecretHeaders = true) {
        const routeValidator = validator_1.RouteValidator.from(routeSchemas);
        const requestParts = KibanaRequest.validate(req, routeValidator);
        return new KibanaRequest(req, requestParts.params, requestParts.query, requestParts.body, withoutSecretHeaders);
    }
    /**
     * Validates the different parts of a request based on the schemas defined for
     * the route. Builds up the actual params, query and body object that will be
     * received in the route handler.
     * @internal
     */
    static validate(req, routeValidator) {
        const params = routeValidator.getParams(req.params, 'request params');
        const query = routeValidator.getQuery(req.query, 'request query');
        const body = routeValidator.getBody(req.payload, 'request body');
        return { query, params, body };
    }
    getEvents(request) {
        const finish$ = rxjs_1.merge(rxjs_1.fromEvent(request.raw.res, 'finish'), // Response has been sent
        rxjs_1.fromEvent(request.raw.req, 'close') // connection was closed
        ).pipe(operators_1.shareReplay(1), operators_1.first());
        const aborted$ = rxjs_1.fromEvent(request.raw.req, 'aborted').pipe(operators_1.first(), operators_1.takeUntil(finish$));
        const completed$ = rxjs_1.merge(finish$, aborted$).pipe(operators_1.shareReplay(1), operators_1.first());
        return {
            aborted$,
            completed$,
        };
    }
    getRouteInfo(request) {
        const method = request.method;
        const { parse, maxBytes, allow, output } = request.route.settings.payload || {};
        const timeout = request.route.settings.timeout?.socket;
        const options = {
            authRequired: this.getAuthRequired(request),
            // some places in LP call KibanaRequest.from(request) manually. remove fallback to true before v8
            xsrfRequired: request.route.settings.app?.xsrfRequired ?? true,
            tags: request.route.settings.tags || [],
            timeout: typeof timeout === 'number' ? timeout - 1 : undefined,
            body: route_1.isSafeMethod(method)
                ? undefined
                : {
                    parse,
                    maxBytes,
                    accepts: allow,
                    output: output,
                },
        }; // TS does not understand this is OK so I'm enforced to do this enforced casting
        return {
            path: request.path,
            method,
            options,
        };
    }
    getAuthRequired(request) {
        const authOptions = request.route.settings.auth;
        if (typeof authOptions === 'object') {
            // 'try' is used in the legacy platform
            if (authOptions.mode === 'optional' || authOptions.mode === 'try') {
                return 'optional';
            }
            if (authOptions.mode === 'required') {
                return true;
            }
        }
        // legacy platform routes
        if (authOptions === undefined) {
            return true;
        }
        if (authOptions === false)
            return false;
        throw new Error(`unexpected authentication options: ${JSON.stringify(authOptions)} for route: ${this.url.href}`);
    }
}
exports.KibanaRequest = KibanaRequest;
/**
 * Returns underlying Hapi Request
 * @internal
 */
exports.ensureRawRequest = (request) => isKibanaRequest(request) ? request[requestSymbol] : request;
function isKibanaRequest(request) {
    return request instanceof KibanaRequest;
}
function isRequest(request) {
    try {
        return request.raw.req && typeof request.raw.req === 'object';
    }
    catch {
        return false;
    }
}
/**
 * Checks if an incoming request either KibanaRequest or Legacy.Request
 * @internal
 */
function isRealRequest(request) {
    return isKibanaRequest(request) || isRequest(request);
}
exports.isRealRequest = isRealRequest;
