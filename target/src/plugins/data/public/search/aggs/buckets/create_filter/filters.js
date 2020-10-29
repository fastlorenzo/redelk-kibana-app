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
exports.createFilterFilters = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../../../../../common");
exports.createFilterFilters = (aggConfig, key) => {
    // have the aggConfig write agg dsl params
    const dslFilters = lodash_1.get(aggConfig.toDsl(), 'filters.filters');
    const filter = dslFilters[key];
    const indexPattern = aggConfig.getIndexPattern();
    if (filter && indexPattern && indexPattern.id) {
        return common_1.buildQueryFilter(filter, indexPattern.id, key);
    }
};
