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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabifyAggResponse = exports.getResponseInspectorStats = exports.getRequestInspectorStats = exports.setScopedHistory = exports.getScopedHistory = exports.syncHistoryLocations = exports.getHistory = exports.setDocViewsRegistry = exports.getDocViewsRegistry = exports.setUrlTracker = exports.getUrlTracker = exports.setServices = exports.getServices = exports.getAngularModule = exports.setAngularModule = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const history_1 = require("history");
const public_1 = require("../../kibana_utils/public");
const public_2 = require("../../data/public");
let angularModule = null;
let services = null;
/**
 * set bootstrapped inner angular module
 */
function setAngularModule(module) {
    angularModule = module;
}
exports.setAngularModule = setAngularModule;
/**
 * get boostrapped inner angular module
 */
function getAngularModule() {
    return angularModule;
}
exports.getAngularModule = getAngularModule;
function getServices() {
    if (!services) {
        throw new Error('Discover services are not yet available');
    }
    return services;
}
exports.getServices = getServices;
function setServices(newServices) {
    services = newServices;
}
exports.setServices = setServices;
_a = tslib_1.__read(public_1.createGetterSetter('urlTracker'), 2), exports.getUrlTracker = _a[0], exports.setUrlTracker = _a[1];
_b = tslib_1.__read(public_1.createGetterSetter('DocViewsRegistry'), 2), exports.getDocViewsRegistry = _b[0], exports.setDocViewsRegistry = _b[1];
/**
 * Makes sure discover and context are using one instance of history.
 */
exports.getHistory = lodash_1.default.once(() => history_1.createHashHistory());
/**
 * Discover currently uses two `history` instances: one from Kibana Platform and
 * another from `history` package. Below function is used every time Discover
 * app is loaded to synchronize both instances.
 *
 * This helper is temporary until https://github.com/elastic/kibana/issues/65161 is resolved.
 */
exports.syncHistoryLocations = () => {
    const h = exports.getHistory();
    Object.assign(h.location, history_1.createHashHistory().location);
    return h;
};
_c = tslib_1.__read(public_1.createGetterSetter('scopedHistory'), 2), exports.getScopedHistory = _c[0], exports.setScopedHistory = _c[1];
exports.getRequestInspectorStats = public_2.search.getRequestInspectorStats, exports.getResponseInspectorStats = public_2.search.getResponseInspectorStats, exports.tabifyAggResponse = public_2.search.tabifyAggResponse;
var public_3 = require("../../kibana_utils/public");
Object.defineProperty(exports, "unhashUrl", { enumerable: true, get: function () { return public_3.unhashUrl; } });
Object.defineProperty(exports, "redirectWhenMissing", { enumerable: true, get: function () { return public_3.redirectWhenMissing; } });
var public_4 = require("../../kibana_legacy/public");
Object.defineProperty(exports, "formatMsg", { enumerable: true, get: function () { return public_4.formatMsg; } });
Object.defineProperty(exports, "formatStack", { enumerable: true, get: function () { return public_4.formatStack; } });
Object.defineProperty(exports, "subscribeWithScope", { enumerable: true, get: function () { return public_4.subscribeWithScope; } });
// EXPORT types
var public_5 = require("../../data/public");
Object.defineProperty(exports, "IndexPattern", { enumerable: true, get: function () { return public_5.IndexPattern; } });
Object.defineProperty(exports, "indexPatterns", { enumerable: true, get: function () { return public_5.indexPatterns; } });
Object.defineProperty(exports, "SortDirection", { enumerable: true, get: function () { return public_5.SortDirection; } });
