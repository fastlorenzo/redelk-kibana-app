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
exports.changeTimeFilter = exports.convertRangeFilterToTimeRangeString = exports.convertRangeFilterToTimeRange = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const lodash_1 = require("lodash");
function convertRangeFilterToTimeRange(filter) {
    const key = lodash_1.keys(filter.range)[0];
    const values = filter.range[key];
    return {
        from: moment_1.default(values.gt || values.gte),
        to: moment_1.default(values.lt || values.lte),
    };
}
exports.convertRangeFilterToTimeRange = convertRangeFilterToTimeRange;
function convertRangeFilterToTimeRangeString(filter) {
    const { from, to } = convertRangeFilterToTimeRange(filter);
    return {
        from: from?.toISOString(),
        to: to?.toISOString(),
    };
}
exports.convertRangeFilterToTimeRangeString = convertRangeFilterToTimeRangeString;
function changeTimeFilter(timeFilter, filter) {
    timeFilter.setTime(convertRangeFilterToTimeRange(filter));
}
exports.changeTimeFilter = changeTimeFilter;
