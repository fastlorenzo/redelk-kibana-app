"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyClusterClient = void 0;
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
const elasticsearch_1 = require("elasticsearch");
const lodash_1 = require("lodash");
const errors_1 = require("./errors");
const http_1 = require("../../http");
const router_1 = require("../../http/router");
const elasticsearch_client_config_1 = require("./elasticsearch_client_config");
const scoped_cluster_client_1 = require("./scoped_cluster_client");
/**
 * Support Legacy platform request for the period of migration.
 *
 * @public
 */
const noop = () => undefined;
/**
 * Calls the Elasticsearch API endpoint with the specified parameters.
 * @param client Raw Elasticsearch JS client instance to use.
 * @param endpoint Name of the API endpoint to call.
 * @param clientParams Parameters that will be directly passed to the
 * Elasticsearch JS client.
 * @param options Options that affect the way we call the API and process the result.
 */
const callAPI = async (client, endpoint, clientParams = {}, options = { wrap401Errors: true }) => {
    const clientPath = endpoint.split('.');
    const api = lodash_1.get(client, clientPath);
    if (!api) {
        throw new Error(`called with an invalid endpoint: ${endpoint}`);
    }
    const apiContext = clientPath.length === 1 ? client : lodash_1.get(client, clientPath.slice(0, -1));
    try {
        return await new Promise((resolve, reject) => {
            const request = api.call(apiContext, clientParams);
            if (options.signal) {
                options.signal.addEventListener('abort', () => {
                    request.abort();
                    reject(new Error('Request was aborted'));
                });
            }
            return request.then(resolve, reject);
        });
    }
    catch (err) {
        if (!options.wrap401Errors || err.statusCode !== 401) {
            throw err;
        }
        throw errors_1.LegacyElasticsearchErrorHelpers.decorateNotAuthorizedError(err);
    }
};
/**
 * {@inheritDoc IClusterClient}
 * @public
 */
class LegacyClusterClient {
    constructor(config, log, getAuditorFactory, getAuthHeaders = noop) {
        this.config = config;
        this.log = log;
        this.getAuditorFactory = getAuditorFactory;
        this.getAuthHeaders = getAuthHeaders;
        /**
         * Indicates whether this cluster client (and all internal raw Elasticsearch JS clients) has been closed.
         */
        this.isClosed = false;
        /**
         * Calls specified endpoint with provided clientParams on behalf of the
         * Kibana internal user.
         * See {@link LegacyAPICaller}.
         *
         * @param endpoint - String descriptor of the endpoint e.g. `cluster.getSettings` or `ping`.
         * @param clientParams - A dictionary of parameters that will be passed directly to the Elasticsearch JS client.
         * @param options - Options that affect the way we call the API and process the result.
         */
        this.callAsInternalUser = async (endpoint, clientParams = {}, options) => {
            this.assertIsNotClosed();
            return await callAPI.bind(null, this.client)(endpoint, clientParams, options);
        };
        /**
         * Calls specified endpoint with provided clientParams on behalf of the
         * user initiated request to the Kibana server (via HTTP request headers).
         * See {@link LegacyAPICaller}.
         *
         * @param endpoint - String descriptor of the endpoint e.g. `cluster.getSettings` or `ping`.
         * @param clientParams - A dictionary of parameters that will be passed directly to the Elasticsearch JS client.
         * @param options - Options that affect the way we call the API and process the result.
         */
        this.callAsCurrentUser = async (endpoint, clientParams = {}, options) => {
            this.assertIsNotClosed();
            return await callAPI.bind(null, this.scopedClient)(endpoint, clientParams, options);
        };
        this.client = new elasticsearch_1.Client(elasticsearch_client_config_1.parseElasticsearchClientConfig(config, log));
    }
    /**
     * Closes the cluster client. After that client cannot be used and one should
     * create a new client instance to be able to interact with Elasticsearch API.
     */
    close() {
        if (this.isClosed) {
            return;
        }
        this.isClosed = true;
        this.client.close();
        if (this.scopedClient !== undefined) {
            this.scopedClient.close();
        }
    }
    /**
     * Creates an instance of {@link ILegacyScopedClusterClient} based on the configuration the
     * current cluster client that exposes additional `callAsCurrentUser` method
     * scoped to the provided req. Consumers shouldn't worry about closing
     * scoped client instances, these will be automatically closed as soon as the
     * original cluster client isn't needed anymore and closed.
     *
     * @param request - Request the `IScopedClusterClient` instance will be scoped to.
     * Supports request optionality, Legacy.Request & FakeRequest for BWC with LegacyPlatform
     */
    asScoped(request) {
        // It'd have been quite expensive to create and configure client for every incoming
        // request since it involves parsing of the config, reading of the SSL certificate and
        // key files etc. Moreover scoped client needs two Elasticsearch JS clients at the same
        // time: one to support `callAsInternalUser` and another one for `callAsCurrentUser`.
        // To reduce that overhead we create one scoped client per cluster client and share it
        // between all scoped client instances.
        if (this.scopedClient === undefined) {
            this.scopedClient = new elasticsearch_1.Client(elasticsearch_client_config_1.parseElasticsearchClientConfig(this.config, this.log, {
                auth: false,
                ignoreCertAndKey: !this.config.ssl || !this.config.ssl.alwaysPresentCertificate,
            }));
        }
        return new scoped_cluster_client_1.LegacyScopedClusterClient(this.callAsInternalUser, this.callAsCurrentUser, router_1.filterHeaders(this.getHeaders(request), this.config.requestHeadersWhitelist), this.getScopedAuditor(request));
    }
    getScopedAuditor(request) {
        // TODO: support alternative credential owners from outside of Request context in #39430
        if (request && http_1.isRealRequest(request)) {
            const kibanaRequest = request instanceof http_1.KibanaRequest ? request : http_1.KibanaRequest.from(request);
            const auditorFactory = this.getAuditorFactory();
            return auditorFactory.asScoped(kibanaRequest);
        }
    }
    assertIsNotClosed() {
        if (this.isClosed) {
            throw new Error('Cluster client cannot be used after it has been closed.');
        }
    }
    getHeaders(request) {
        if (!http_1.isRealRequest(request)) {
            return request && request.headers ? request.headers : {};
        }
        const authHeaders = this.getAuthHeaders(request);
        const headers = router_1.ensureRawRequest(request).headers;
        return { ...headers, ...authHeaders };
    }
}
exports.LegacyClusterClient = LegacyClusterClient;
