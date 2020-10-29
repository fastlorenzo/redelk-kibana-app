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
exports.isMetricAggType = exports.MetricAggType = void 0;
const i18n_1 = require("@kbn/i18n");
const agg_type_1 = require("../agg_type");
const metric_agg_types_1 = require("./metric_agg_types");
const metricType = 'metrics';
class MetricAggType extends agg_type_1.AggType {
    constructor(config) {
        super(config);
        this.type = metricType;
        this.getKey = () => { };
        this.getValue =
            config.getValue ||
                ((agg, bucket) => {
                    // Metric types where an empty set equals `zero`
                    const isSettableToZero = [metric_agg_types_1.METRIC_TYPES.CARDINALITY, metric_agg_types_1.METRIC_TYPES.SUM].includes(agg.type.name);
                    // Return proper values when no buckets are present
                    // `Count` handles empty sets properly
                    if (!bucket[agg.id] && isSettableToZero)
                        return 0;
                    return bucket[agg.id] && bucket[agg.id].value;
                });
        this.subtype =
            config.subtype ||
                i18n_1.i18n.translate('data.search.aggs.metrics.metricAggregationsSubtypeTitle', {
                    defaultMessage: 'Metric Aggregations',
                });
        this.isScalable = config.isScalable || (() => false);
    }
}
exports.MetricAggType = MetricAggType;
function isMetricAggType(aggConfig) {
    return aggConfig && aggConfig.type === metricType;
}
exports.isMetricAggType = isMetricAggType;
