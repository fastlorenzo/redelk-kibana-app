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
exports.SearchService = void 0;
const search_source_1 = require("./search_source");
const legacy_1 = require("./legacy");
const get_force_now_1 = require("../query/timefilter/lib/get_force_now");
const query_1 = require("../../common/query");
const search_interceptor_1 = require("./search_interceptor");
const aggs_1 = require("./aggs");
const collectors_1 = require("./collectors");
class SearchService {
    constructor() {
        this.aggTypesRegistry = new aggs_1.AggTypesRegistry();
        /**
         * getForceNow uses window.location, so we must have a separate implementation
         * of calculateBounds on the client and the server.
         */
        this.calculateBounds = (timeRange) => query_1.calculateBounds(timeRange, { forceNow: get_force_now_1.getForceNow() });
    }
    setup(core, { expressions, usageCollection, packageInfo, getInternalStartServices, }) {
        this.usageCollector = collectors_1.createUsageCollector(core, usageCollection);
        this.esClient = legacy_1.getEsClient(core.injectedMetadata, core.http, packageInfo);
        const aggTypesSetup = this.aggTypesRegistry.setup();
        // register each agg type
        const aggTypes = aggs_1.getAggTypes({
            calculateBounds: this.calculateBounds,
            getInternalStartServices,
            uiSettings: core.uiSettings,
        });
        aggTypes.buckets.forEach((b) => aggTypesSetup.registerBucket(b));
        aggTypes.metrics.forEach((m) => aggTypesSetup.registerMetric(m));
        // register expression functions for each agg type
        const aggFunctions = aggs_1.getAggTypesFunctions();
        aggFunctions.forEach((fn) => expressions.registerFunction(fn));
        return {
            aggs: {
                calculateAutoTimeExpression: aggs_1.getCalculateAutoTimeExpression(core.uiSettings),
                types: aggTypesSetup,
            },
        };
    }
    start(core, dependencies) {
        /**
         * A global object that intercepts all searches and provides convenience methods for cancelling
         * all pending search requests, as well as getting the number of pending search requests.
         * TODO: Make this modular so that apps can opt in/out of search collection, or even provide
         * their own search collector instances
         */
        this.searchInterceptor = new search_interceptor_1.SearchInterceptor({
            toasts: core.notifications.toasts,
            application: core.application,
            http: core.http,
            uiSettings: core.uiSettings,
            usageCollector: this.usageCollector,
        }, core.injectedMetadata.getInjectedVar('esRequestTimeout'));
        const aggTypesStart = this.aggTypesRegistry.start();
        const search = (request, options) => {
            return this.searchInterceptor.search(request, options);
        };
        const legacySearch = {
            esClient: this.esClient,
        };
        const searchSourceDependencies = {
            uiSettings: core.uiSettings,
            injectedMetadata: core.injectedMetadata,
            search,
            legacySearch,
        };
        return {
            aggs: {
                calculateAutoTimeExpression: aggs_1.getCalculateAutoTimeExpression(core.uiSettings),
                createAggConfigs: (indexPattern, configStates = [], schemas) => {
                    return new aggs_1.AggConfigs(indexPattern, configStates, {
                        typesRegistry: aggTypesStart,
                    });
                },
                types: aggTypesStart,
            },
            search,
            usageCollector: this.usageCollector,
            searchSource: {
                create: search_source_1.createSearchSource(dependencies.indexPatterns, searchSourceDependencies),
                createEmpty: () => {
                    return new search_source_1.SearchSource({}, searchSourceDependencies);
                },
            },
            setInterceptor: (searchInterceptor) => {
                // TODO: should an intercepror have a destroy method?
                this.searchInterceptor = searchInterceptor;
            },
            __LEGACY: legacySearch,
        };
    }
    stop() { }
}
exports.SearchService = SearchService;
