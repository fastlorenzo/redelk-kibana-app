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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSavedSearchLoader = exports.getSavedSearchLoader = exports.setChrome = exports.getChrome = exports.setOverlays = exports.getOverlays = exports.setAggs = exports.getAggs = exports.setSavedVisualizationsLoader = exports.getSavedVisualizationsLoader = exports.setUiActions = exports.getUiActions = exports.setExpressions = exports.getExpressions = exports.setUsageCollector = exports.getUsageCollector = exports.setSearch = exports.getSearch = exports.setIndexPatterns = exports.getIndexPatterns = exports.setTimeFilter = exports.getTimeFilter = exports.setFilterManager = exports.getFilterManager = exports.setI18n = exports.getI18n = exports.setTypes = exports.getTypes = exports.setSavedObjects = exports.getSavedObjects = exports.setEmbeddable = exports.getEmbeddable = exports.setApplication = exports.getApplication = exports.setHttp = exports.getHttp = exports.setCapabilities = exports.getCapabilities = exports.setUISettings = exports.getUISettings = void 0;
const public_1 = require("../../../plugins/kibana_utils/public");
_a = __read(public_1.createGetterSetter('UISettings'), 2), exports.getUISettings = _a[0], exports.setUISettings = _a[1];
_b = __read(public_1.createGetterSetter('Capabilities'), 2), exports.getCapabilities = _b[0], exports.setCapabilities = _b[1];
_c = __read(public_1.createGetterSetter('Http'), 2), exports.getHttp = _c[0], exports.setHttp = _c[1];
_d = __read(public_1.createGetterSetter('Application'), 2), exports.getApplication = _d[0], exports.setApplication = _d[1];
_e = __read(public_1.createGetterSetter('Embeddable'), 2), exports.getEmbeddable = _e[0], exports.setEmbeddable = _e[1];
_f = __read(public_1.createGetterSetter('SavedObjects'), 2), exports.getSavedObjects = _f[0], exports.setSavedObjects = _f[1];
_g = __read(public_1.createGetterSetter('Types'), 2), exports.getTypes = _g[0], exports.setTypes = _g[1];
_h = __read(public_1.createGetterSetter('I18n'), 2), exports.getI18n = _h[0], exports.setI18n = _h[1];
_j = __read(public_1.createGetterSetter('FilterManager'), 2), exports.getFilterManager = _j[0], exports.setFilterManager = _j[1];
_k = __read(public_1.createGetterSetter('TimeFilter'), 2), exports.getTimeFilter = _k[0], exports.setTimeFilter = _k[1];
_l = __read(public_1.createGetterSetter('IndexPatterns'), 2), exports.getIndexPatterns = _l[0], exports.setIndexPatterns = _l[1];
_m = __read(public_1.createGetterSetter('Search'), 2), exports.getSearch = _m[0], exports.setSearch = _m[1];
_o = __read(public_1.createGetterSetter('UsageCollection'), 2), exports.getUsageCollector = _o[0], exports.setUsageCollector = _o[1];
_p = __read(public_1.createGetterSetter('Expressions'), 2), exports.getExpressions = _p[0], exports.setExpressions = _p[1];
_q = __read(public_1.createGetterSetter('UiActions'), 2), exports.getUiActions = _q[0], exports.setUiActions = _q[1];
_r = __read(public_1.createGetterSetter('SavedVisualisationsLoader'), 2), exports.getSavedVisualizationsLoader = _r[0], exports.setSavedVisualizationsLoader = _r[1];
_s = __read(public_1.createGetterSetter('AggConfigs'), 2), exports.getAggs = _s[0], exports.setAggs = _s[1];
_t = __read(public_1.createGetterSetter('Overlays'), 2), exports.getOverlays = _t[0], exports.setOverlays = _t[1];
_u = __read(public_1.createGetterSetter('Chrome'), 2), exports.getChrome = _u[0], exports.setChrome = _u[1];
_v = __read(public_1.createGetterSetter('savedSearchLoader'), 2), exports.getSavedSearchLoader = _v[0], exports.setSavedSearchLoader = _v[1];
