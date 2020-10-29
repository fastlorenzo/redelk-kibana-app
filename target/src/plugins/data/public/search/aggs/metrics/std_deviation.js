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
exports.getStdDeviationMetricAgg = void 0;
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const metric_agg_type_1 = require("./metric_agg_type");
const metric_agg_types_1 = require("./metric_agg_types");
const get_response_agg_config_class_1 = require("./lib/get_response_agg_config_class");
const common_1 = require("../../../../common");
const responseAggConfigProps = {
    valProp() {
        const customLabel = this.getParam('customLabel');
        const details = this.keyedDetails(customLabel)[this.key];
        return details.valProp;
    },
    makeLabel() {
        const fieldDisplayName = this.getFieldDisplayName();
        const customLabel = this.getParam('customLabel');
        const details = this.keyedDetails(customLabel, fieldDisplayName);
        return lodash_1.get(details, [this.key, 'title']);
    },
    keyedDetails(customLabel, fieldDisplayName) {
        const label = customLabel ||
            i18n_1.i18n.translate('data.search.aggs.metrics.standardDeviation.keyDetailsLabel', {
                defaultMessage: 'Standard Deviation of {fieldDisplayName}',
                values: { fieldDisplayName },
            });
        return {
            std_lower: {
                valProp: ['std_deviation_bounds', 'lower'],
                title: i18n_1.i18n.translate('data.search.aggs.metrics.standardDeviation.lowerKeyDetailsTitle', {
                    defaultMessage: 'Lower {label}',
                    values: { label },
                }),
            },
            std_upper: {
                valProp: ['std_deviation_bounds', 'upper'],
                title: i18n_1.i18n.translate('data.search.aggs.metrics.standardDeviation.upperKeyDetailsTitle', {
                    defaultMessage: 'Upper {label}',
                    values: { label },
                }),
            },
        };
    },
};
exports.getStdDeviationMetricAgg = () => {
    return new metric_agg_type_1.MetricAggType({
        name: metric_agg_types_1.METRIC_TYPES.STD_DEV,
        dslName: 'extended_stats',
        title: i18n_1.i18n.translate('data.search.aggs.metrics.standardDeviationTitle', {
            defaultMessage: 'Standard Deviation',
        }),
        makeLabel(agg) {
            return i18n_1.i18n.translate('data.search.aggs.metrics.standardDeviationLabel', {
                defaultMessage: 'Standard Deviation of {field}',
                values: { field: agg.getFieldDisplayName() },
            });
        },
        params: [
            {
                name: 'field',
                type: 'field',
                filterFieldTypes: common_1.KBN_FIELD_TYPES.NUMBER,
            },
        ],
        getResponseAggs(agg) {
            const ValueAggConfig = get_response_agg_config_class_1.getResponseAggConfigClass(agg, responseAggConfigProps);
            return [new ValueAggConfig('std_lower'), new ValueAggConfig('std_upper')];
        },
        getValue(agg, bucket) {
            return lodash_1.get(bucket[agg.parentId], agg.valProp());
        },
    });
};
