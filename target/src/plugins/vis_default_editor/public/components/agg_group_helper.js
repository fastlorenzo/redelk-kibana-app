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
exports.getEnabledMetricAggsCount = exports.isInvalidAggsTouched = exports.calcAggIsTooLow = exports.isAggRemovable = void 0;
const lodash_1 = require("lodash");
const schemas_1 = require("../schemas");
const isAggRemovable = (agg, group, schemas) => {
    const schema = schemas_1.getSchemaByName(schemas, agg.schema);
    const metricCount = group.reduce((count, aggregation) => (aggregation.schema === agg.schema ? ++count : count), 0);
    // make sure the the number of these aggs is above the min
    return metricCount > schema.min;
};
exports.isAggRemovable = isAggRemovable;
const getEnabledMetricAggsCount = (group) => {
    return group.reduce((count, aggregation) => aggregation.schema === 'metric' && aggregation.enabled ? ++count : count, 0);
};
exports.getEnabledMetricAggsCount = getEnabledMetricAggsCount;
const calcAggIsTooLow = (agg, aggIndex, group, schemas) => {
    const schema = schemas_1.getSchemaByName(schemas, agg.schema);
    if (!schema.mustBeFirst) {
        return false;
    }
    const firstDifferentSchema = lodash_1.findIndex(group, (aggr) => {
        return aggr.schema !== agg.schema;
    });
    if (firstDifferentSchema === -1) {
        return false;
    }
    return aggIndex > firstDifferentSchema;
};
exports.calcAggIsTooLow = calcAggIsTooLow;
function isInvalidAggsTouched(aggsState) {
    const invalidAggs = Object.values(aggsState).filter((agg) => !agg.valid);
    if (lodash_1.isEmpty(invalidAggs)) {
        return false;
    }
    return invalidAggs.every((agg) => agg.touched);
}
exports.isInvalidAggsTouched = isInvalidAggsTouched;
