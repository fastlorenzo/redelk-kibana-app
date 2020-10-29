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
exports.SavedObjectsClient = void 0;
const errors_1 = require("./lib/errors");
/**
 *
 * @public
 */
class SavedObjectsClient {
    /** @internal */
    constructor(repository) {
        this.errors = errors_1.SavedObjectsErrorHelpers;
        this._repository = repository;
    }
    /**
     * Persists a SavedObject
     *
     * @param type
     * @param attributes
     * @param options
     */
    async create(type, attributes, options) {
        return await this._repository.create(type, attributes, options);
    }
    /**
     * Persists multiple documents batched together as a single request
     *
     * @param objects
     * @param options
     */
    async bulkCreate(objects, options) {
        return await this._repository.bulkCreate(objects, options);
    }
    /**
     * Deletes a SavedObject
     *
     * @param type
     * @param id
     * @param options
     */
    async delete(type, id, options = {}) {
        return await this._repository.delete(type, id, options);
    }
    /**
     * Find all SavedObjects matching the search query
     *
     * @param options
     */
    async find(options) {
        return await this._repository.find(options);
    }
    /**
     * Returns an array of objects by id
     *
     * @param objects - an array of ids, or an array of objects containing id, type and optionally fields
     * @example
     *
     * bulkGet([
     *   { id: 'one', type: 'config' },
     *   { id: 'foo', type: 'index-pattern' }
     * ])
     */
    async bulkGet(objects = [], options = {}) {
        return await this._repository.bulkGet(objects, options);
    }
    /**
     * Retrieves a single object
     *
     * @param type - The type of SavedObject to retrieve
     * @param id - The ID of the SavedObject to retrieve
     * @param options
     */
    async get(type, id, options = {}) {
        return await this._repository.get(type, id, options);
    }
    /**
     * Updates an SavedObject
     *
     * @param type
     * @param id
     * @param options
     */
    async update(type, id, attributes, options = {}) {
        return await this._repository.update(type, id, attributes, options);
    }
    /**
     * Adds namespaces to a SavedObject
     *
     * @param type
     * @param id
     * @param namespaces
     * @param options
     */
    async addToNamespaces(type, id, namespaces, options = {}) {
        return await this._repository.addToNamespaces(type, id, namespaces, options);
    }
    /**
     * Removes namespaces from a SavedObject
     *
     * @param type
     * @param id
     * @param namespaces
     * @param options
     */
    async deleteFromNamespaces(type, id, namespaces, options = {}) {
        return await this._repository.deleteFromNamespaces(type, id, namespaces, options);
    }
    /**
     * Bulk Updates multiple SavedObject at once
     *
     * @param objects
     */
    async bulkUpdate(objects, options) {
        return await this._repository.bulkUpdate(objects, options);
    }
}
exports.SavedObjectsClient = SavedObjectsClient;
SavedObjectsClient.errors = errors_1.SavedObjectsErrorHelpers;
