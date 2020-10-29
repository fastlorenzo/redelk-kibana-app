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
exports.getTime = exports.calculateBounds = void 0;
const tslib_1 = require("tslib");
const datemath_1 = tslib_1.__importDefault(require("@elastic/datemath"));
const __1 = require("../..");
function calculateBounds(timeRange, options = {}) {
    return {
        min: datemath_1.default.parse(timeRange.from, { forceNow: options.forceNow }),
        max: datemath_1.default.parse(timeRange.to, { roundUp: true, forceNow: options.forceNow }),
    };
}
exports.calculateBounds = calculateBounds;
function getTime(indexPattern, timeRange, options) {
    return createTimeRangeFilter(indexPattern, timeRange, options?.fieldName || indexPattern?.timeFieldName, options?.forceNow);
}
exports.getTime = getTime;
function createTimeRangeFilter(indexPattern, timeRange, fieldName, forceNow) {
    if (!indexPattern) {
        return;
    }
    const field = indexPattern.fields.find((f) => f.name === (fieldName || indexPattern.timeFieldName));
    if (!field) {
        return;
    }
    const bounds = calculateBounds(timeRange, { forceNow });
    if (!bounds) {
        return;
    }
    return __1.buildRangeFilter(field, {
        ...(bounds.min && { gte: bounds.min.toISOString() }),
        ...(bounds.max && { lte: bounds.max.toISOString() }),
        format: 'strict_date_optional_time',
    }, indexPattern);
}
