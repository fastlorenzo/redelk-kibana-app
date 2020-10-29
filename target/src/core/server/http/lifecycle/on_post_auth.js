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
exports.adoptToHapiOnPostAuthFormat = void 0;
const router_1 = require("../router");
var ResultType;
(function (ResultType) {
    ResultType["next"] = "next";
})(ResultType || (ResultType = {}));
const postAuthResult = {
    next() {
        return { type: ResultType.next };
    },
    isNext(result) {
        return result && result.type === ResultType.next;
    },
};
const toolkit = {
    next: postAuthResult.next,
};
/**
 * @public
 * Adopt custom request interceptor to Hapi lifecycle system.
 * @param fn - an extension point allowing to perform custom logic for
 * incoming HTTP requests.
 */
function adoptToHapiOnPostAuthFormat(fn, log) {
    return async function interceptRequest(request, responseToolkit) {
        const hapiResponseAdapter = new router_1.HapiResponseAdapter(responseToolkit);
        try {
            const result = await fn(router_1.KibanaRequest.from(request), router_1.lifecycleResponseFactory, toolkit);
            if (result instanceof router_1.KibanaResponse) {
                return hapiResponseAdapter.handle(result);
            }
            if (postAuthResult.isNext(result)) {
                return responseToolkit.continue;
            }
            throw new Error(`Unexpected result from OnPostAuth. Expected OnPostAuthResult or KibanaResponse, but given: ${result}.`);
        }
        catch (error) {
            log.error(error);
            return hapiResponseAdapter.toInternalError();
        }
    };
}
exports.adoptToHapiOnPostAuthFormat = adoptToHapiOnPostAuthFormat;
