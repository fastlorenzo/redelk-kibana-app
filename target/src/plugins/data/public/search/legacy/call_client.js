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
exports.callClient = void 0;
const fetch_1 = require("../fetch");
const default_search_strategy_1 = require("./default_search_strategy");
function callClient(searchRequests, requestsOptions = [], fetchHandlers) {
    // Correlate the options with the request that they're associated with
    const requestOptionEntries = searchRequests.map((request, i) => [request, requestsOptions[i]]);
    const requestOptionsMap = new Map(requestOptionEntries);
    const requestResponseMap = new Map();
    const { searching, abort } = default_search_strategy_1.defaultSearchStrategy.search({
        searchRequests,
        ...fetchHandlers,
    });
    searchRequests.forEach((request, i) => {
        const response = searching.then((results) => fetch_1.handleResponse(request, results[i]));
        const { abortSignal = null } = requestOptionsMap.get(request) || {};
        if (abortSignal)
            abortSignal.addEventListener('abort', abort);
        requestResponseMap.set(request, response);
    });
    return searchRequests.map((request) => requestResponseMap.get(request));
}
exports.callClient = callClient;
