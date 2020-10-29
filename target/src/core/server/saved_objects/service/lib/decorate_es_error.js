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
exports.decorateEsError = void 0;
const tslib_1 = require("tslib");
const legacyElasticsearch = tslib_1.__importStar(require("elasticsearch"));
const lodash_1 = require("lodash");
const { ConnectionFault, ServiceUnavailable, NoConnections, RequestTimeout, Conflict, 
// @ts-expect-error
401: NotAuthorized, 
// @ts-expect-error
403: Forbidden, 
// @ts-expect-error
413: RequestEntityTooLarge, NotFound, BadRequest, } = legacyElasticsearch.errors;
const SCRIPT_CONTEXT_DISABLED_REGEX = /(?:cannot execute scripts using \[)([a-z]*)(?:\] context)/;
const INLINE_SCRIPTS_DISABLED_MESSAGE = 'cannot execute [inline] scripts';
const errors_1 = require("./errors");
function decorateEsError(error) {
    if (!(error instanceof Error)) {
        throw new Error('Expected an instance of Error');
    }
    const { reason } = lodash_1.get(error, 'body.error', { reason: undefined });
    if (error instanceof ConnectionFault ||
        error instanceof ServiceUnavailable ||
        error instanceof NoConnections ||
        error instanceof RequestTimeout) {
        return errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(error, reason);
    }
    if (error instanceof Conflict) {
        return errors_1.SavedObjectsErrorHelpers.decorateConflictError(error, reason);
    }
    if (error instanceof NotAuthorized) {
        return errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(error, reason);
    }
    if (error instanceof Forbidden) {
        return errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(error, reason);
    }
    if (error instanceof RequestEntityTooLarge) {
        return errors_1.SavedObjectsErrorHelpers.decorateRequestEntityTooLargeError(error, reason);
    }
    if (error instanceof NotFound) {
        return errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError();
    }
    if (error instanceof BadRequest) {
        if (SCRIPT_CONTEXT_DISABLED_REGEX.test(reason || '') ||
            reason === INLINE_SCRIPTS_DISABLED_MESSAGE) {
            return errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(error, reason);
        }
        return errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(error, reason);
    }
    return errors_1.SavedObjectsErrorHelpers.decorateGeneralError(error, reason);
}
exports.decorateEsError = decorateEsError;
