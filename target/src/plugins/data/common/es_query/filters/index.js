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
exports.isFilterDisabled = exports.cleanFilter = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
tslib_1.__exportStar(require("./build_filters"), exports);
tslib_1.__exportStar(require("./custom_filter"), exports);
tslib_1.__exportStar(require("./exists_filter"), exports);
tslib_1.__exportStar(require("./geo_bounding_box_filter"), exports);
tslib_1.__exportStar(require("./geo_polygon_filter"), exports);
tslib_1.__exportStar(require("./get_display_value"), exports);
tslib_1.__exportStar(require("./get_filter_field"), exports);
tslib_1.__exportStar(require("./get_filter_params"), exports);
tslib_1.__exportStar(require("./get_index_pattern_from_filter"), exports);
tslib_1.__exportStar(require("./match_all_filter"), exports);
tslib_1.__exportStar(require("./meta_filter"), exports);
tslib_1.__exportStar(require("./missing_filter"), exports);
tslib_1.__exportStar(require("./phrase_filter"), exports);
tslib_1.__exportStar(require("./phrases_filter"), exports);
tslib_1.__exportStar(require("./query_string_filter"), exports);
tslib_1.__exportStar(require("./range_filter"), exports);
tslib_1.__exportStar(require("./types"), exports);
/**
 * Clean out any invalid attributes from the filters
 * @param {object} filter The filter to clean
 * @returns {object}
 */
exports.cleanFilter = (filter) => lodash_1.omit(filter, ['meta', '$state']);
exports.isFilterDisabled = (filter) => lodash_1.get(filter, 'meta.disabled', false);
