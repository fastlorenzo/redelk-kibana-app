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
exports.adoptToHapiOnPreResponseFormat = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const router_1 = require("../router");
var ResultType;
(function (ResultType) {
    ResultType["next"] = "next";
})(ResultType || (ResultType = {}));
const preResponseResult = {
    next(responseExtensions) {
        return { type: ResultType.next, headers: responseExtensions?.headers };
    },
    isNext(result) {
        return result && result.type === ResultType.next;
    },
};
const toolkit = {
    next: preResponseResult.next,
};
/**
 * @public
 * Adopt custom request interceptor to Hapi lifecycle system.
 * @param fn - an extension point allowing to perform custom logic for
 * incoming HTTP requests.
 */
function adoptToHapiOnPreResponseFormat(fn, log) {
    return async function interceptPreResponse(request, responseToolkit) {
        const response = request.response;
        try {
            if (response) {
                const statusCode = isBoom(response)
                    ? response.output.statusCode
                    : response.statusCode;
                const result = await fn(router_1.KibanaRequest.from(request), { statusCode }, toolkit);
                if (!preResponseResult.isNext(result)) {
                    throw new Error(`Unexpected result from OnPreResponse. Expected OnPreResponseResult, but given: ${result}.`);
                }
                if (result.headers) {
                    if (isBoom(response)) {
                        findHeadersIntersection(response.output.headers, result.headers, log);
                        // hapi wraps all error response in Boom object internally
                        response.output.headers = {
                            ...response.output.headers,
                            ...result.headers,
                        };
                    }
                    else {
                        findHeadersIntersection(response.headers, result.headers, log);
                        for (const [headerName, headerValue] of Object.entries(result.headers)) {
                            response.header(headerName, headerValue); // hapi types don't specify string[] as valid value
                        }
                    }
                }
            }
        }
        catch (error) {
            log.error(error);
            const hapiResponseAdapter = new router_1.HapiResponseAdapter(responseToolkit);
            return hapiResponseAdapter.toInternalError();
        }
        return responseToolkit.continue;
    };
}
exports.adoptToHapiOnPreResponseFormat = adoptToHapiOnPreResponseFormat;
function isBoom(response) {
    return response instanceof boom_1.default;
}
// NOTE: responseHeaders contains not a full list of response headers, but only explicitly set on a response object.
// any headers added by hapi internally, like `content-type`, `content-length`, etc. are not present here.
function findHeadersIntersection(responseHeaders, headers, log) {
    Object.keys(headers).forEach((headerName) => {
        if (Reflect.has(responseHeaders, headerName)) {
            log.warn(`onPreResponseHandler rewrote a response header [${headerName}].`);
        }
    });
}
