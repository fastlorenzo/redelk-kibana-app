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
exports.SavedObjectsErrorHelpers = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
// 400 - badRequest
const CODE_BAD_REQUEST = 'SavedObjectsClient/badRequest';
// 400 - invalid version
const CODE_INVALID_VERSION = 'SavedObjectsClient/invalidVersion';
// 401 - Not Authorized
const CODE_NOT_AUTHORIZED = 'SavedObjectsClient/notAuthorized';
// 403 - Forbidden
const CODE_FORBIDDEN = 'SavedObjectsClient/forbidden';
// 413 - Request Entity Too Large
const CODE_REQUEST_ENTITY_TOO_LARGE = 'SavedObjectsClient/requestEntityTooLarge';
// 404 - Not Found
const CODE_NOT_FOUND = 'SavedObjectsClient/notFound';
// 409 - Conflict
const CODE_CONFLICT = 'SavedObjectsClient/conflict';
// 400 - Es Cannot Execute Script
const CODE_ES_CANNOT_EXECUTE_SCRIPT = 'SavedObjectsClient/esCannotExecuteScript';
// 503 - Es Unavailable
const CODE_ES_UNAVAILABLE = 'SavedObjectsClient/esUnavailable';
// 500 - General Error
const CODE_GENERAL_ERROR = 'SavedObjectsClient/generalError';
const code = Symbol('SavedObjectsClientErrorCode');
function decorate(error, errorCode, statusCode, message) {
    if (isSavedObjectsClientError(error)) {
        return error;
    }
    const boom = boom_1.default.boomify(error, {
        statusCode,
        message,
        override: false,
    });
    boom[code] = errorCode;
    return boom;
}
function isSavedObjectsClientError(error) {
    return Boolean(error && error[code]);
}
function decorateBadRequestError(error, reason) {
    return decorate(error, CODE_BAD_REQUEST, 400, reason);
}
/**
 * @public
 */
class SavedObjectsErrorHelpers {
    static isSavedObjectsClientError(error) {
        return isSavedObjectsClientError(error);
    }
    static decorateBadRequestError(error, reason) {
        return decorateBadRequestError(error, reason);
    }
    static createBadRequestError(reason) {
        return decorateBadRequestError(new Error('Bad Request'), reason);
    }
    static createUnsupportedTypeError(type) {
        return decorateBadRequestError(new Error('Bad Request'), `Unsupported saved object type: '${type}'`);
    }
    static isBadRequestError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_BAD_REQUEST;
    }
    static createInvalidVersionError(versionInput) {
        return decorate(boom_1.default.badRequest(`Invalid version [${versionInput}]`), CODE_INVALID_VERSION, 400);
    }
    static isInvalidVersionError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_INVALID_VERSION;
    }
    static decorateNotAuthorizedError(error, reason) {
        return decorate(error, CODE_NOT_AUTHORIZED, 401, reason);
    }
    static isNotAuthorizedError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_NOT_AUTHORIZED;
    }
    static decorateForbiddenError(error, reason) {
        return decorate(error, CODE_FORBIDDEN, 403, reason);
    }
    static isForbiddenError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_FORBIDDEN;
    }
    static decorateRequestEntityTooLargeError(error, reason) {
        return decorate(error, CODE_REQUEST_ENTITY_TOO_LARGE, 413, reason);
    }
    static isRequestEntityTooLargeError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_REQUEST_ENTITY_TOO_LARGE;
    }
    static createGenericNotFoundError(type = null, id = null) {
        if (type && id) {
            return decorate(boom_1.default.notFound(`Saved object [${type}/${id}] not found`), CODE_NOT_FOUND, 404);
        }
        return decorate(boom_1.default.notFound(), CODE_NOT_FOUND, 404);
    }
    static isNotFoundError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_NOT_FOUND;
    }
    static decorateConflictError(error, reason) {
        return decorate(error, CODE_CONFLICT, 409, reason);
    }
    static createConflictError(type, id) {
        return SavedObjectsErrorHelpers.decorateConflictError(boom_1.default.conflict(`Saved object [${type}/${id}] conflict`));
    }
    static isConflictError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_CONFLICT;
    }
    static decorateEsCannotExecuteScriptError(error, reason) {
        return decorate(error, CODE_ES_CANNOT_EXECUTE_SCRIPT, 400, reason);
    }
    static isEsCannotExecuteScriptError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_ES_CANNOT_EXECUTE_SCRIPT;
    }
    static decorateEsUnavailableError(error, reason) {
        return decorate(error, CODE_ES_UNAVAILABLE, 503, reason);
    }
    static isEsUnavailableError(error) {
        return isSavedObjectsClientError(error) && error[code] === CODE_ES_UNAVAILABLE;
    }
    static decorateGeneralError(error, reason) {
        return decorate(error, CODE_GENERAL_ERROR, 500, reason);
    }
}
exports.SavedObjectsErrorHelpers = SavedObjectsErrorHelpers;
