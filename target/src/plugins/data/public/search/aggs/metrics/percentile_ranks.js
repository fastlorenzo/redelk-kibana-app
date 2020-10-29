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
exports.getPercentileRanksMetricAgg = void 0;
const i18n_1 = require("@kbn/i18n");
const metric_agg_type_1 = require("./metric_agg_type");
const get_response_agg_config_class_1 = require("./lib/get_response_agg_config_class");
const percentiles_get_value_1 = require("./percentiles_get_value");
const metric_agg_types_1 = require("./metric_agg_types");
const common_1 = require("../../../../common");
const getValueProps = (getInternalStartServices) => {
    return {
        makeLabel() {
            const { fieldFormats } = getInternalStartServices();
            const field = this.getField();
            const format = (field && field.format) || fieldFormats.getDefaultInstance(common_1.KBN_FIELD_TYPES.NUMBER);
            const customLabel = this.getParam('customLabel');
            const label = customLabel || this.getFieldDisplayName();
            return i18n_1.i18n.translate('data.search.aggs.metrics.percentileRanks.valuePropsLabel', {
                defaultMessage: 'Percentile rank {format} of "{label}"',
                values: { format: format.convert(this.key, 'text'), label },
            });
        },
    };
};
exports.getPercentileRanksMetricAgg = ({ getInternalStartServices, }) => {
    return new metric_agg_type_1.MetricAggType({
        name: metric_agg_types_1.METRIC_TYPES.PERCENTILE_RANKS,
        title: i18n_1.i18n.translate('data.search.aggs.metrics.percentileRanksTitle', {
            defaultMessage: 'Percentile Ranks',
        }),
        makeLabel(agg) {
            return i18n_1.i18n.translate('data.search.aggs.metrics.percentileRanksLabel', {
                defaultMessage: 'Percentile ranks of {field}',
                values: { field: agg.getFieldDisplayName() },
            });
        },
        params: [
            {
                name: 'field',
                type: 'field',
                filterFieldTypes: [common_1.KBN_FIELD_TYPES.NUMBER, common_1.KBN_FIELD_TYPES.HISTOGRAM],
            },
            {
                name: 'values',
                default: [],
            },
            {
                write(agg, output) {
                    output.params.keyed = false;
                },
            },
        ],
        getResponseAggs(agg) {
            const ValueAggConfig = get_response_agg_config_class_1.getResponseAggConfigClass(agg, getValueProps(getInternalStartServices));
            const values = agg.getParam('values');
            return values.map((value) => new ValueAggConfig(value));
        },
        getSerializedFormat(agg) {
            return {
                id: 'percent',
            };
        },
        getValue(agg, bucket) {
            return percentiles_get_value_1.getPercentileValue(agg, bucket) / 100;
        },
    });
};
