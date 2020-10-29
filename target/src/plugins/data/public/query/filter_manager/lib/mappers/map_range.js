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
exports.mapRange = exports.isMapRangeFilter = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../../../../../common");
const getFormattedValueFn = (left, right) => {
    return (formatter) => {
        let displayValue = `${left} to ${right}`;
        if (formatter) {
            const convert = formatter.getConverterFor('text');
            displayValue = `${convert(left)} to ${convert(right)}`;
        }
        return displayValue;
    };
};
const getFirstRangeKey = (filter) => filter.range && Object.keys(filter.range)[0];
const getRangeByKey = (filter, key) => lodash_1.get(filter, ['range', key]);
function getParams(filter) {
    const isScriptedRange = common_1.isScriptedRangeFilter(filter);
    const key = (isScriptedRange ? filter.meta.field : getFirstRangeKey(filter)) || '';
    const params = isScriptedRange
        ? lodash_1.get(filter, 'script.script.params')
        : getRangeByKey(filter, key);
    let left = lodash_1.hasIn(params, 'gte') ? params.gte : params.gt;
    if (left == null)
        left = -Infinity;
    let right = lodash_1.hasIn(params, 'lte') ? params.lte : params.lt;
    if (right == null)
        right = Infinity;
    const value = getFormattedValueFn(left, right);
    return { type: common_1.FILTERS.RANGE, key, value, params };
}
exports.isMapRangeFilter = (filter) => common_1.isRangeFilter(filter) || common_1.isScriptedRangeFilter(filter);
exports.mapRange = (filter) => {
    if (!exports.isMapRangeFilter(filter)) {
        throw filter;
    }
    return getParams(filter);
};
