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
exports.InvalidJSONProperty = exports.SavedObjectNotFound = exports.DuplicateField = exports.KbnError = void 0;
/* eslint-disable max-classes-per-file */
// abstract error class
class KbnError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.KbnError = KbnError;
/**
 * when a mapping already exists for a field the user is attempting to add
 * @param {String} name - the field name
 */
class DuplicateField extends KbnError {
    constructor(name) {
        super(`The field "${name}" already exists in this mapping`);
    }
}
exports.DuplicateField = DuplicateField;
/**
 * A saved object was not found
 */
class SavedObjectNotFound extends KbnError {
    constructor(type, id, link) {
        const idMsg = id ? ` (id: ${id})` : '';
        let message = `Could not locate that ${type}${idMsg}`;
        if (link) {
            message += `, [click here to re-create it](${link})`;
        }
        super(message);
        this.savedObjectType = type;
        this.savedObjectId = id;
    }
}
exports.SavedObjectNotFound = SavedObjectNotFound;
/**
 * This error is for scenarios where a saved object is detected that has invalid JSON properties.
 * There was a scenario where we were importing objects with double-encoded JSON, and the system
 * was silently failing. This error is now thrown in those scenarios.
 */
class InvalidJSONProperty extends KbnError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidJSONProperty = InvalidJSONProperty;
