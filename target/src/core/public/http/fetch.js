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
exports.Fetch = void 0;
const lodash_1 = require("lodash");
const url_1 = require("url");
const rxjs_1 = require("rxjs");
const http_fetch_error_1 = require("./http_fetch_error");
const http_intercept_controller_1 = require("./http_intercept_controller");
const intercept_1 = require("./intercept");
const http_intercept_halt_error_1 = require("./http_intercept_halt_error");
const JSON_CONTENT = /^(application\/(json|x-javascript)|text\/(x-)?javascript|x-json)(;.*)?$/;
const NDJSON_CONTENT = /^(application\/ndjson)(;.*)?$/;
const removedUndefined = (obj) => {
    return lodash_1.omitBy(obj, (v) => v === undefined);
};
class Fetch {
    constructor(params) {
        this.params = params;
        this.interceptors = new Set();
        this.requestCount$ = new rxjs_1.BehaviorSubject(0);
        this.delete = this.shorthand('DELETE');
        this.get = this.shorthand('GET');
        this.head = this.shorthand('HEAD');
        this.options = this.shorthand('options');
        this.patch = this.shorthand('PATCH');
        this.post = this.shorthand('POST');
        this.put = this.shorthand('PUT');
        this.fetch = async (pathOrOptions, options) => {
            const optionsWithPath = validateFetchArguments(pathOrOptions, options);
            const controller = new http_intercept_controller_1.HttpInterceptController();
            // We wrap the interception in a separate promise to ensure that when
            // a halt is called we do not resolve or reject, halting handling of the promise.
            return new Promise(async (resolve, reject) => {
                try {
                    this.requestCount$.next(this.requestCount$.value + 1);
                    const interceptedOptions = await intercept_1.interceptRequest(optionsWithPath, this.interceptors, controller);
                    const initialResponse = this.fetchResponse(interceptedOptions);
                    const interceptedResponse = await intercept_1.interceptResponse(interceptedOptions, initialResponse, this.interceptors, controller);
                    if (optionsWithPath.asResponse) {
                        resolve(interceptedResponse);
                    }
                    else {
                        resolve(interceptedResponse.body);
                    }
                }
                catch (error) {
                    if (!(error instanceof http_intercept_halt_error_1.HttpInterceptHaltError)) {
                        reject(error);
                    }
                }
                finally {
                    this.requestCount$.next(this.requestCount$.value - 1);
                }
            });
        };
    }
    intercept(interceptor) {
        this.interceptors.add(interceptor);
        return () => {
            this.interceptors.delete(interceptor);
        };
    }
    removeAllInterceptors() {
        this.interceptors.clear();
    }
    getRequestCount$() {
        return this.requestCount$.asObservable();
    }
    createRequest(options) {
        // Merge and destructure options out that are not applicable to the Fetch API.
        const { query, prependBasePath: shouldPrependBasePath, asResponse, asSystemRequest, ...fetchOptions } = {
            method: 'GET',
            credentials: 'same-origin',
            prependBasePath: true,
            ...options,
            // options can pass an `undefined` Content-Type to erase the default value.
            // however we can't pass it to `fetch` as it will send an `Content-Type: Undefined` header
            headers: removedUndefined({
                'Content-Type': 'application/json',
                ...options.headers,
                'kbn-version': this.params.kibanaVersion,
            }),
        };
        const url = url_1.format({
            pathname: shouldPrependBasePath ? this.params.basePath.prepend(options.path) : options.path,
            query: removedUndefined(query),
        });
        // Make sure the system request header is only present if `asSystemRequest` is true.
        if (asSystemRequest) {
            fetchOptions.headers['kbn-system-request'] = 'true';
        }
        return new Request(url, fetchOptions);
    }
    async fetchResponse(fetchOptions) {
        const request = this.createRequest(fetchOptions);
        let response;
        let body = null;
        try {
            response = await window.fetch(request);
        }
        catch (err) {
            throw new http_fetch_error_1.HttpFetchError(err.message, err.name ?? 'Error', request);
        }
        const contentType = response.headers.get('Content-Type') || '';
        try {
            if (NDJSON_CONTENT.test(contentType)) {
                body = await response.blob();
            }
            else if (JSON_CONTENT.test(contentType)) {
                body = await response.json();
            }
            else {
                const text = await response.text();
                try {
                    body = JSON.parse(text);
                }
                catch (err) {
                    body = text;
                }
            }
        }
        catch (err) {
            throw new http_fetch_error_1.HttpFetchError(err.message, err.name ?? 'Error', request, response, body);
        }
        if (!response.ok) {
            throw new http_fetch_error_1.HttpFetchError(response.statusText, 'Error', request, response, body);
        }
        return { fetchOptions, request, response, body };
    }
    shorthand(method) {
        return (pathOrOptions, options) => {
            const optionsWithPath = validateFetchArguments(pathOrOptions, options);
            return this.fetch({ ...optionsWithPath, method });
        };
    }
}
exports.Fetch = Fetch;
/**
 * Ensure that the overloaded arguments to `HttpHandler` are valid.
 */
const validateFetchArguments = (pathOrOptions, options) => {
    let fullOptions;
    if (typeof pathOrOptions === 'string' && (typeof options === 'object' || options === undefined)) {
        fullOptions = { ...options, path: pathOrOptions };
    }
    else if (typeof pathOrOptions === 'object' && options === undefined) {
        fullOptions = pathOrOptions;
    }
    else {
        throw new Error(`Invalid fetch arguments, must either be (string, object) or (object, undefined), received (${typeof pathOrOptions}, ${typeof options})`);
    }
    const invalidHeaders = Object.keys(fullOptions.headers ?? {}).filter((headerName) => headerName.startsWith('kbn-'));
    if (invalidHeaders.length) {
        throw new Error(`Invalid fetch headers, headers beginning with "kbn-" are not allowed: [${invalidHeaders.join(',')}]`);
    }
    return fullOptions;
};
