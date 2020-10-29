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
exports.getDateRangeBucketAgg = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const i18n_1 = require("@kbn/i18n");
const bucket_agg_types_1 = require("./bucket_agg_types");
const bucket_agg_type_1 = require("./bucket_agg_type");
const date_range_1 = require("./create_filter/date_range");
const common_1 = require("../../../../common");
const dateRangeTitle = i18n_1.i18n.translate('data.search.aggs.buckets.dateRangeTitle', {
    defaultMessage: 'Date Range',
});
exports.getDateRangeBucketAgg = ({ uiSettings }) => new bucket_agg_type_1.BucketAggType({
    name: bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE,
    title: dateRangeTitle,
    createFilter: date_range_1.createFilterDateRange,
    getKey({ from, to }) {
        return { from, to };
    },
    getSerializedFormat(agg) {
        return {
            id: 'date_range',
            params: agg.params.field ? agg.params.field.format.toJSON() : {},
        };
    },
    makeLabel(aggConfig) {
        return aggConfig.getFieldDisplayName() + ' date ranges';
    },
    params: [
        {
            name: 'field',
            type: 'field',
            filterFieldTypes: common_1.KBN_FIELD_TYPES.DATE,
            default(agg) {
                return agg.getIndexPattern().timeFieldName;
            },
        },
        {
            name: 'ranges',
            default: [
                {
                    from: 'now-1w/w',
                    to: 'now',
                },
            ],
        },
        {
            name: 'time_zone',
            default: undefined,
            // Implimentation method is the same as that of date_histogram
            serialize: () => undefined,
            write: (agg, output) => {
                const field = agg.getParam('field');
                let tz = agg.getParam('time_zone');
                if (!tz && field) {
                    tz = lodash_1.get(agg.getIndexPattern(), [
                        'typeMeta',
                        'aggs',
                        'date_range',
                        field.name,
                        'time_zone',
                    ]);
                }
                if (!tz) {
                    const detectedTimezone = moment_timezone_1.default.tz.guess();
                    const tzOffset = moment_timezone_1.default().format('Z');
                    const isDefaultTimezone = uiSettings.isDefault('dateFormat:tz');
                    tz = isDefaultTimezone ? detectedTimezone || tzOffset : uiSettings.get('dateFormat:tz');
                }
                output.params.time_zone = tz;
            },
        },
    ],
});
