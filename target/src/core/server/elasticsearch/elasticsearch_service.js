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
exports.ElasticsearchService = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../utils");
const legacy_1 = require("./legacy");
const client_1 = require("./client");
const elasticsearch_config_1 = require("./elasticsearch_config");
const ensure_es_version_1 = require("./version_check/ensure_es_version");
const status_1 = require("./status");
/** @internal */
class ElasticsearchService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.stop$ = new rxjs_1.Subject();
        this.getAuditorFactory = () => {
            if (!this.auditorFactory) {
                throw new Error('auditTrail has not been initialized');
            }
            return this.auditorFactory;
        };
        this.kibanaVersion = coreContext.env.packageInfo.version;
        this.log = coreContext.logger.get('elasticsearch-service');
        this.config$ = coreContext.configService
            .atPath('elasticsearch')
            .pipe(operators_1.map((rawConfig) => new elasticsearch_config_1.ElasticsearchConfig(rawConfig)));
    }
    async setup(deps) {
        this.log.debug('Setting up elasticsearch service');
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        this.getAuthHeaders = deps.http.getAuthHeaders;
        this.legacyClient = this.createLegacyClusterClient('data', config);
        const esNodesCompatibility$ = ensure_es_version_1.pollEsNodesVersion({
            callWithInternalUser: this.legacyClient.callAsInternalUser,
            log: this.log,
            ignoreVersionMismatch: config.ignoreVersionMismatch,
            esVersionCheckInterval: config.healthCheckDelay.asMilliseconds(),
            kibanaVersion: this.kibanaVersion,
        }).pipe(operators_1.takeUntil(this.stop$), operators_1.shareReplay({ refCount: true, bufferSize: 1 }));
        this.createLegacyCustomClient = (type, clientConfig = {}) => {
            const finalConfig = utils_1.merge({}, config, clientConfig);
            return this.createLegacyClusterClient(type, finalConfig);
        };
        return {
            legacy: {
                config$: this.config$,
                client: this.legacyClient,
                createClient: this.createLegacyCustomClient,
            },
            esNodesCompatibility$,
            status$: status_1.calculateStatus$(esNodesCompatibility$),
        };
    }
    async start({ auditTrail }) {
        this.auditorFactory = auditTrail;
        if (!this.legacyClient || !this.createLegacyCustomClient) {
            throw new Error('ElasticsearchService needs to be setup before calling start');
        }
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        this.client = this.createClusterClient('data', config);
        const createClient = (type, clientConfig = {}) => {
            const finalConfig = utils_1.merge({}, config, clientConfig);
            return this.createClusterClient(type, finalConfig);
        };
        return {
            client: this.client,
            createClient,
            legacy: {
                client: this.legacyClient,
                createClient: this.createLegacyCustomClient,
            },
        };
    }
    async stop() {
        this.log.debug('Stopping elasticsearch service');
        this.stop$.next();
        if (this.client) {
            this.client.close();
        }
        if (this.legacyClient) {
            this.legacyClient.close();
        }
    }
    createClusterClient(type, config) {
        return new client_1.ClusterClient(config, this.coreContext.logger.get('elasticsearch', type), this.getAuthHeaders);
    }
    createLegacyClusterClient(type, config) {
        return new legacy_1.LegacyClusterClient(config, this.coreContext.logger.get('elasticsearch', type), this.getAuditorFactory, this.getAuthHeaders);
    }
}
exports.ElasticsearchService = ElasticsearchService;
