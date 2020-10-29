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
exports.LegacyElasticsearchErrorHelpers = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = require("lodash");
const code = Symbol('ElasticsearchError');
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["NOT_AUTHORIZED"] = "Elasticsearch/notAuthorized";
})(ErrorCode || (ErrorCode = {}));
function isElasticsearchError(error) {
    return Boolean(error && error[code]);
}
function decorate(error, errorCode, statusCode, message) {
    if (isElasticsearchError(error)) {
        return error;
    }
    const boom = boom_1.default.boomify(error, {
        statusCode,
        message,
        // keep status and messages if Boom error object already has them
        override: false,
    });
    boom[code] = errorCode;
    return boom;
}
/**
 * Helpers for working with errors returned from the Elasticsearch service.Since the internal data of
 * errors are subject to change, consumers of the Elasticsearch service should always use these helpers
 * to classify errors instead of checking error internals such as `body.error.header[WWW-Authenticate]`
 * @public
 *
 * @example
 * Handle errors
 * ```js
 * try {
 *   await client.asScoped(request).callAsCurrentUser(...);
 * } catch (err) {
 *   if (ElasticsearchErrorHelpers.isNotAuthorizedError(err)) {
 *     const authHeader = err.output.headers['WWW-Authenticate'];
 *   }
 * ```
 */
class LegacyElasticsearchErrorHelpers {
    static isNotAuthorizedError(error) {
        return isElasticsearchError(error) && error[code] === ErrorCode.NOT_AUTHORIZED;
    }
    static decorateNotAuthorizedError(error, reason) {
        const decoratedError = decorate(error, ErrorCode.NOT_AUTHORIZED, 401, reason);
        const wwwAuthHeader = lodash_1.get(error, 'body.error.header[WWW-Authenticate]');
        decoratedError.output.headers['WWW-Authenticate'] =
            wwwAuthHeader || 'Basic realm="Authorization Required"';
        return decoratedError;
    }
}
exports.LegacyElasticsearchErrorHelpers = LegacyElasticsearchErrorHelpers;
