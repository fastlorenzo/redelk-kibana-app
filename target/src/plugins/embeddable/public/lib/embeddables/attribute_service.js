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
exports.AttributeService = void 0;
const _1 = require(".");
class AttributeService {
    constructor(type, savedObjectsClient) {
        this.type = type;
        this.savedObjectsClient = savedObjectsClient;
    }
    async unwrapAttributes(input) {
        if (_1.isSavedObjectEmbeddableInput(input)) {
            const savedObject = await this.savedObjectsClient.get(this.type, input.savedObjectId);
            return savedObject.attributes;
        }
        return input.attributes;
    }
    async wrapAttributes(newAttributes, useRefType, embeddable) {
        const savedObjectId = embeddable && _1.isSavedObjectEmbeddableInput(embeddable.getInput())
            ? embeddable.getInput().savedObjectId
            : undefined;
        if (useRefType) {
            if (savedObjectId) {
                await this.savedObjectsClient.update(this.type, savedObjectId, newAttributes);
                return { savedObjectId };
            }
            else {
                const savedItem = await this.savedObjectsClient.create(this.type, newAttributes);
                return { savedObjectId: savedItem.id };
            }
        }
        else {
            return { attributes: newAttributes };
        }
    }
}
exports.AttributeService = AttributeService;
