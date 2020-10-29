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
exports.initAggParamsState = exports.aggParamsReducer = exports.aggTypeReducer = exports.AGG_PARAMS_ACTION_KEYS = exports.AGG_TYPE_ACTION_KEYS = void 0;
var AGG_TYPE_ACTION_KEYS;
(function (AGG_TYPE_ACTION_KEYS) {
    AGG_TYPE_ACTION_KEYS["TOUCHED"] = "aggTypeTouched";
    AGG_TYPE_ACTION_KEYS["VALID"] = "aggTypeValid";
})(AGG_TYPE_ACTION_KEYS = exports.AGG_TYPE_ACTION_KEYS || (exports.AGG_TYPE_ACTION_KEYS = {}));
function aggTypeReducer(state, action) {
    switch (action.type) {
        case AGG_TYPE_ACTION_KEYS.TOUCHED:
            return { ...state, touched: action.payload };
        case AGG_TYPE_ACTION_KEYS.VALID:
            return { ...state, valid: action.payload };
        default:
            throw new Error();
    }
}
exports.aggTypeReducer = aggTypeReducer;
var AGG_PARAMS_ACTION_KEYS;
(function (AGG_PARAMS_ACTION_KEYS) {
    AGG_PARAMS_ACTION_KEYS["TOUCHED"] = "aggParamsTouched";
    AGG_PARAMS_ACTION_KEYS["VALID"] = "aggParamsValid";
    AGG_PARAMS_ACTION_KEYS["RESET"] = "aggParamsReset";
})(AGG_PARAMS_ACTION_KEYS = exports.AGG_PARAMS_ACTION_KEYS || (exports.AGG_PARAMS_ACTION_KEYS = {}));
function aggParamsReducer(state, { type, paramName = '', payload }) {
    const targetParam = state[paramName] || {
        valid: true,
        touched: false,
    };
    switch (type) {
        case AGG_PARAMS_ACTION_KEYS.TOUCHED:
            return {
                ...state,
                [paramName]: {
                    ...targetParam,
                    touched: payload,
                },
            };
        case AGG_PARAMS_ACTION_KEYS.VALID:
            return {
                ...state,
                [paramName]: {
                    ...targetParam,
                    valid: payload,
                },
            };
        case AGG_PARAMS_ACTION_KEYS.RESET:
            return {};
        default:
            throw new Error();
    }
}
exports.aggParamsReducer = aggParamsReducer;
function initAggParamsState(params) {
    const state = params.reduce((stateObj, param) => {
        stateObj[param.aggParam.name] = {
            valid: true,
            touched: false,
        };
        return stateObj;
    }, {});
    return state;
}
exports.initAggParamsState = initAggParamsState;
