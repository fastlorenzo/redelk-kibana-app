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
exports.METRIC_TYPES = void 0;
var METRIC_TYPES;
(function (METRIC_TYPES) {
    METRIC_TYPES["AVG"] = "avg";
    METRIC_TYPES["CARDINALITY"] = "cardinality";
    METRIC_TYPES["AVG_BUCKET"] = "avg_bucket";
    METRIC_TYPES["MAX_BUCKET"] = "max_bucket";
    METRIC_TYPES["MIN_BUCKET"] = "min_bucket";
    METRIC_TYPES["SUM_BUCKET"] = "sum_bucket";
    METRIC_TYPES["COUNT"] = "count";
    METRIC_TYPES["CUMULATIVE_SUM"] = "cumulative_sum";
    METRIC_TYPES["DERIVATIVE"] = "derivative";
    METRIC_TYPES["GEO_BOUNDS"] = "geo_bounds";
    METRIC_TYPES["GEO_CENTROID"] = "geo_centroid";
    METRIC_TYPES["MEDIAN"] = "median";
    METRIC_TYPES["MIN"] = "min";
    METRIC_TYPES["MAX"] = "max";
    METRIC_TYPES["MOVING_FN"] = "moving_avg";
    METRIC_TYPES["SERIAL_DIFF"] = "serial_diff";
    METRIC_TYPES["SUM"] = "sum";
    METRIC_TYPES["TOP_HITS"] = "top_hits";
    METRIC_TYPES["PERCENTILES"] = "percentiles";
    METRIC_TYPES["PERCENTILE_RANKS"] = "percentile_ranks";
    METRIC_TYPES["STD_DEV"] = "std_dev";
})(METRIC_TYPES = exports.METRIC_TYPES || (exports.METRIC_TYPES = {}));
