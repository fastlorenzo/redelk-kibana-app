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
exports.EditorStateActionTypes = void 0;
var EditorStateActionTypes;
(function (EditorStateActionTypes) {
    EditorStateActionTypes["ADD_NEW_AGG"] = "ADD_NEW_AGG";
    EditorStateActionTypes["DISCARD_CHANGES"] = "DISCARD_CHANGES";
    EditorStateActionTypes["CHANGE_AGG_TYPE"] = "CHANGE_AGG_TYPE";
    EditorStateActionTypes["SET_AGG_PARAM_VALUE"] = "SET_AGG_PARAM_VALUE";
    EditorStateActionTypes["SET_STATE_PARAM_VALUE"] = "SET_STATE_PARAM_VALUE";
    EditorStateActionTypes["TOGGLE_ENABLED_AGG"] = "TOGGLE_ENABLED_AGG";
    EditorStateActionTypes["REMOVE_AGG"] = "REMOVE_AGG";
    EditorStateActionTypes["REORDER_AGGS"] = "REORDER_AGGS";
    EditorStateActionTypes["UPDATE_STATE_PARAMS"] = "UPDATE_STATE_PARAMS";
})(EditorStateActionTypes = exports.EditorStateActionTypes || (exports.EditorStateActionTypes = {}));
