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
exports.validateObjects = exports.validateTypes = exports.createSavedObjectsStreamFromNdJson = void 0;
const streams_1 = require("../../../../legacy/utils/streams");
function createSavedObjectsStreamFromNdJson(ndJsonStream) {
    return ndJsonStream
        .pipe(streams_1.createSplitStream('\n'))
        .pipe(streams_1.createMapStream((str) => {
        if (str && str.trim() !== '') {
            return JSON.parse(str);
        }
    }))
        .pipe(streams_1.createFilterStream((obj) => !!obj && !obj.exportedCount));
}
exports.createSavedObjectsStreamFromNdJson = createSavedObjectsStreamFromNdJson;
function validateTypes(types, supportedTypes) {
    const invalidTypes = types.filter((t) => !supportedTypes.includes(t));
    if (invalidTypes.length) {
        return `Trying to export non-exportable type(s): ${invalidTypes.join(', ')}`;
    }
}
exports.validateTypes = validateTypes;
function validateObjects(objects, supportedTypes) {
    const invalidObjects = objects.filter((obj) => !supportedTypes.includes(obj.type));
    if (invalidObjects.length) {
        return `Trying to export object(s) with non-exportable types: ${invalidObjects
            .map((obj) => `${obj.type}:${obj.id}`)
            .join(', ')}`;
    }
}
exports.validateObjects = validateObjects;
