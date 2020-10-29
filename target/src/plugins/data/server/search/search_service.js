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
const routes_1 = require("./routes");
const es_search_1 = require("./es_search");
const register_1 = require("./collectors/register");
const usage_1 = require("./collectors/usage");
const saved_objects_1 = require("../saved_objects");
class SearchService {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.searchStrategies = {};
        this.registerSearchStrategy = (name, strategy) => {
            this.searchStrategies[name] = strategy;
        };
        this.getSearchStrategy = (name) => {
            const strategy = this.searchStrategies[name];
            if (!strategy) {
                throw new Error(`Search strategy ${name} not found`);
            }
            return strategy;
        };
    }
    setup(core, { usageCollection }) {
        const usage = usageCollection ? usage_1.usageProvider(core) : undefined;
        this.registerSearchStrategy(es_search_1.ES_SEARCH_STRATEGY, es_search_1.esSearchStrategyProvider(this.initializerContext.config.legacy.globalConfig$, usage));
        core.savedObjects.registerType(saved_objects_1.searchTelemetry);
        if (usageCollection) {
            register_1.registerUsageCollector(usageCollection, this.initializerContext);
        }
        routes_1.registerSearchRoute(core);
        return { registerSearchStrategy: this.registerSearchStrategy, usage };
    }
    search(context, searchRequest, options) {
        return this.getSearchStrategy(options.strategy || es_search_1.ES_SEARCH_STRATEGY).search(context, searchRequest, { signal: options.signal });
    }
    start() {
        return {
            getSearchStrategy: this.getSearchStrategy,
            search: this.search,
        };
    }
    stop() { }
}
exports.SearchService = SearchService;
