"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeSavedObject = void 0;
const tslib_1 = require("tslib");
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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const public_1 = require("../../../../data/public");
function serializeSavedObject(savedObject, config) {
    // mapping definition for the fields that this object will expose
    const mapping = public_1.expandShorthand(config.mapping);
    const attributes = {};
    const references = [];
    lodash_1.default.forOwn(mapping, (fieldMapping, fieldName) => {
        if (typeof fieldName !== 'string') {
            return;
        }
        // @ts-ignore
        const savedObjectFieldVal = savedObject[fieldName];
        if (savedObjectFieldVal != null) {
            attributes[fieldName] = fieldMapping._serialize
                ? fieldMapping._serialize(savedObjectFieldVal)
                : savedObjectFieldVal;
        }
    });
    if (savedObject.searchSource) {
        const { searchSourceJSON, references: searchSourceReferences, } = savedObject.searchSource.serialize();
        attributes.kibanaSavedObjectMeta = { searchSourceJSON };
        references.push(...searchSourceReferences);
    }
    if (savedObject.searchSourceFields) {
        const [searchSourceFields, searchSourceReferences] = public_1.extractSearchSourceReferences(savedObject.searchSourceFields);
        const searchSourceJSON = JSON.stringify(searchSourceFields);
        attributes.kibanaSavedObjectMeta = { searchSourceJSON };
        references.push(...searchSourceReferences);
    }
    if (savedObject.unresolvedIndexPatternReference) {
        references.push(savedObject.unresolvedIndexPatternReference);
    }
    return { attributes, references };
}
exports.serializeSavedObject = serializeSavedObject;
