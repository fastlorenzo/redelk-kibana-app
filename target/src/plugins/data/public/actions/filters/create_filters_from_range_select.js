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
exports.createFiltersFromRangeSelectAction = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const public_1 = require("../../../public");
const services_1 = require("../../../public/services");
const utils_1 = require("../../search/expressions/utils");
async function createFiltersFromRangeSelectAction(event) {
    const column = event.table.columns[event.column];
    if (!column || !column.meta) {
        return [];
    }
    const indexPattern = await services_1.getIndexPatterns().get(column.meta.indexPatternId);
    const aggConfig = utils_1.deserializeAggConfig({
        ...column.meta,
        indexPattern,
    });
    const field = aggConfig.params.field;
    if (!field || event.range.length <= 1) {
        return [];
    }
    const min = event.range[0];
    const max = lodash_1.last(event.range);
    if (min === max) {
        return [];
    }
    const isDate = field.type === 'date';
    const range = {
        gte: isDate ? moment_1.default(min).toISOString() : min,
        lt: isDate ? moment_1.default(max).toISOString() : max,
    };
    if (isDate) {
        range.format = 'strict_date_optional_time';
    }
    return public_1.esFilters.mapAndFlattenFilters([public_1.esFilters.buildRangeFilter(field, range, indexPattern)]);
}
exports.createFiltersFromRangeSelectAction = createFiltersFromRangeSelectAction;
