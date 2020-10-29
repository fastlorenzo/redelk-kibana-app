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
exports.DiscoverUrlGenerator = exports.DISCOVER_APP_URL_GENERATOR = void 0;
const public_1 = require("../../data/public");
const public_2 = require("../../kibana_utils/public");
exports.DISCOVER_APP_URL_GENERATOR = 'DISCOVER_APP_URL_GENERATOR';
class DiscoverUrlGenerator {
    constructor(params) {
        this.params = params;
        this.id = exports.DISCOVER_APP_URL_GENERATOR;
        this.createUrl = async ({ filters, indexPatternId, query, refreshInterval, savedSearchId, timeRange, useHash = this.params.useHash, }) => {
            const savedSearchPath = savedSearchId ? encodeURIComponent(savedSearchId) : '';
            const appState = {};
            const queryState = {};
            if (query)
                appState.query = query;
            if (filters && filters.length)
                appState.filters = filters?.filter((f) => !public_1.esFilters.isFilterPinned(f));
            if (indexPatternId)
                appState.index = indexPatternId;
            if (timeRange)
                queryState.time = timeRange;
            if (filters && filters.length)
                queryState.filters = filters?.filter((f) => public_1.esFilters.isFilterPinned(f));
            if (refreshInterval)
                queryState.refreshInterval = refreshInterval;
            let url = `${this.params.appBasePath}#/${savedSearchPath}`;
            url = public_2.setStateToKbnUrl('_g', queryState, { useHash }, url);
            url = public_2.setStateToKbnUrl('_a', appState, { useHash }, url);
            return url;
        };
    }
}
exports.DiscoverUrlGenerator = DiscoverUrlGenerator;
