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
exports.getCardinalityMetricAgg = void 0;
const i18n_1 = require("@kbn/i18n");
const metric_agg_type_1 = require("./metric_agg_type");
const metric_agg_types_1 = require("./metric_agg_types");
const common_1 = require("../../../../common");
const uniqueCountTitle = i18n_1.i18n.translate('data.search.aggs.metrics.uniqueCountTitle', {
    defaultMessage: 'Unique Count',
});
exports.getCardinalityMetricAgg = () => new metric_agg_type_1.MetricAggType({
    name: metric_agg_types_1.METRIC_TYPES.CARDINALITY,
    title: uniqueCountTitle,
    makeLabel(aggConfig) {
        return i18n_1.i18n.translate('data.search.aggs.metrics.uniqueCountLabel', {
            defaultMessage: 'Unique count of {field}',
            values: { field: aggConfig.getFieldDisplayName() },
        });
    },
    getSerializedFormat(agg) {
        return {
            id: 'number',
        };
    },
    params: [
        {
            name: 'field',
            type: 'field',
            filterFieldTypes: Object.values(common_1.KBN_FIELD_TYPES).filter((type) => type !== common_1.KBN_FIELD_TYPES.HISTOGRAM),
        },
    ],
});
