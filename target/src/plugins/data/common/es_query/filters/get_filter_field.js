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
exports.getFilterField = void 0;
const exists_filter_1 = require("./exists_filter");
const geo_bounding_box_filter_1 = require("./geo_bounding_box_filter");
const geo_polygon_filter_1 = require("./geo_polygon_filter");
const phrase_filter_1 = require("./phrase_filter");
const phrases_filter_1 = require("./phrases_filter");
const range_filter_1 = require("./range_filter");
const missing_filter_1 = require("./missing_filter");
exports.getFilterField = (filter) => {
    if (exists_filter_1.isExistsFilter(filter)) {
        return exists_filter_1.getExistsFilterField(filter);
    }
    if (geo_bounding_box_filter_1.isGeoBoundingBoxFilter(filter)) {
        return geo_bounding_box_filter_1.getGeoBoundingBoxFilterField(filter);
    }
    if (geo_polygon_filter_1.isGeoPolygonFilter(filter)) {
        return geo_polygon_filter_1.getGeoPolygonFilterField(filter);
    }
    if (phrase_filter_1.isPhraseFilter(filter)) {
        return phrase_filter_1.getPhraseFilterField(filter);
    }
    if (phrases_filter_1.isPhrasesFilter(filter)) {
        return phrases_filter_1.getPhrasesFilterField(filter);
    }
    if (range_filter_1.isRangeFilter(filter)) {
        return range_filter_1.getRangeFilterField(filter);
    }
    if (missing_filter_1.isMissingFilter(filter)) {
        return missing_filter_1.getMissingFilterField(filter);
    }
    return;
};
