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
exports.initAggsState = exports.aggGroupReducer = exports.AGGS_ACTION_KEYS = void 0;
var AGGS_ACTION_KEYS;
(function (AGGS_ACTION_KEYS) {
    AGGS_ACTION_KEYS["TOUCHED"] = "aggsTouched";
    AGGS_ACTION_KEYS["VALID"] = "aggsValid";
})(AGGS_ACTION_KEYS = exports.AGGS_ACTION_KEYS || (exports.AGGS_ACTION_KEYS = {}));
function aggGroupReducer(state, action) {
    const aggState = state[action.aggId] || { touched: false, valid: true };
    switch (action.type) {
        case AGGS_ACTION_KEYS.TOUCHED:
            return { ...state, [action.aggId]: { ...aggState, touched: action.payload } };
        case AGGS_ACTION_KEYS.VALID:
            return { ...state, [action.aggId]: { ...aggState, valid: action.payload } };
        default:
            throw new Error();
    }
}
exports.aggGroupReducer = aggGroupReducer;
function initAggsState(group) {
    return group.reduce((state, agg) => {
        state[agg.id] = { touched: false, valid: true };
        return state;
    }, {});
}
exports.initAggsState = initAggsState;
