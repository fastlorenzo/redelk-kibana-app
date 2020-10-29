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
exports.updateStateParams = exports.toggleEnabledAgg = exports.reorderAggs = exports.removeAgg = exports.setStateParamValue = exports.setAggParamValue = exports.changeAggType = exports.discardChanges = exports.addNewAgg = void 0;
const constants_1 = require("./constants");
const addNewAgg = (schema) => ({
    type: constants_1.EditorStateActionTypes.ADD_NEW_AGG,
    payload: {
        schema,
    },
});
exports.addNewAgg = addNewAgg;
const discardChanges = (vis) => ({
    type: constants_1.EditorStateActionTypes.DISCARD_CHANGES,
    payload: vis,
});
exports.discardChanges = discardChanges;
const changeAggType = (aggId, value) => ({
    type: constants_1.EditorStateActionTypes.CHANGE_AGG_TYPE,
    payload: {
        aggId,
        value,
    },
});
exports.changeAggType = changeAggType;
const setAggParamValue = (aggId, paramName, value) => ({
    type: constants_1.EditorStateActionTypes.SET_AGG_PARAM_VALUE,
    payload: {
        aggId,
        paramName,
        value,
    },
});
exports.setAggParamValue = setAggParamValue;
const setStateParamValue = (paramName, value) => ({
    type: constants_1.EditorStateActionTypes.SET_STATE_PARAM_VALUE,
    payload: {
        paramName,
        value,
    },
});
exports.setStateParamValue = setStateParamValue;
const removeAgg = (aggId, schemas) => ({
    type: constants_1.EditorStateActionTypes.REMOVE_AGG,
    payload: {
        aggId,
        schemas,
    },
});
exports.removeAgg = removeAgg;
const reorderAggs = (sourceAgg, destinationAgg) => ({
    type: constants_1.EditorStateActionTypes.REORDER_AGGS,
    payload: {
        sourceAgg,
        destinationAgg,
    },
});
exports.reorderAggs = reorderAggs;
const toggleEnabledAgg = (aggId, enabled) => ({
    type: constants_1.EditorStateActionTypes.TOGGLE_ENABLED_AGG,
    payload: {
        aggId,
        enabled,
    },
});
exports.toggleEnabledAgg = toggleEnabledAgg;
const updateStateParams = (params) => ({
    type: constants_1.EditorStateActionTypes.UPDATE_STATE_PARAMS,
    payload: {
        params,
    },
});
exports.updateStateParams = updateStateParams;
