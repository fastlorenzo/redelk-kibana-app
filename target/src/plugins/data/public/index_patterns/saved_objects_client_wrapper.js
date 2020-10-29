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
exports.SavedObjectsClientPublicToCommon = void 0;
const lodash_1 = require("lodash");
const simpleSavedObjectToSavedObject = (simpleSavedObject) => ({
    version: simpleSavedObject._version,
    ...lodash_1.omit(simpleSavedObject, '_version'),
});
class SavedObjectsClientPublicToCommon {
    constructor(savedObjectClient) {
        this.savedObjectClient = savedObjectClient;
    }
    async find(options) {
        const response = (await this.savedObjectClient.find(options)).savedObjects;
        return response.map(simpleSavedObjectToSavedObject);
    }
    async get(type, id) {
        const response = await this.savedObjectClient.get(type, id);
        return simpleSavedObjectToSavedObject(response);
    }
    async update(type, id, attributes, options) {
        const response = await this.savedObjectClient.update(type, id, attributes, options);
        return simpleSavedObjectToSavedObject(response);
    }
    async create(type, attributes, options) {
        const response = await this.savedObjectClient.create(type, attributes, options);
        return simpleSavedObjectToSavedObject(response);
    }
    delete(type, id) {
        return this.savedObjectClient.delete(type, id);
    }
}
exports.SavedObjectsClientPublicToCommon = SavedObjectsClientPublicToCommon;
