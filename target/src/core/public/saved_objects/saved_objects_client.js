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
const lodash_1 = require("lodash");
const url_1 = require("url");
const simple_saved_object_1 = require("./simple_saved_object");
const join = (...uriComponents) => uriComponents
    .filter((comp) => Boolean(comp))
    .map(encodeURIComponent)
    .join('/');
/**
 * Interval that requests are batched for
 * @type {integer}
 */
const BATCH_INTERVAL = 100;
const API_BASE_URL = '/api/saved_objects/';
/**
 * Saved Objects is Kibana's data persisentence mechanism allowing plugins to
 * use Elasticsearch for storing plugin state. The client-side
 * SavedObjectsClient is a thin convenience library around the SavedObjects
 * HTTP API for interacting with Saved Objects.
 *
 * @public
 */
class SavedObjectsClient {
    /** @internal */
    constructor(http) {
        /**
         * Throttled processing of get requests into bulk requests at 100ms interval
         */
        this.processBatchQueue = lodash_1.throttle(() => {
            const queue = lodash_1.cloneDeep(this.batchQueue);
            this.batchQueue = [];
            this.bulkGet(queue)
                .then(({ savedObjects }) => {
                queue.forEach((queueItem) => {
                    const foundObject = savedObjects.find((savedObject) => {
                        return savedObject.id === queueItem.id && savedObject.type === queueItem.type;
                    });
                    if (!foundObject) {
                        return queueItem.resolve(this.createSavedObject(lodash_1.pick(queueItem, ['id', 'type'])));
                    }
                    queueItem.resolve(foundObject);
                });
            })
                .catch((err) => {
                queue.forEach((queueItem) => {
                    queueItem.reject(err);
                });
            });
        }, BATCH_INTERVAL, { leading: false });
        /**
         * Persists an object
         *
         * @param type
         * @param attributes
         * @param options
         * @returns
         */
        this.create = (type, attributes, options = {}) => {
            if (!type || !attributes) {
                return Promise.reject(new Error('requires type and attributes'));
            }
            const path = this.getPath([type, options.id]);
            const query = {
                overwrite: options.overwrite,
            };
            const createRequest = this.savedObjectsFetch(path, {
                method: 'POST',
                query,
                body: JSON.stringify({
                    attributes,
                    migrationVersion: options.migrationVersion,
                    references: options.references,
                }),
            });
            return createRequest.then((resp) => this.createSavedObject(resp));
        };
        /**
         * Creates multiple documents at once
         *
         * @param {array} objects - [{ type, id, attributes, references, migrationVersion }]
         * @param {object} [options={}]
         * @property {boolean} [options.overwrite=false]
         * @returns The result of the create operation containing created saved objects.
         */
        this.bulkCreate = (objects = [], options = { overwrite: false }) => {
            const path = this.getPath(['_bulk_create']);
            const query = { overwrite: options.overwrite };
            const request = this.savedObjectsFetch(path, {
                method: 'POST',
                query,
                body: JSON.stringify(objects),
            });
            return request.then((resp) => {
                resp.saved_objects = resp.saved_objects.map((d) => this.createSavedObject(d));
                return renameKeys({ saved_objects: 'savedObjects' }, resp);
            });
        };
        /**
         * Deletes an object
         *
         * @param type
         * @param id
         * @returns
         */
        this.delete = (type, id) => {
            if (!type || !id) {
                return Promise.reject(new Error('requires type and id'));
            }
            return this.savedObjectsFetch(this.getPath([type, id]), { method: 'DELETE' });
        };
        /**
         * Search for objects
         *
         * @param {object} [options={}]
         * @property {string} options.type
         * @property {string} options.search
         * @property {string} options.searchFields - see Elasticsearch Simple Query String
         *                                        Query field argument for more information
         * @property {integer} [options.page=1]
         * @property {integer} [options.perPage=20]
         * @property {array} options.fields
         * @property {object} [options.hasReference] - { type, id }
         * @returns A find result with objects matching the specified search.
         */
        this.find = (options) => {
            const path = this.getPath(['_find']);
            const renameMap = {
                defaultSearchOperator: 'default_search_operator',
                fields: 'fields',
                hasReference: 'has_reference',
                page: 'page',
                perPage: 'per_page',
                search: 'search',
                searchFields: 'search_fields',
                sortField: 'sort_field',
                type: 'type',
                filter: 'filter',
                namespaces: 'namespaces',
                preference: 'preference',
            };
            const renamedQuery = renameKeys(renameMap, options);
            const query = lodash_1.pick.apply(null, [renamedQuery, ...Object.values(renameMap)]);
            const request = this.savedObjectsFetch(path, {
                method: 'GET',
                query,
            });
            return request.then((resp) => {
                return renameKeys({
                    saved_objects: 'savedObjects',
                    total: 'total',
                    per_page: 'perPage',
                    page: 'page',
                }, {
                    ...resp,
                    saved_objects: resp.saved_objects.map((d) => this.createSavedObject(d)),
                });
            });
        };
        /**
         * Fetches a single object
         *
         * @param {string} type
         * @param {string} id
         * @returns The saved object for the given type and id.
         */
        this.get = (type, id) => {
            if (!type || !id) {
                return Promise.reject(new Error('requires type and id'));
            }
            return new Promise((resolve, reject) => {
                this.batchQueue.push({ type, id, resolve, reject });
                this.processBatchQueue();
            });
        };
        /**
         * Returns an array of objects by id
         *
         * @param {array} objects - an array ids, or an array of objects containing id and optionally type
         * @returns The saved objects with the given type and ids requested
         * @example
         *
         * bulkGet([
         *   { id: 'one', type: 'config' },
         *   { id: 'foo', type: 'index-pattern' }
         * ])
         */
        this.bulkGet = (objects = []) => {
            const path = this.getPath(['_bulk_get']);
            const filteredObjects = objects.map((obj) => lodash_1.pick(obj, ['id', 'type']));
            const request = this.savedObjectsFetch(path, {
                method: 'POST',
                body: JSON.stringify(filteredObjects),
            });
            return request.then((resp) => {
                resp.saved_objects = resp.saved_objects.map((d) => this.createSavedObject(d));
                return renameKeys({ saved_objects: 'savedObjects' }, resp);
            });
        };
        this.http = http;
        this.batchQueue = [];
    }
    /**
     * Updates an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} attributes
     * @param {object} options
     * @prop {integer} options.version - ensures version matches that of persisted object
     * @prop {object} options.migrationVersion - The optional migrationVersion of this document
     * @returns
     */
    update(type, id, attributes, { version, migrationVersion, references } = {}) {
        if (!type || !id || !attributes) {
            return Promise.reject(new Error('requires type, id and attributes'));
        }
        const path = this.getPath([type, id]);
        const body = {
            attributes,
            migrationVersion,
            references,
            version,
        };
        return this.savedObjectsFetch(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        }).then((resp) => {
            return this.createSavedObject(resp);
        });
    }
    /**
     * Update multiple documents at once
     *
     * @param {array} objects - [{ type, id, attributes, options: { version, references } }]
     * @returns The result of the update operation containing both failed and updated saved objects.
     */
    bulkUpdate(objects = []) {
        const path = this.getPath(['_bulk_update']);
        return this.savedObjectsFetch(path, {
            method: 'PUT',
            body: JSON.stringify(objects),
        }).then((resp) => {
            resp.saved_objects = resp.saved_objects.map((d) => this.createSavedObject(d));
            return renameKeys({ saved_objects: 'savedObjects' }, resp);
        });
    }
    createSavedObject(options) {
        return new simple_saved_object_1.SimpleSavedObject(this, options);
    }
    getPath(path) {
        return url_1.resolve(API_BASE_URL, join(...path));
    }
    /**
     * To ensure we don't break backwards compatibility, savedObjectsFetch keeps
     * the old kfetch error format of `{res: {status: number}}` whereas `http.fetch`
     * uses `{response: {status: number}}`.
     */
    savedObjectsFetch(path, { method, query, body }) {
        return this.http.fetch(path, { method, query, body });
    }
}
exports.SavedObjectsClient = SavedObjectsClient;
/**
 * Returns a new object with the own properties of `obj`, but the
 * keys renamed according to the `keysMap`.
 *
 * @param keysMap - a map of the form `{oldKey: newKey}`
 * @param obj - the object whose own properties will be renamed
 */
const renameKeys = (keysMap, obj) => Object.keys(obj).reduce((acc, key) => {
    return {
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
    };
}, {});
