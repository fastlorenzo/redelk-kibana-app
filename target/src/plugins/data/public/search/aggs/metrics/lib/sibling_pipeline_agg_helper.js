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
exports.siblingPipelineAggHelper = exports.siblingPipelineType = void 0;
const i18n_1 = require("@kbn/i18n");
const sibling_pipeline_agg_writer_1 = require("./sibling_pipeline_agg_writer");
const nested_agg_helpers_1 = require("./nested_agg_helpers");
const metricAggFilter = [
    '!top_hits',
    '!percentiles',
    '!percentile_ranks',
    '!median',
    '!std_dev',
    '!sum_bucket',
    '!avg_bucket',
    '!min_bucket',
    '!max_bucket',
    '!derivative',
    '!moving_avg',
    '!serial_diff',
    '!cumulative_sum',
    '!geo_bounds',
    '!geo_centroid',
];
const bucketAggFilter = [];
exports.siblingPipelineType = i18n_1.i18n.translate('data.search.aggs.metrics.siblingPipelineAggregationsSubtypeTitle', {
    defaultMessage: 'Sibling pipeline aggregations',
});
exports.siblingPipelineAggHelper = {
    subtype: exports.siblingPipelineType,
    params() {
        return [
            {
                name: 'customBucket',
                type: 'agg',
                allowedAggs: bucketAggFilter,
                default: null,
                makeAgg(agg, state = { type: 'date_histogram' }) {
                    const orderAgg = agg.aggConfigs.createAggConfig(state, { addToAggConfigs: false });
                    orderAgg.id = agg.id + '-bucket';
                    return orderAgg;
                },
                modifyAggConfigOnSearchRequestStart: nested_agg_helpers_1.forwardModifyAggConfigOnSearchRequestStart('customBucket'),
                write: () => { },
            },
            {
                name: 'customMetric',
                type: 'agg',
                allowedAggs: metricAggFilter,
                default: null,
                makeAgg(agg, state = { type: 'count' }) {
                    const orderAgg = agg.aggConfigs.createAggConfig(state, { addToAggConfigs: false });
                    orderAgg.id = agg.id + '-metric';
                    return orderAgg;
                },
                modifyAggConfigOnSearchRequestStart: nested_agg_helpers_1.forwardModifyAggConfigOnSearchRequestStart('customMetric'),
                write: sibling_pipeline_agg_writer_1.siblingPipelineAggWriter,
            },
        ];
    },
    getSerializedFormat(agg) {
        const customMetric = agg.getParam('customMetric');
        return customMetric ? customMetric.type.getSerializedFormat(customMetric) : {};
    },
};
