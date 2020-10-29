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
exports.sortObjects = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
function sortObjects(savedObjects) {
    const path = new Set();
    const sorted = new Set();
    const objectsByTypeId = new Map(savedObjects.map((object) => [`${object.type}:${object.id}`, object]));
    function includeObjects(objects) {
        for (const object of objects) {
            if (path.has(object)) {
                throw boom_1.default.badRequest(`circular reference: ${[...path, object]
                    .map((obj) => `[${obj.type}:${obj.id}]`)
                    .join(' ref-> ')}`);
            }
            const refdObjects = object.references
                .map((ref) => objectsByTypeId.get(`${ref.type}:${ref.id}`))
                .filter((ref) => !!ref);
            if (refdObjects.length) {
                path.add(object);
                includeObjects(refdObjects);
                path.delete(object);
            }
            sorted.add(object);
        }
    }
    includeObjects(savedObjects);
    return [...sorted];
}
exports.sortObjects = sortObjects;
