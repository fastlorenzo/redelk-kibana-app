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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setExpressionsService = exports.getExpressionsService = exports.setRenderersRegistry = exports.getRenderersRegistry = exports.setNotifications = exports.getNotifications = exports.setInterpreter = exports.getInterpreter = exports.setCoreStart = exports.getCoreStart = void 0;
const public_1 = require("../../kibana_utils/public");
_a = public_1.createKibanaUtilsCore(), exports.getCoreStart = _a.getCoreStart, exports.setCoreStart = _a.setCoreStart;
_b = __read(public_1.createGetterSetter('Interpreter'), 2), exports.getInterpreter = _b[0], exports.setInterpreter = _b[1];
_c = __read(public_1.createGetterSetter('Notifications'), 2), exports.getNotifications = _c[0], exports.setNotifications = _c[1];
_d = __read(public_1.createGetterSetter('Renderers registry'), 2), exports.getRenderersRegistry = _d[0], exports.setRenderersRegistry = _d[1];
_e = __read(public_1.createGetterSetter('ExpressionsService'), 2), exports.getExpressionsService = _e[0], exports.setExpressionsService = _e[1];
