"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePath = void 0;
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
const router_1 = require("./router");
const utils_1 = require("../../utils");
/**
 * Access or manipulate the Kibana base path
 *
 * @public
 */
class BasePath {
    /** @internal */
    constructor(serverBasePath = '') {
        this.basePathCache = new WeakMap();
        /**
         * returns `basePath` value, specific for an incoming request.
         */
        this.get = (request) => {
            const requestScopePath = this.basePathCache.get(router_1.ensureRawRequest(request)) || '';
            return `${this.serverBasePath}${requestScopePath}`;
        };
        /**
         * sets `basePath` value, specific for an incoming request.
         *
         * @privateRemarks should work only for KibanaRequest as soon as spaces migrate to NP
         */
        this.set = (request, requestSpecificBasePath) => {
            const rawRequest = router_1.ensureRawRequest(request);
            if (this.basePathCache.has(rawRequest)) {
                throw new Error('Request basePath was previously set. Setting multiple times is not supported.');
            }
            this.basePathCache.set(rawRequest, requestSpecificBasePath);
        };
        /**
         * Prepends `path` with the basePath.
         */
        this.prepend = (path) => {
            if (this.serverBasePath === '')
                return path;
            return utils_1.modifyUrl(path, (parts) => {
                if (!parts.hostname && parts.pathname && parts.pathname.startsWith('/')) {
                    parts.pathname = `${this.serverBasePath}${parts.pathname}`;
                }
            });
        };
        /**
         * Removes the prepended basePath from the `path`.
         */
        this.remove = (path) => {
            if (this.serverBasePath === '') {
                return path;
            }
            if (path === this.serverBasePath) {
                return '/';
            }
            if (path.startsWith(`${this.serverBasePath}/`)) {
                return path.slice(this.serverBasePath.length);
            }
            return path;
        };
        this.serverBasePath = serverBasePath;
    }
}
exports.BasePath = BasePath;
