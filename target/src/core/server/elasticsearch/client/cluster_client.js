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
exports.ClusterClient = void 0;
const http_1 = require("../../http");
const router_1 = require("../../http/router");
const configure_client_1 = require("./configure_client");
const scoped_cluster_client_1 = require("./scoped_cluster_client");
const noop = () => undefined;
/** @internal **/
class ClusterClient {
    constructor(config, logger, getAuthHeaders = noop) {
        this.config = config;
        this.getAuthHeaders = getAuthHeaders;
        this.isClosed = false;
        this.asInternalUser = configure_client_1.configureClient(config, { logger });
        this.rootScopedClient = configure_client_1.configureClient(config, { logger, scoped: true });
    }
    asScoped(request) {
        const scopedHeaders = this.getScopedHeaders(request);
        const scopedClient = this.rootScopedClient.child({
            headers: scopedHeaders,
        });
        return new scoped_cluster_client_1.ScopedClusterClient(this.asInternalUser, scopedClient);
    }
    async close() {
        if (this.isClosed) {
            return;
        }
        this.isClosed = true;
        await Promise.all([this.asInternalUser.close(), this.rootScopedClient.close()]);
    }
    getScopedHeaders(request) {
        let scopedHeaders;
        if (http_1.isRealRequest(request)) {
            const authHeaders = this.getAuthHeaders(request);
            const requestHeaders = router_1.ensureRawRequest(request).headers;
            scopedHeaders = router_1.filterHeaders({ ...requestHeaders, ...authHeaders }, this.config.requestHeadersWhitelist);
        }
        else {
            scopedHeaders = router_1.filterHeaders(request?.headers ?? {}, this.config.requestHeadersWhitelist);
        }
        return {
            ...this.config.customHeaders,
            ...scopedHeaders,
        };
    }
}
exports.ClusterClient = ClusterClient;
