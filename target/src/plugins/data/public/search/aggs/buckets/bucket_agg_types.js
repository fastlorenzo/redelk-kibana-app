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
exports.BUCKET_TYPES = void 0;
var BUCKET_TYPES;
(function (BUCKET_TYPES) {
    BUCKET_TYPES["FILTER"] = "filter";
    BUCKET_TYPES["FILTERS"] = "filters";
    BUCKET_TYPES["HISTOGRAM"] = "histogram";
    BUCKET_TYPES["IP_RANGE"] = "ip_range";
    BUCKET_TYPES["DATE_RANGE"] = "date_range";
    BUCKET_TYPES["RANGE"] = "range";
    BUCKET_TYPES["TERMS"] = "terms";
    BUCKET_TYPES["SIGNIFICANT_TERMS"] = "significant_terms";
    BUCKET_TYPES["GEOHASH_GRID"] = "geohash_grid";
    BUCKET_TYPES["GEOTILE_GRID"] = "geotile_grid";
    BUCKET_TYPES["DATE_HISTOGRAM"] = "date_histogram";
})(BUCKET_TYPES = exports.BUCKET_TYPES || (exports.BUCKET_TYPES = {}));
