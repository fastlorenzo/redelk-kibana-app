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
exports.getCumulativeSumMetricAgg = void 0;
const i18n_1 = require("@kbn/i18n");
const metric_agg_type_1 = require("./metric_agg_type");
const parent_pipeline_agg_helper_1 = require("./lib/parent_pipeline_agg_helper");
const make_nested_label_1 = require("./lib/make_nested_label");
const metric_agg_types_1 = require("./metric_agg_types");
const cumulativeSumLabel = i18n_1.i18n.translate('data.search.aggs.metrics.cumulativeSumLabel', {
    defaultMessage: 'cumulative sum',
});
const cumulativeSumTitle = i18n_1.i18n.translate('data.search.aggs.metrics.cumulativeSumTitle', {
    defaultMessage: 'Cumulative Sum',
});
exports.getCumulativeSumMetricAgg = () => {
    const { subtype, params, getSerializedFormat } = parent_pipeline_agg_helper_1.parentPipelineAggHelper;
    return new metric_agg_type_1.MetricAggType({
        name: metric_agg_types_1.METRIC_TYPES.CUMULATIVE_SUM,
        title: cumulativeSumTitle,
        makeLabel: (agg) => make_nested_label_1.makeNestedLabel(agg, cumulativeSumLabel),
        subtype,
        params: [...params()],
        getSerializedFormat,
    });
};
