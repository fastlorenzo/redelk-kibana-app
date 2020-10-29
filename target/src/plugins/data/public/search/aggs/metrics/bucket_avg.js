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
exports.getBucketAvgMetricAgg = void 0;
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const metric_agg_type_1 = require("./metric_agg_type");
const make_nested_label_1 = require("./lib/make_nested_label");
const sibling_pipeline_agg_helper_1 = require("./lib/sibling_pipeline_agg_helper");
const metric_agg_types_1 = require("./metric_agg_types");
const overallAverageLabel = i18n_1.i18n.translate('data.search.aggs.metrics.overallAverageLabel', {
    defaultMessage: 'overall average',
});
const averageBucketTitle = i18n_1.i18n.translate('data.search.aggs.metrics.averageBucketTitle', {
    defaultMessage: 'Average Bucket',
});
exports.getBucketAvgMetricAgg = () => {
    const { subtype, params, getSerializedFormat } = sibling_pipeline_agg_helper_1.siblingPipelineAggHelper;
    return new metric_agg_type_1.MetricAggType({
        name: metric_agg_types_1.METRIC_TYPES.AVG_BUCKET,
        title: averageBucketTitle,
        makeLabel: (agg) => make_nested_label_1.makeNestedLabel(agg, overallAverageLabel),
        subtype,
        params: [...params()],
        getSerializedFormat,
        getValue(agg, bucket) {
            const customMetric = agg.getParam('customMetric');
            const customBucket = agg.getParam('customBucket');
            const scaleMetrics = customMetric.type && customMetric.type.isScalable();
            let value = bucket[agg.id] && bucket[agg.id].value;
            if (scaleMetrics && customBucket.type.name === 'date_histogram') {
                const aggInfo = customBucket.write();
                value *= lodash_1.get(aggInfo, 'bucketInterval.scale', 1);
            }
            return value;
        },
    });
};
