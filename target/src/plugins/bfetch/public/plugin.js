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
exports.BfetchPublicPlugin = void 0;
const streaming_1 = require("./streaming");
const common_1 = require("../common");
const create_streaming_batched_function_1 = require("./batching/create_streaming_batched_function");
class BfetchPublicPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.fetchStreaming = (version, basePath) => (params) => streaming_1.fetchStreaming({
            ...params,
            url: `${basePath}/${common_1.removeLeadingSlash(params.url)}`,
            headers: {
                'Content-Type': 'application/json',
                'kbn-version': version,
                ...(params.headers || {}),
            },
        });
        this.batchedFunction = (fetchStreaming) => (params) => create_streaming_batched_function_1.createStreamingBatchedFunction({
            ...params,
            fetchStreaming: params.fetchStreaming || fetchStreaming,
        });
    }
    setup(core, plugins) {
        const { version } = this.initializerContext.env.packageInfo;
        const basePath = core.http.basePath.get();
        const fetchStreaming = this.fetchStreaming(version, basePath);
        const batchedFunction = this.batchedFunction(fetchStreaming);
        this.contract = {
            fetchStreaming,
            batchedFunction,
        };
        return this.contract;
    }
    start(core, plugins) {
        return this.contract;
    }
    stop() { }
}
exports.BfetchPublicPlugin = BfetchPublicPlugin;
