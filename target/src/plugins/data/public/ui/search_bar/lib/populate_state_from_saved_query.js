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
exports.populateStateFromSavedQuery = void 0;
exports.populateStateFromSavedQuery = (queryService, setQueryStringState, savedQuery) => {
    const { timefilter: { timefilter }, filterManager, } = queryService;
    // timefilter
    if (savedQuery.attributes.timefilter) {
        timefilter.setTime({
            from: savedQuery.attributes.timefilter.from,
            to: savedQuery.attributes.timefilter.to,
        });
        if (savedQuery.attributes.timefilter.refreshInterval) {
            timefilter.setRefreshInterval(savedQuery.attributes.timefilter.refreshInterval);
        }
    }
    // query string
    setQueryStringState(savedQuery.attributes.query);
    // filters
    const savedQueryFilters = savedQuery.attributes.filters || [];
    const globalFilters = filterManager.getGlobalFilters();
    filterManager.setFilters([...globalFilters, ...savedQueryFilters]);
};
