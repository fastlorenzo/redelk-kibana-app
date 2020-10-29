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
exports.parentPipelineAggHelper = exports.parentPipelineType = void 0;
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const nested_agg_helpers_1 = require("./nested_agg_helpers");
const parent_pipeline_agg_writer_1 = require("./parent_pipeline_agg_writer");
const metricAggFilter = [
    '!top_hits',
    '!percentiles',
    '!percentile_ranks',
    '!median',
    '!std_dev',
    '!geo_bounds',
    '!geo_centroid',
];
exports.parentPipelineType = i18n_1.i18n.translate('data.search.aggs.metrics.parentPipelineAggregationsSubtypeTitle', {
    defaultMessage: 'Parent Pipeline Aggregations',
});
exports.parentPipelineAggHelper = {
    subtype: exports.parentPipelineType,
    params() {
        return [
            {
                name: 'metricAgg',
                default: 'custom',
                write: parent_pipeline_agg_writer_1.parentPipelineAggWriter,
            },
            {
                name: 'customMetric',
                type: 'agg',
                allowedAggs: metricAggFilter,
                makeAgg(termsAgg, state = { type: 'count' }) {
                    const metricAgg = termsAgg.aggConfigs.createAggConfig(state, { addToAggConfigs: false });
                    metricAgg.id = termsAgg.id + '-metric';
                    return metricAgg;
                },
                modifyAggConfigOnSearchRequestStart: nested_agg_helpers_1.forwardModifyAggConfigOnSearchRequestStart('customMetric'),
                write: lodash_1.noop,
            },
            {
                name: 'buckets_path',
                write: lodash_1.noop,
            },
        ];
    },
    getSerializedFormat(agg) {
        let subAgg;
        const customMetric = agg.getParam('customMetric');
        if (customMetric) {
            subAgg = customMetric;
        }
        else {
            subAgg = agg.aggConfigs.byId(agg.getParam('metricAgg'));
        }
        return subAgg ? subAgg.type.getSerializedFormat(subAgg) : {};
    },
};
