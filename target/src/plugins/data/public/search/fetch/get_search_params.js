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
exports.getSearchParamsFromRequest = exports.getTimeout = exports.getPreference = exports.getMaxConcurrentShardRequests = exports.getIgnoreThrottled = exports.getSearchParams = void 0;
const common_1 = require("../../../common");
const sessionId = Date.now();
function getSearchParams(config, esShardTimeout = 0) {
    return {
        rest_total_hits_as_int: true,
        ignore_unavailable: true,
        ignore_throttled: getIgnoreThrottled(config),
        max_concurrent_shard_requests: getMaxConcurrentShardRequests(config),
        preference: getPreference(config),
        timeout: getTimeout(esShardTimeout),
    };
}
exports.getSearchParams = getSearchParams;
function getIgnoreThrottled(config) {
    return !config.get(common_1.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);
}
exports.getIgnoreThrottled = getIgnoreThrottled;
function getMaxConcurrentShardRequests(config) {
    const maxConcurrentShardRequests = config.get(common_1.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS);
    return maxConcurrentShardRequests > 0 ? maxConcurrentShardRequests : undefined;
}
exports.getMaxConcurrentShardRequests = getMaxConcurrentShardRequests;
function getPreference(config) {
    const setRequestPreference = config.get(common_1.UI_SETTINGS.COURIER_SET_REQUEST_PREFERENCE);
    if (setRequestPreference === 'sessionId')
        return sessionId;
    return setRequestPreference === 'custom'
        ? config.get(common_1.UI_SETTINGS.COURIER_CUSTOM_REQUEST_PREFERENCE)
        : undefined;
}
exports.getPreference = getPreference;
function getTimeout(esShardTimeout) {
    return esShardTimeout > 0 ? `${esShardTimeout}ms` : undefined;
}
exports.getTimeout = getTimeout;
function getSearchParamsFromRequest(searchRequest, dependencies) {
    const { injectedMetadata, uiSettings } = dependencies;
    const esShardTimeout = injectedMetadata.getInjectedVar('esShardTimeout');
    const searchParams = getSearchParams(uiSettings, esShardTimeout);
    return {
        index: searchRequest.index.title || searchRequest.index,
        body: searchRequest.body,
        ...searchParams,
    };
}
exports.getSearchParamsFromRequest = getSearchParamsFromRequest;
