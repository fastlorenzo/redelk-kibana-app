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
exports.getDateHistogramBucketAgg = exports.isDateHistogramBucketAggConfig = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const i18n_1 = require("@kbn/i18n");
const time_buckets_1 = require("./lib/time_buckets");
const bucket_agg_type_1 = require("./bucket_agg_type");
const bucket_agg_types_1 = require("./bucket_agg_types");
const date_histogram_1 = require("./create_filter/date_histogram");
const _interval_options_1 = require("./_interval_options");
const agg_params_1 = require("../agg_params");
const metric_agg_type_1 = require("../metrics/metric_agg_type");
const common_1 = require("../../../../common");
const updateTimeBuckets = (agg, calculateBounds, customBuckets) => {
    const bounds = agg.params.timeRange && (agg.fieldIsTimeField() || agg.params.interval === 'auto')
        ? calculateBounds(agg.params.timeRange)
        : undefined;
    const buckets = customBuckets || agg.buckets;
    buckets.setBounds(bounds);
    buckets.setInterval(agg.params.interval);
};
function isDateHistogramBucketAggConfig(agg) {
    return Boolean(agg.buckets);
}
exports.isDateHistogramBucketAggConfig = isDateHistogramBucketAggConfig;
exports.getDateHistogramBucketAgg = ({ calculateBounds, uiSettings, }) => new bucket_agg_type_1.BucketAggType({
    name: bucket_agg_types_1.BUCKET_TYPES.DATE_HISTOGRAM,
    title: i18n_1.i18n.translate('data.search.aggs.buckets.dateHistogramTitle', {
        defaultMessage: 'Date Histogram',
    }),
    ordered: {
        date: true,
    },
    makeLabel(agg) {
        let output = {};
        if (this.params) {
            output = agg_params_1.writeParams(this.params, agg);
        }
        const field = agg.getFieldDisplayName();
        return i18n_1.i18n.translate('data.search.aggs.buckets.dateHistogramLabel', {
            defaultMessage: '{fieldName} per {intervalDescription}',
            values: {
                fieldName: field,
                intervalDescription: output.metricScaleText || output.bucketInterval.description,
            },
        });
    },
    createFilter: date_histogram_1.createFilterDateHistogram,
    decorateAggConfig() {
        let buckets;
        return {
            buckets: {
                configurable: true,
                get() {
                    if (buckets)
                        return buckets;
                    buckets = new time_buckets_1.TimeBuckets({
                        'histogram:maxBars': uiSettings.get(common_1.UI_SETTINGS.HISTOGRAM_MAX_BARS),
                        'histogram:barTarget': uiSettings.get(common_1.UI_SETTINGS.HISTOGRAM_BAR_TARGET),
                        dateFormat: uiSettings.get('dateFormat'),
                        'dateFormat:scaled': uiSettings.get('dateFormat:scaled'),
                    });
                    updateTimeBuckets(this, calculateBounds, buckets);
                    return buckets;
                },
            },
        };
    },
    getSerializedFormat(agg) {
        return {
            id: 'date',
            params: {
                pattern: agg.buckets.getScaledDateFormat(),
            },
        };
    },
    params: [
        {
            name: 'field',
            type: 'field',
            filterFieldTypes: common_1.KBN_FIELD_TYPES.DATE,
            default(agg) {
                return agg.getIndexPattern().timeFieldName;
            },
            onChange(agg) {
                if (lodash_1.get(agg, 'params.interval') === 'auto' && !agg.fieldIsTimeField()) {
                    delete agg.params.interval;
                }
            },
        },
        {
            name: 'timeRange',
            default: null,
            write: lodash_1.noop,
        },
        {
            name: 'useNormalizedEsInterval',
            default: true,
            write: lodash_1.noop,
        },
        {
            name: 'scaleMetricValues',
            default: false,
            write: lodash_1.noop,
            advanced: true,
        },
        {
            name: 'interval',
            deserialize(state, agg) {
                // For upgrading from 7.0.x to 7.1.x - intervals are now stored as key of options or custom value
                if (state === 'custom') {
                    return lodash_1.get(agg, 'params.customInterval');
                }
                const interval = lodash_1.find(_interval_options_1.intervalOptions, { val: state });
                // For upgrading from 4.0.x to 4.1.x - intervals are now stored as 'y' instead of 'year',
                // but this maps the old values to the new values
                if (!interval && state === 'year') {
                    return 'y';
                }
                return state;
            },
            default: 'auto',
            options: _interval_options_1.intervalOptions,
            write(agg, output, aggs) {
                updateTimeBuckets(agg, calculateBounds);
                const { useNormalizedEsInterval, scaleMetricValues } = agg.params;
                const interval = agg.buckets.getInterval(useNormalizedEsInterval);
                output.bucketInterval = interval;
                if (interval.expression === '0ms') {
                    // We are hitting this code a couple of times while configuring in editor
                    // with an interval of 0ms because the overall time range has not yet been
                    // set. Since 0ms is not a valid ES interval, we cannot pass it through dateHistogramInterval
                    // below, since it would throw an exception. So in the cases we still have an interval of 0ms
                    // here we simply skip the rest of the method and never write an interval into the DSL, since
                    // this DSL will anyway not be used before we're passing this code with an actual interval.
                    return;
                }
                output.params = {
                    ...output.params,
                    ...common_1.dateHistogramInterval(interval.expression),
                };
                const scaleMetrics = scaleMetricValues && interval.scaled && interval.scale && interval.scale < 1;
                if (scaleMetrics && aggs) {
                    const metrics = aggs.aggs.filter((a) => metric_agg_type_1.isMetricAggType(a.type));
                    const all = lodash_1.every(metrics, (a) => {
                        const { type } = a;
                        if (metric_agg_type_1.isMetricAggType(type)) {
                            return type.isScalable();
                        }
                    });
                    if (all) {
                        output.metricScale = interval.scale;
                        output.metricScaleText = interval.preScaled?.description || '';
                    }
                }
            },
        },
        {
            name: 'time_zone',
            default: undefined,
            // We don't ever want this parameter to be serialized out (when saving or to URLs)
            // since we do all the logic handling it "on the fly" in the `write` method, to prevent
            // time_zones being persisted into saved_objects
            serialize: lodash_1.noop,
            write(agg, output) {
                // If a time_zone has been set explicitly always prefer this.
                let tz = agg.params.time_zone;
                if (!tz && agg.params.field) {
                    // If a field has been configured check the index pattern's typeMeta if a date_histogram on that
                    // field requires a specific time_zone
                    tz = lodash_1.get(agg.getIndexPattern(), [
                        'typeMeta',
                        'aggs',
                        'date_histogram',
                        agg.params.field.name,
                        'time_zone',
                    ]);
                }
                if (!tz) {
                    // If the index pattern typeMeta data, didn't had a time zone assigned for the selected field use the configured tz
                    const isDefaultTimezone = uiSettings.isDefault('dateFormat:tz');
                    const detectedTimezone = moment_timezone_1.default.tz.guess();
                    const tzOffset = moment_timezone_1.default().format('Z');
                    tz = isDefaultTimezone ? detectedTimezone || tzOffset : uiSettings.get('dateFormat:tz');
                }
                output.params.time_zone = tz;
            },
        },
        {
            name: 'drop_partials',
            default: false,
            write: lodash_1.noop,
            shouldShow: (agg) => {
                const field = agg.params.field;
                return field && field.name && field.name === agg.getIndexPattern().timeFieldName;
            },
        },
        {
            name: 'format',
        },
        {
            name: 'min_doc_count',
            default: 1,
        },
        {
            name: 'extended_bounds',
            default: {},
            write(agg, output) {
                const val = agg.params.extended_bounds;
                if (val.min != null || val.max != null) {
                    output.params.extended_bounds = {
                        min: moment_timezone_1.default(val.min).valueOf(),
                        max: moment_timezone_1.default(val.max).valueOf(),
                    };
                    return;
                }
            },
        },
    ],
});
