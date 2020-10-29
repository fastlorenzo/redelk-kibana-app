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
exports.getMSearchParams = void 0;
const fetch_1 = require("../fetch");
function getMSearchParams(config) {
    return {
        rest_total_hits_as_int: true,
        ignore_throttled: fetch_1.getIgnoreThrottled(config),
        max_concurrent_shard_requests: fetch_1.getMaxConcurrentShardRequests(config),
    };
}
exports.getMSearchParams = getMSearchParams;
