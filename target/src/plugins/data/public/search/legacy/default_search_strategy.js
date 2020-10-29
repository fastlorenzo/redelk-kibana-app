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
exports.defaultSearchStrategy = void 0;
const fetch_1 = require("../fetch");
const get_msearch_params_1 = require("./get_msearch_params");
// @deprecated
exports.defaultSearchStrategy = {
    id: 'default',
    search: (params) => {
        return msearch(params);
    },
};
function msearch({ searchRequests, legacySearchService, config, esShardTimeout, }) {
    const es = legacySearchService.esClient;
    const inlineRequests = searchRequests.map(({ index, body, search_type: searchType }) => {
        const inlineHeader = {
            index: index.title || index,
            search_type: searchType,
            ignore_unavailable: true,
            preference: fetch_1.getPreference(config),
        };
        const inlineBody = {
            ...body,
            timeout: fetch_1.getTimeout(esShardTimeout),
        };
        return `${JSON.stringify(inlineHeader)}\n${JSON.stringify(inlineBody)}`;
    });
    const searching = es.msearch({
        ...get_msearch_params_1.getMSearchParams(config),
        body: `${inlineRequests.join('\n')}\n`,
    });
    return {
        searching: searching.then(({ responses }) => responses),
        abort: searching.abort,
    };
}
