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
exports.createStreamingBatchedFunction = void 0;
const public_1 = require("../../../kibana_utils/public");
const common_1 = require("../../common");
const streaming_1 = require("../streaming");
const common_2 = require("../../common");
/**
 * Returns a function that does not execute immediately but buffers the call internally until
 * `params.flushOnMaxItems` is reached or after `params.maxItemAge` timeout in milliseconds is reached. Once
 * one of those thresholds is reached all buffered calls are sent in one batch to the
 * server using `params.fetchStreaming` in a POST request. Responses are streamed back
 * and each batch item is resolved once corresponding response is received.
 */
exports.createStreamingBatchedFunction = (params) => {
    const { url, fetchStreaming: fetchStreamingInjected = streaming_1.fetchStreaming, flushOnMaxItems = 25, maxItemAge = 10, } = params;
    const [fn] = common_1.createBatchedFunction({
        onCall: (payload) => {
            const future = public_1.defer();
            const entry = {
                payload,
                future,
            };
            return [future.promise, entry];
        },
        onBatch: async (items) => {
            try {
                let responsesReceived = 0;
                const batch = items.map(({ payload }) => payload);
                const { stream } = fetchStreamingInjected({
                    url,
                    body: JSON.stringify({ batch }),
                    method: 'POST',
                });
                stream.pipe(streaming_1.split('\n')).subscribe({
                    next: (json) => {
                        const response = JSON.parse(json);
                        if (response.error) {
                            responsesReceived++;
                            items[response.id].future.reject(response.error);
                        }
                        else if (response.result !== undefined) {
                            responsesReceived++;
                            items[response.id].future.resolve(response.result);
                        }
                    },
                    error: (error) => {
                        const normalizedError = common_2.normalizeError(error);
                        normalizedError.code = 'STREAM';
                        for (const { future } of items)
                            future.reject(normalizedError);
                    },
                    complete: () => {
                        const streamTerminatedPrematurely = responsesReceived !== items.length;
                        if (streamTerminatedPrematurely) {
                            const error = {
                                message: 'Connection terminated prematurely.',
                                code: 'CONNECTION',
                            };
                            for (const { future } of items)
                                future.reject(error);
                        }
                    },
                });
                await stream.toPromise();
            }
            catch (error) {
                for (const item of items)
                    item.future.reject(error);
            }
        },
        flushOnMaxItems,
        maxItemAge,
    });
    return fn;
};
