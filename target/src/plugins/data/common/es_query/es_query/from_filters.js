"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFromFilters = void 0;
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
const lodash_1 = require("lodash");
const migrate_filter_1 = require("./migrate_filter");
const filter_matches_index_1 = require("./filter_matches_index");
const filters_1 = require("../filters");
const handle_nested_filter_1 = require("./handle_nested_filter");
/**
 * Create a filter that can be reversed for filters with negate set
 * @param {boolean} reverse This will reverse the filter. If true then
 *                          anything where negate is set will come
 *                          through otherwise it will filter out
 * @returns {function}
 */
const filterNegate = (reverse) => (filter) => {
    if (lodash_1.isUndefined(filter.meta) || lodash_1.isUndefined(filter.meta.negate)) {
        return !reverse;
    }
    return filter.meta && filter.meta.negate === reverse;
};
/**
 * Translate a filter into a query to support es 5+
 * @param  {Object} filter - The filter to translate
 * @return {Object} the query version of that filter
 */
const translateToQuery = (filter) => {
    if (!filter)
        return;
    if (filter.query) {
        return filter.query;
    }
    return filter;
};
exports.buildQueryFromFilters = (filters = [], indexPattern, ignoreFilterIfFieldNotInIndex = false) => {
    filters = filters.filter((filter) => filter && !filters_1.isFilterDisabled(filter));
    const filtersToESQueries = (negate) => {
        return filters
            .filter(filterNegate(negate))
            .filter((filter) => !ignoreFilterIfFieldNotInIndex || filter_matches_index_1.filterMatchesIndex(filter, indexPattern))
            .map((filter) => {
            return migrate_filter_1.migrateFilter(filter, indexPattern);
        })
            .map((filter) => handle_nested_filter_1.handleNestedFilter(filter, indexPattern))
            .map(translateToQuery)
            .map(filters_1.cleanFilter);
    };
    return {
        must: [],
        filter: filtersToESQueries(false),
        should: [],
        must_not: filtersToESQueries(true),
    };
};
