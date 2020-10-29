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
exports.expandedStateToHashedState = exports.hashedStateToExpandedState = exports.encodeState = exports.decodeState = void 0;
const tslib_1 = require("tslib");
const rison_node_1 = tslib_1.__importDefault(require("rison-node"));
const state_hash_1 = require("../state_hash");
// should be:
// export function decodeState<State extends RisonValue>(expandedOrHashedState: string)
// but this leads to the chain of types mismatches up to BaseStateContainer interfaces,
// as in state containers we don't have any restrictions on state shape
function decodeState(expandedOrHashedState) {
    if (state_hash_1.isStateHash(expandedOrHashedState)) {
        return state_hash_1.retrieveState(expandedOrHashedState);
    }
    else {
        return rison_node_1.default.decode(expandedOrHashedState);
    }
}
exports.decodeState = decodeState;
// should be:
// export function encodeState<State extends RisonValue>(expandedOrHashedState: string)
// but this leads to the chain of types mismatches up to BaseStateContainer interfaces,
// as in state containers we don't have any restrictions on state shape
function encodeState(state, useHash) {
    if (useHash) {
        return state_hash_1.persistState(state);
    }
    else {
        return rison_node_1.default.encode(state);
    }
}
exports.encodeState = encodeState;
function hashedStateToExpandedState(expandedOrHashedState) {
    if (state_hash_1.isStateHash(expandedOrHashedState)) {
        return encodeState(state_hash_1.retrieveState(expandedOrHashedState), false);
    }
    return expandedOrHashedState;
}
exports.hashedStateToExpandedState = hashedStateToExpandedState;
function expandedStateToHashedState(expandedOrHashedState) {
    if (state_hash_1.isStateHash(expandedOrHashedState)) {
        return expandedOrHashedState;
    }
    return state_hash_1.persistState(decodeState(expandedOrHashedState));
}
exports.expandedStateToHashedState = expandedStateToHashedState;
