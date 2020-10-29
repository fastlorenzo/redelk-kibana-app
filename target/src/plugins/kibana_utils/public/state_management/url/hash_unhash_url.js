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
exports.hashUrl = exports.unhashUrl = exports.hashQuery = exports.unhashQuery = void 0;
const state_encoder_1 = require("../state_encoder");
const format_1 = require("./format");
exports.unhashQuery = createQueryMapper(state_encoder_1.hashedStateToExpandedState);
exports.hashQuery = createQueryMapper(state_encoder_1.expandedStateToHashedState);
exports.unhashUrl = createQueryReplacer(exports.unhashQuery);
exports.hashUrl = createQueryReplacer(exports.hashQuery);
// naive hack, but this allows to decouple these utils from AppState, GlobalState for now
// when removing AppState, GlobalState and migrating to IState containers,
// need to make sure that apps explicitly passing this allow-list to hash
const __HACK_HARDCODED_LEGACY_HASHABLE_PARAMS = ['_g', '_a', '_s'];
function createQueryMapper(queryParamMapper) {
    return (query, options = {
        hashableParams: __HACK_HARDCODED_LEGACY_HASHABLE_PARAMS,
    }) => Object.fromEntries(Object.entries(query || {}).map(([name, value]) => {
        if (!options.hashableParams.includes(name))
            return [name, value];
        return [name, queryParamMapper(value) || value];
    }));
}
function createQueryReplacer(queryMapper, options) {
    return (url) => format_1.replaceUrlHashQuery(url, (query) => queryMapper(query, options));
}
