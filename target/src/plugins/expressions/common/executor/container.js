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
exports.createExecutorContainer = exports.pureSelectors = exports.pureTransitions = exports.defaultState = void 0;
const state_containers_1 = require("../../../kibana_utils/common/state_containers");
exports.defaultState = {
    functions: {},
    types: {},
    context: {},
};
exports.pureTransitions = {
    addFunction: (state) => (fn) => ({ ...state, functions: { ...state.functions, [fn.name]: fn } }),
    addType: (state) => (type) => ({ ...state, types: { ...state.types, [type.name]: type } }),
    extendContext: (state) => (extraContext) => ({
        ...state,
        context: { ...state.context, ...extraContext },
    }),
};
exports.pureSelectors = {
    getFunction: (state) => (id) => state.functions[id] || null,
    getType: (state) => (id) => state.types[id] || null,
    getContext: ({ context }) => () => context,
};
exports.createExecutorContainer = (state = exports.defaultState) => {
    const container = state_containers_1.createStateContainer(state, exports.pureTransitions, exports.pureSelectors);
    return container;
};
