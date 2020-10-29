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
exports.retryCallCluster = exports.migrationsRetryCallCluster = void 0;
const tslib_1 = require("tslib");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const legacyElasticsearch = tslib_1.__importStar(require("elasticsearch"));
const esErrors = legacyElasticsearch.errors;
/**
 * Retries the provided Elasticsearch API call when an error such as
 * `AuthenticationException` `NoConnections`, `ConnectionFault`,
 * `ServiceUnavailable` or `RequestTimeout` are encountered. The API call will
 * be retried once a second, indefinitely, until a successful response or a
 * different error is received.
 *
 * @param apiCaller
 * @param log
 * @param delay
 */
function migrationsRetryCallCluster(apiCaller, log, delay = 2500) {
    const previousErrors = [];
    return (endpoint, clientParams = {}, options) => {
        return rxjs_1.defer(() => apiCaller(endpoint, clientParams, options))
            .pipe(operators_1.retryWhen((error$) => error$.pipe(operators_1.concatMap((error, i) => {
            if (!previousErrors.includes(error.message)) {
                log.warn(`Unable to connect to Elasticsearch. Error: ${error.message}`);
                previousErrors.push(error.message);
            }
            return rxjs_1.iif(() => {
                return (error instanceof esErrors.NoConnections ||
                    error instanceof esErrors.ConnectionFault ||
                    error instanceof esErrors.ServiceUnavailable ||
                    error instanceof esErrors.RequestTimeout ||
                    error instanceof esErrors.AuthenticationException ||
                    error instanceof esErrors.AuthorizationException ||
                    // @ts-expect-error
                    error instanceof esErrors.Gone ||
                    error?.body?.error?.type === 'snapshot_in_progress_exception');
            }, rxjs_1.timer(delay), rxjs_1.throwError(error));
        }))))
            .toPromise();
    };
}
exports.migrationsRetryCallCluster = migrationsRetryCallCluster;
/**
 * Retries the provided Elasticsearch API call when a `NoConnections` error is
 * encountered. The API call will be retried once a second, indefinitely, until
 * a successful response or a different error is received.
 *
 * @param apiCaller
 */
function retryCallCluster(apiCaller) {
    return (endpoint, clientParams = {}, options) => {
        return rxjs_1.defer(() => apiCaller(endpoint, clientParams, options))
            .pipe(operators_1.retryWhen((errors) => errors.pipe(operators_1.concatMap((error, i) => rxjs_1.iif(() => error instanceof legacyElasticsearch.errors.NoConnections, rxjs_1.timer(1000), rxjs_1.throwError(error))))))
            .toPromise();
    };
}
exports.retryCallCluster = retryCallCluster;
