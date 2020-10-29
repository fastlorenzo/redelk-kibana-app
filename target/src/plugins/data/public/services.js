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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSearchService = exports.getSearchService = exports.setInjectedMetadata = exports.getInjectedMetadata = exports.setQueryService = exports.getQueryService = exports.setIndexPatterns = exports.getIndexPatterns = exports.setOverlays = exports.getOverlays = exports.setFieldFormats = exports.getFieldFormats = exports.setHttp = exports.getHttp = exports.setUiSettings = exports.getUiSettings = exports.setNotifications = exports.getNotifications = void 0;
const public_1 = require("../../kibana_utils/public");
_a = __read(public_1.createGetterSetter('Notifications'), 2), exports.getNotifications = _a[0], exports.setNotifications = _a[1];
_b = __read(public_1.createGetterSetter('UiSettings'), 2), exports.getUiSettings = _b[0], exports.setUiSettings = _b[1];
_c = __read(public_1.createGetterSetter('Http'), 2), exports.getHttp = _c[0], exports.setHttp = _c[1];
_d = __read(public_1.createGetterSetter('FieldFormats'), 2), exports.getFieldFormats = _d[0], exports.setFieldFormats = _d[1];
_e = __read(public_1.createGetterSetter('Overlays'), 2), exports.getOverlays = _e[0], exports.setOverlays = _e[1];
_f = __read(public_1.createGetterSetter('IndexPatterns'), 2), exports.getIndexPatterns = _f[0], exports.setIndexPatterns = _f[1];
_g = __read(public_1.createGetterSetter('Query'), 2), exports.getQueryService = _g[0], exports.setQueryService = _g[1];
_h = __read(public_1.createGetterSetter('InjectedMetadata'), 2), exports.getInjectedMetadata = _h[0], exports.setInjectedMetadata = _h[1];
_j = __read(public_1.createGetterSetter('Search'), 2), exports.getSearchService = _j[0], exports.setSearchService = _j[1];
