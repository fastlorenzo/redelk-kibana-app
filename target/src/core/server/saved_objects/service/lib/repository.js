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
exports.SavedObjectsRepository = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const legacy_1 = require("../../../elasticsearch/legacy");
const mappings_1 = require("../../mappings");
const search_dsl_1 = require("./search_dsl");
const included_fields_1 = require("./included_fields");
const decorate_es_error_1 = require("./decorate_es_error");
const errors_1 = require("./errors");
const version_1 = require("../../version");
const serialization_1 = require("../../serialization");
const filter_utils_1 = require("./filter_utils");
const isLeft = (either) => either.tag === 'Left';
const isRight = (either) => either.tag === 'Right';
const DEFAULT_REFRESH_SETTING = 'wait_for';
/**
 * @public
 */
class SavedObjectsRepository {
    constructor(options) {
        const { index, mappings, callCluster, typeRegistry, serializer, migrator, allowedTypes = [], } = options;
        // It's important that we migrate documents / mark them as up-to-date
        // prior to writing them to the index. Otherwise, we'll cause unnecessary
        // index migrations to run at Kibana startup, and those will probably fail
        // due to invalidly versioned documents in the index.
        //
        // The migrator performs double-duty, and validates the documents prior
        // to returning them.
        this._migrator = migrator;
        this._index = index;
        this._mappings = mappings;
        this._registry = typeRegistry;
        if (allowedTypes.length === 0) {
            throw new Error('Empty or missing types for saved object repository!');
        }
        this._allowedTypes = allowedTypes;
        this._unwrappedCallCluster = async (...args) => {
            await migrator.runMigrations();
            return callCluster(...args);
        };
        this._serializer = serializer;
    }
    /**
     * A factory function for creating SavedObjectRepository instances.
     *
     * @internalRemarks
     * Tests are located in ./repository_create_repository.test.ts
     *
     * @internal
     */
    static createRepository(migrator, typeRegistry, indexName, callCluster, includedHiddenTypes = [], injectedConstructor = SavedObjectsRepository) {
        const mappings = migrator.getActiveMappings();
        const allTypes = typeRegistry.getAllTypes().map((t) => t.name);
        const serializer = new serialization_1.SavedObjectsSerializer(typeRegistry);
        const visibleTypes = allTypes.filter((type) => !typeRegistry.isHidden(type));
        const missingTypeMappings = includedHiddenTypes.filter((type) => !allTypes.includes(type));
        if (missingTypeMappings.length > 0) {
            throw new Error(`Missing mappings for saved objects types: '${missingTypeMappings.join(', ')}'`);
        }
        const allowedTypes = [...new Set(visibleTypes.concat(includedHiddenTypes))];
        return new injectedConstructor({
            index: indexName,
            migrator,
            mappings,
            typeRegistry,
            serializer,
            allowedTypes,
            callCluster: legacy_1.retryCallCluster(callCluster),
        });
    }
    /**
     * Persists an object
     *
     * @param {string} type
     * @param {object} attributes
     * @param {object} [options={}]
     * @property {string} [options.id] - force id on creation, not recommended
     * @property {boolean} [options.overwrite=false]
     * @property {object} [options.migrationVersion=undefined]
     * @property {string} [options.namespace]
     * @property {array} [options.references=[]] - [{ name, type, id }]
     * @returns {promise} - { id, type, version, attributes }
     */
    async create(type, attributes, options = {}) {
        const { id, migrationVersion, namespace, overwrite = false, references = [], refresh = DEFAULT_REFRESH_SETTING, } = options;
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createUnsupportedTypeError(type);
        }
        const time = this._getCurrentTime();
        let savedObjectNamespace;
        let savedObjectNamespaces;
        if (this._registry.isSingleNamespace(type) && namespace) {
            savedObjectNamespace = namespace;
        }
        else if (this._registry.isMultiNamespace(type)) {
            if (id && overwrite) {
                // we will overwrite a multi-namespace saved object if it exists; if that happens, ensure we preserve its included namespaces
                savedObjectNamespaces = await this.preflightGetNamespaces(type, id, namespace);
            }
            else {
                savedObjectNamespaces = getSavedObjectNamespaces(namespace);
            }
        }
        const migrated = this._migrator.migrateDocument({
            id,
            type,
            ...(savedObjectNamespace && { namespace: savedObjectNamespace }),
            ...(savedObjectNamespaces && { namespaces: savedObjectNamespaces }),
            attributes,
            migrationVersion,
            updated_at: time,
            ...(Array.isArray(references) && { references }),
        });
        const raw = this._serializer.savedObjectToRaw(migrated);
        const method = id && overwrite ? 'index' : 'create';
        const response = await this._writeToCluster(method, {
            id: raw._id,
            index: this.getIndexForType(type),
            refresh,
            body: raw._source,
        });
        return this._rawToSavedObject({
            ...raw,
            ...response,
        });
    }
    /**
     * Creates multiple documents at once
     *
     * @param {array} objects - [{ type, id, attributes, references, migrationVersion }]
     * @param {object} [options={}]
     * @property {boolean} [options.overwrite=false] - overwrites existing documents
     * @property {string} [options.namespace]
     * @returns {promise} -  {saved_objects: [[{ id, type, version, references, attributes, error: { message } }]}
     */
    async bulkCreate(objects, options = {}) {
        const { namespace, overwrite = false, refresh = DEFAULT_REFRESH_SETTING } = options;
        const time = this._getCurrentTime();
        let bulkGetRequestIndexCounter = 0;
        const expectedResults = objects.map((object) => {
            if (!this._allowedTypes.includes(object.type)) {
                return {
                    tag: 'Left',
                    error: {
                        id: object.id,
                        type: object.type,
                        error: errors_1.SavedObjectsErrorHelpers.createUnsupportedTypeError(object.type).output.payload,
                    },
                };
            }
            const method = object.id && overwrite ? 'index' : 'create';
            const requiresNamespacesCheck = method === 'index' && this._registry.isMultiNamespace(object.type);
            if (object.id == null)
                object.id = uuid_1.default.v1();
            return {
                tag: 'Right',
                value: {
                    method,
                    object,
                    ...(requiresNamespacesCheck && { esRequestIndex: bulkGetRequestIndexCounter++ }),
                },
            };
        });
        const bulkGetDocs = expectedResults
            .filter(isRight)
            .filter(({ value }) => value.esRequestIndex !== undefined)
            .map(({ value: { object: { type, id } } }) => ({
            _id: this._serializer.generateRawId(namespace, type, id),
            _index: this.getIndexForType(type),
            _source: ['type', 'namespaces'],
        }));
        const bulkGetResponse = bulkGetDocs.length
            ? await this._callCluster('mget', {
                body: {
                    docs: bulkGetDocs,
                },
                ignore: [404],
            })
            : undefined;
        let bulkRequestIndexCounter = 0;
        const bulkCreateParams = [];
        const expectedBulkResults = expectedResults.map((expectedBulkGetResult) => {
            if (isLeft(expectedBulkGetResult)) {
                return expectedBulkGetResult;
            }
            let savedObjectNamespace;
            let savedObjectNamespaces;
            const { esRequestIndex, object, method } = expectedBulkGetResult.value;
            if (esRequestIndex !== undefined) {
                const indexFound = bulkGetResponse.status !== 404;
                const actualResult = indexFound ? bulkGetResponse.docs[esRequestIndex] : undefined;
                const docFound = indexFound && actualResult.found === true;
                if (docFound && !this.rawDocExistsInNamespace(actualResult, namespace)) {
                    const { id, type } = object;
                    return {
                        tag: 'Left',
                        error: {
                            id,
                            type,
                            error: errors_1.SavedObjectsErrorHelpers.createConflictError(type, id).output.payload,
                        },
                    };
                }
                savedObjectNamespaces = getSavedObjectNamespaces(namespace, docFound && actualResult);
            }
            else {
                if (this._registry.isSingleNamespace(object.type)) {
                    savedObjectNamespace = namespace;
                }
                else if (this._registry.isMultiNamespace(object.type)) {
                    savedObjectNamespaces = getSavedObjectNamespaces(namespace);
                }
            }
            const expectedResult = {
                esRequestIndex: bulkRequestIndexCounter++,
                requestedId: object.id,
                rawMigratedDoc: this._serializer.savedObjectToRaw(this._migrator.migrateDocument({
                    id: object.id,
                    type: object.type,
                    attributes: object.attributes,
                    migrationVersion: object.migrationVersion,
                    ...(savedObjectNamespace && { namespace: savedObjectNamespace }),
                    ...(savedObjectNamespaces && { namespaces: savedObjectNamespaces }),
                    updated_at: time,
                    references: object.references || [],
                })),
            };
            bulkCreateParams.push({
                [method]: {
                    _id: expectedResult.rawMigratedDoc._id,
                    _index: this.getIndexForType(object.type),
                },
            }, expectedResult.rawMigratedDoc._source);
            return { tag: 'Right', value: expectedResult };
        });
        const bulkResponse = bulkCreateParams.length
            ? await this._writeToCluster('bulk', {
                refresh,
                body: bulkCreateParams,
            })
            : undefined;
        return {
            saved_objects: expectedBulkResults.map((expectedResult) => {
                if (isLeft(expectedResult)) {
                    return expectedResult.error;
                }
                const { requestedId, rawMigratedDoc, esRequestIndex } = expectedResult.value;
                const { error, ...rawResponse } = Object.values(bulkResponse.items[esRequestIndex])[0];
                if (error) {
                    return {
                        id: requestedId,
                        type: rawMigratedDoc._source.type,
                        error: getBulkOperationError(error, rawMigratedDoc._source.type, requestedId),
                    };
                }
                // When method == 'index' the bulkResponse doesn't include the indexed
                // _source so we return rawMigratedDoc but have to spread the latest
                // _seq_no and _primary_term values from the rawResponse.
                return this._rawToSavedObject({
                    ...rawMigratedDoc,
                    ...{ _seq_no: rawResponse._seq_no, _primary_term: rawResponse._primary_term },
                });
            }),
        };
    }
    /**
     * Deletes an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} [options={}]
     * @property {string} [options.namespace]
     * @returns {promise}
     */
    async delete(type, id, options = {}) {
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        const { namespace, refresh = DEFAULT_REFRESH_SETTING } = options;
        const rawId = this._serializer.generateRawId(namespace, type, id);
        let preflightResult;
        if (this._registry.isMultiNamespace(type)) {
            preflightResult = await this.preflightCheckIncludesNamespace(type, id, namespace);
            const existingNamespaces = getSavedObjectNamespaces(undefined, preflightResult);
            const remainingNamespaces = existingNamespaces?.filter((x) => x !== getNamespaceString(namespace));
            if (remainingNamespaces?.length) {
                // if there is 1 or more namespace remaining, update the saved object
                const time = this._getCurrentTime();
                const doc = {
                    updated_at: time,
                    namespaces: remainingNamespaces,
                };
                const updateResponse = await this._writeToCluster('update', {
                    id: rawId,
                    index: this.getIndexForType(type),
                    ...getExpectedVersionProperties(undefined, preflightResult),
                    refresh,
                    ignore: [404],
                    body: {
                        doc,
                    },
                });
                if (updateResponse.status === 404) {
                    // see "404s from missing index" above
                    throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
                }
                return {};
            }
        }
        const deleteResponse = await this._writeToCluster('delete', {
            id: rawId,
            index: this.getIndexForType(type),
            ...getExpectedVersionProperties(undefined, preflightResult),
            refresh,
            ignore: [404],
        });
        const deleted = deleteResponse.result === 'deleted';
        if (deleted) {
            return {};
        }
        const deleteDocNotFound = deleteResponse.result === 'not_found';
        const deleteIndexNotFound = deleteResponse.error && deleteResponse.error.type === 'index_not_found_exception';
        if (deleteDocNotFound || deleteIndexNotFound) {
            // see "404s from missing index" above
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        throw new Error(`Unexpected Elasticsearch DELETE response: ${JSON.stringify({
            type,
            id,
            response: deleteResponse,
        })}`);
    }
    /**
     * Deletes all objects from the provided namespace.
     *
     * @param {string} namespace
     * @returns {promise} - { took, timed_out, total, deleted, batches, version_conflicts, noops, retries, failures }
     */
    async deleteByNamespace(namespace, options = {}) {
        if (!namespace || typeof namespace !== 'string') {
            throw new TypeError(`namespace is required, and must be a string`);
        }
        const { refresh = DEFAULT_REFRESH_SETTING } = options;
        const allTypes = Object.keys(mappings_1.getRootPropertiesObjects(this._mappings));
        const typesToUpdate = allTypes.filter((type) => !this._registry.isNamespaceAgnostic(type));
        const updateOptions = {
            index: this.getIndicesForTypes(typesToUpdate),
            ignore: [404],
            refresh,
            body: {
                script: {
                    source: `
              if (!ctx._source.containsKey('namespaces')) {
                ctx.op = "delete";
              } else {
                ctx._source['namespaces'].removeAll(Collections.singleton(params['namespace']));
                if (ctx._source['namespaces'].empty) {
                  ctx.op = "delete";
                }
              }
            `,
                    lang: 'painless',
                    params: { namespace: getNamespaceString(namespace) },
                },
                conflicts: 'proceed',
                ...search_dsl_1.getSearchDsl(this._mappings, this._registry, {
                    namespaces: namespace ? [namespace] : undefined,
                    type: typesToUpdate,
                }),
            },
        };
        return await this._writeToCluster('updateByQuery', updateOptions);
    }
    /**
     * @param {object} [options={}]
     * @property {(string|Array<string>)} [options.type]
     * @property {string} [options.search]
     * @property {string} [options.defaultSearchOperator]
     * @property {Array<string>} [options.searchFields] - see Elasticsearch Simple Query String
     *                                        Query field argument for more information
     * @property {integer} [options.page=1]
     * @property {integer} [options.perPage=20]
     * @property {string} [options.sortField]
     * @property {string} [options.sortOrder]
     * @property {Array<string>} [options.fields]
     * @property {string} [options.namespace]
     * @property {object} [options.hasReference] - { type, id }
     * @property {string} [options.preference]
     * @returns {promise} - { saved_objects: [{ id, type, version, attributes }], total, per_page, page }
     */
    async find({ search, defaultSearchOperator = 'OR', searchFields, hasReference, page = 1, perPage = 20, sortField, sortOrder, fields, namespaces, type, filter, preference, }) {
        if (!type) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError('options.type must be a string or an array of strings');
        }
        const types = Array.isArray(type) ? type : [type];
        const allowedTypes = types.filter((t) => this._allowedTypes.includes(t));
        if (allowedTypes.length === 0) {
            return {
                page,
                per_page: perPage,
                total: 0,
                saved_objects: [],
            };
        }
        if (searchFields && !Array.isArray(searchFields)) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError('options.searchFields must be an array');
        }
        if (fields && !Array.isArray(fields)) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError('options.fields must be an array');
        }
        let kueryNode;
        try {
            if (filter) {
                kueryNode = filter_utils_1.validateConvertFilterToKueryNode(allowedTypes, filter, this._mappings);
            }
        }
        catch (e) {
            if (e.name === 'KQLSyntaxError') {
                throw errors_1.SavedObjectsErrorHelpers.createBadRequestError('KQLSyntaxError: ' + e.message);
            }
            else {
                throw e;
            }
        }
        const esOptions = {
            index: this.getIndicesForTypes(allowedTypes),
            size: perPage,
            from: perPage * (page - 1),
            _source: included_fields_1.includedFields(type, fields),
            ignore: [404],
            rest_total_hits_as_int: true,
            preference,
            body: {
                seq_no_primary_term: true,
                ...search_dsl_1.getSearchDsl(this._mappings, this._registry, {
                    search,
                    defaultSearchOperator,
                    searchFields,
                    type: allowedTypes,
                    sortField,
                    sortOrder,
                    namespaces,
                    hasReference,
                    kueryNode,
                }),
            },
        };
        const response = await this._callCluster('search', esOptions);
        if (response.status === 404) {
            // 404 is only possible here if the index is missing, which
            // we don't want to leak, see "404s from missing index" above
            return {
                page,
                per_page: perPage,
                total: 0,
                saved_objects: [],
            };
        }
        return {
            page,
            per_page: perPage,
            total: response.hits.total,
            saved_objects: response.hits.hits.map((hit) => ({
                ...this._rawToSavedObject(hit),
                score: hit._score,
            })),
        };
    }
    /**
     * Returns an array of objects by id
     *
     * @param {array} objects - an array of objects containing id, type and optionally fields
     * @param {object} [options={}]
     * @property {string} [options.namespace]
     * @returns {promise} - { saved_objects: [{ id, type, version, attributes }] }
     * @example
     *
     * bulkGet([
     *   { id: 'one', type: 'config' },
     *   { id: 'foo', type: 'index-pattern' }
     * ])
     */
    async bulkGet(objects = [], options = {}) {
        const { namespace } = options;
        if (objects.length === 0) {
            return { saved_objects: [] };
        }
        let bulkGetRequestIndexCounter = 0;
        const expectedBulkGetResults = objects.map((object) => {
            const { type, id, fields } = object;
            if (!this._allowedTypes.includes(type)) {
                return {
                    tag: 'Left',
                    error: {
                        id,
                        type,
                        error: errors_1.SavedObjectsErrorHelpers.createUnsupportedTypeError(type).output.payload,
                    },
                };
            }
            return {
                tag: 'Right',
                value: {
                    type,
                    id,
                    fields,
                    esRequestIndex: bulkGetRequestIndexCounter++,
                },
            };
        });
        const bulkGetDocs = expectedBulkGetResults
            .filter(isRight)
            .map(({ value: { type, id, fields } }) => ({
            _id: this._serializer.generateRawId(namespace, type, id),
            _index: this.getIndexForType(type),
            _source: included_fields_1.includedFields(type, fields),
        }));
        const bulkGetResponse = bulkGetDocs.length
            ? await this._callCluster('mget', {
                body: {
                    docs: bulkGetDocs,
                },
                ignore: [404],
            })
            : undefined;
        return {
            saved_objects: expectedBulkGetResults.map((expectedResult) => {
                if (isLeft(expectedResult)) {
                    return expectedResult.error;
                }
                const { type, id, esRequestIndex } = expectedResult.value;
                const doc = bulkGetResponse.docs[esRequestIndex];
                if (!doc.found || !this.rawDocExistsInNamespace(doc, namespace)) {
                    return {
                        id,
                        type,
                        error: errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id).output.payload,
                    };
                }
                const time = doc._source.updated_at;
                let namespaces = [];
                if (!this._registry.isNamespaceAgnostic(type)) {
                    namespaces = doc._source.namespaces ?? [getNamespaceString(doc._source.namespace)];
                }
                return {
                    id,
                    type,
                    namespaces,
                    ...(time && { updated_at: time }),
                    version: version_1.encodeHitVersion(doc),
                    attributes: doc._source[type],
                    references: doc._source.references || [],
                    migrationVersion: doc._source.migrationVersion,
                };
            }),
        };
    }
    /**
     * Gets a single object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} [options={}]
     * @property {string} [options.namespace]
     * @returns {promise} - { id, type, version, attributes }
     */
    async get(type, id, options = {}) {
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        const { namespace } = options;
        const response = await this._callCluster('get', {
            id: this._serializer.generateRawId(namespace, type, id),
            index: this.getIndexForType(type),
            ignore: [404],
        });
        const docNotFound = response.found === false;
        const indexNotFound = response.status === 404;
        if (docNotFound || indexNotFound || !this.rawDocExistsInNamespace(response, namespace)) {
            // see "404s from missing index" above
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        const { updated_at: updatedAt } = response._source;
        let namespaces = [];
        if (!this._registry.isNamespaceAgnostic(type)) {
            namespaces = response._source.namespaces ?? [getNamespaceString(response._source.namespace)];
        }
        return {
            id,
            type,
            namespaces,
            ...(updatedAt && { updated_at: updatedAt }),
            version: version_1.encodeHitVersion(response),
            attributes: response._source[type],
            references: response._source.references || [],
            migrationVersion: response._source.migrationVersion,
        };
    }
    /**
     * Updates an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} [options={}]
     * @property {string} options.version - ensures version matches that of persisted object
     * @property {string} [options.namespace]
     * @property {array} [options.references] - [{ name, type, id }]
     * @returns {promise}
     */
    async update(type, id, attributes, options = {}) {
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        const { version, namespace, references, refresh = DEFAULT_REFRESH_SETTING } = options;
        let preflightResult;
        if (this._registry.isMultiNamespace(type)) {
            preflightResult = await this.preflightCheckIncludesNamespace(type, id, namespace);
        }
        const time = this._getCurrentTime();
        const doc = {
            [type]: attributes,
            updated_at: time,
            ...(Array.isArray(references) && { references }),
        };
        const updateResponse = await this._writeToCluster('update', {
            id: this._serializer.generateRawId(namespace, type, id),
            index: this.getIndexForType(type),
            ...getExpectedVersionProperties(version, preflightResult),
            refresh,
            ignore: [404],
            body: {
                doc,
            },
            _sourceIncludes: ['namespace', 'namespaces'],
        });
        if (updateResponse.status === 404) {
            // see "404s from missing index" above
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        let namespaces = [];
        if (!this._registry.isNamespaceAgnostic(type)) {
            namespaces = updateResponse.get._source.namespaces ?? [
                getNamespaceString(updateResponse.get._source.namespace),
            ];
        }
        return {
            id,
            type,
            updated_at: time,
            version: version_1.encodeHitVersion(updateResponse),
            namespaces,
            references,
            attributes,
        };
    }
    /**
     * Adds one or more namespaces to a given multi-namespace saved object. This method and
     * [`deleteFromNamespaces`]{@link SavedObjectsRepository.deleteFromNamespaces} are the only ways to change which Spaces a multi-namespace
     * saved object is shared to.
     */
    async addToNamespaces(type, id, namespaces, options = {}) {
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        if (!this._registry.isMultiNamespace(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError(`${type} doesn't support multiple namespaces`);
        }
        if (!namespaces.length) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError('namespaces must be a non-empty array of strings');
        }
        const { version, namespace, refresh = DEFAULT_REFRESH_SETTING } = options;
        const rawId = this._serializer.generateRawId(undefined, type, id);
        const preflightResult = await this.preflightCheckIncludesNamespace(type, id, namespace);
        const existingNamespaces = getSavedObjectNamespaces(undefined, preflightResult);
        // there should never be a case where a multi-namespace object does not have any existing namespaces
        // however, it is a possibility if someone manually modifies the document in Elasticsearch
        const time = this._getCurrentTime();
        const doc = {
            updated_at: time,
            namespaces: existingNamespaces ? unique(existingNamespaces.concat(namespaces)) : namespaces,
        };
        const updateResponse = await this._writeToCluster('update', {
            id: rawId,
            index: this.getIndexForType(type),
            ...getExpectedVersionProperties(version, preflightResult),
            refresh,
            ignore: [404],
            body: {
                doc,
            },
        });
        if (updateResponse.status === 404) {
            // see "404s from missing index" above
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        return {};
    }
    /**
     * Removes one or more namespaces from a given multi-namespace saved object. If no namespaces remain, the saved object is deleted
     * entirely. This method and [`addToNamespaces`]{@link SavedObjectsRepository.addToNamespaces} are the only ways to change which Spaces a
     * multi-namespace saved object is shared to.
     */
    async deleteFromNamespaces(type, id, namespaces, options = {}) {
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        if (!this._registry.isMultiNamespace(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError(`${type} doesn't support multiple namespaces`);
        }
        if (!namespaces.length) {
            throw errors_1.SavedObjectsErrorHelpers.createBadRequestError('namespaces must be a non-empty array of strings');
        }
        const { namespace, refresh = DEFAULT_REFRESH_SETTING } = options;
        const rawId = this._serializer.generateRawId(undefined, type, id);
        const preflightResult = await this.preflightCheckIncludesNamespace(type, id, namespace);
        const existingNamespaces = getSavedObjectNamespaces(undefined, preflightResult);
        // if there are somehow no existing namespaces, allow the operation to proceed and delete this saved object
        const remainingNamespaces = existingNamespaces?.filter((x) => !namespaces.includes(x));
        if (remainingNamespaces?.length) {
            // if there is 1 or more namespace remaining, update the saved object
            const time = this._getCurrentTime();
            const doc = {
                updated_at: time,
                namespaces: remainingNamespaces,
            };
            const updateResponse = await this._writeToCluster('update', {
                id: rawId,
                index: this.getIndexForType(type),
                ...getExpectedVersionProperties(undefined, preflightResult),
                refresh,
                ignore: [404],
                body: {
                    doc,
                },
            });
            if (updateResponse.status === 404) {
                // see "404s from missing index" above
                throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
            }
            return {};
        }
        else {
            // if there are no namespaces remaining, delete the saved object
            const deleteResponse = await this._writeToCluster('delete', {
                id: this._serializer.generateRawId(undefined, type, id),
                index: this.getIndexForType(type),
                ...getExpectedVersionProperties(undefined, preflightResult),
                refresh,
                ignore: [404],
            });
            const deleted = deleteResponse.result === 'deleted';
            if (deleted) {
                return {};
            }
            const deleteDocNotFound = deleteResponse.result === 'not_found';
            const deleteIndexNotFound = deleteResponse.error && deleteResponse.error.type === 'index_not_found_exception';
            if (deleteDocNotFound || deleteIndexNotFound) {
                // see "404s from missing index" above
                throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
            }
            throw new Error(`Unexpected Elasticsearch DELETE response: ${JSON.stringify({
                type,
                id,
                response: deleteResponse,
            })}`);
        }
    }
    /**
     * Updates multiple objects in bulk
     *
     * @param {array} objects - [{ type, id, attributes, options: { version, namespace } references }]
     * @property {string} options.version - ensures version matches that of persisted object
     * @property {string} [options.namespace]
     * @returns {promise} -  {saved_objects: [[{ id, type, version, references, attributes, error: { message } }]}
     */
    async bulkUpdate(objects, options = {}) {
        const time = this._getCurrentTime();
        const { namespace } = options;
        let bulkGetRequestIndexCounter = 0;
        const expectedBulkGetResults = objects.map((object) => {
            const { type, id } = object;
            if (!this._allowedTypes.includes(type)) {
                return {
                    tag: 'Left',
                    error: {
                        id,
                        type,
                        error: errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id).output.payload,
                    },
                };
            }
            const { attributes, references, version } = object;
            const documentToSave = {
                [type]: attributes,
                updated_at: time,
                ...(Array.isArray(references) && { references }),
            };
            const requiresNamespacesCheck = this._registry.isMultiNamespace(object.type);
            return {
                tag: 'Right',
                value: {
                    type,
                    id,
                    version,
                    documentToSave,
                    ...(requiresNamespacesCheck && { esRequestIndex: bulkGetRequestIndexCounter++ }),
                },
            };
        });
        const bulkGetDocs = expectedBulkGetResults
            .filter(isRight)
            .filter(({ value }) => value.esRequestIndex !== undefined)
            .map(({ value: { type, id } }) => ({
            _id: this._serializer.generateRawId(namespace, type, id),
            _index: this.getIndexForType(type),
            _source: ['type', 'namespaces'],
        }));
        const bulkGetResponse = bulkGetDocs.length
            ? await this._callCluster('mget', {
                body: {
                    docs: bulkGetDocs,
                },
                ignore: [404],
            })
            : undefined;
        let bulkUpdateRequestIndexCounter = 0;
        const bulkUpdateParams = [];
        const expectedBulkUpdateResults = expectedBulkGetResults.map((expectedBulkGetResult) => {
            if (isLeft(expectedBulkGetResult)) {
                return expectedBulkGetResult;
            }
            const { esRequestIndex, id, type, version, documentToSave } = expectedBulkGetResult.value;
            let namespaces;
            let versionProperties;
            if (esRequestIndex !== undefined) {
                const indexFound = bulkGetResponse.status !== 404;
                const actualResult = indexFound ? bulkGetResponse.docs[esRequestIndex] : undefined;
                const docFound = indexFound && actualResult.found === true;
                if (!docFound || !this.rawDocExistsInNamespace(actualResult, namespace)) {
                    return {
                        tag: 'Left',
                        error: {
                            id,
                            type,
                            error: errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id).output.payload,
                        },
                    };
                }
                namespaces = actualResult._source.namespaces ?? [
                    getNamespaceString(actualResult._source.namespace),
                ];
                versionProperties = getExpectedVersionProperties(version, actualResult);
            }
            else {
                if (this._registry.isSingleNamespace(type)) {
                    namespaces = [getNamespaceString(namespace)];
                }
                versionProperties = getExpectedVersionProperties(version);
            }
            const expectedResult = {
                type,
                id,
                namespaces,
                esRequestIndex: bulkUpdateRequestIndexCounter++,
                documentToSave: expectedBulkGetResult.value.documentToSave,
            };
            bulkUpdateParams.push({
                update: {
                    _id: this._serializer.generateRawId(namespace, type, id),
                    _index: this.getIndexForType(type),
                    ...versionProperties,
                },
            }, { doc: documentToSave });
            return { tag: 'Right', value: expectedResult };
        });
        const { refresh = DEFAULT_REFRESH_SETTING } = options;
        const bulkUpdateResponse = bulkUpdateParams.length
            ? await this._writeToCluster('bulk', {
                refresh,
                body: bulkUpdateParams,
            })
            : {};
        return {
            saved_objects: expectedBulkUpdateResults.map((expectedResult) => {
                if (isLeft(expectedResult)) {
                    return expectedResult.error;
                }
                const { type, id, namespaces, documentToSave, esRequestIndex } = expectedResult.value;
                const response = bulkUpdateResponse.items[esRequestIndex];
                const { error, _seq_no: seqNo, _primary_term: primaryTerm } = Object.values(response)[0];
                const { [type]: attributes, references, updated_at } = documentToSave;
                if (error) {
                    return {
                        id,
                        type,
                        error: getBulkOperationError(error, type, id),
                    };
                }
                return {
                    id,
                    type,
                    ...(namespaces && { namespaces }),
                    updated_at,
                    version: version_1.encodeVersion(seqNo, primaryTerm),
                    attributes,
                    references,
                };
            }),
        };
    }
    /**
     * Increases a counter field by one. Creates the document if one doesn't exist for the given id.
     *
     * @param {string} type
     * @param {string} id
     * @param {string} counterFieldName
     * @param {object} [options={}]
     * @property {object} [options.migrationVersion=undefined]
     * @returns {promise}
     */
    async incrementCounter(type, id, counterFieldName, options = {}) {
        if (typeof type !== 'string') {
            throw new Error('"type" argument must be a string');
        }
        if (typeof counterFieldName !== 'string') {
            throw new Error('"counterFieldName" argument must be a string');
        }
        if (!this._allowedTypes.includes(type)) {
            throw errors_1.SavedObjectsErrorHelpers.createUnsupportedTypeError(type);
        }
        const { migrationVersion, namespace, refresh = DEFAULT_REFRESH_SETTING } = options;
        const time = this._getCurrentTime();
        let savedObjectNamespace;
        let savedObjectNamespaces;
        if (this._registry.isSingleNamespace(type) && namespace) {
            savedObjectNamespace = namespace;
        }
        else if (this._registry.isMultiNamespace(type)) {
            savedObjectNamespaces = await this.preflightGetNamespaces(type, id, namespace);
        }
        const migrated = this._migrator.migrateDocument({
            id,
            type,
            ...(savedObjectNamespace && { namespace: savedObjectNamespace }),
            ...(savedObjectNamespaces && { namespaces: savedObjectNamespaces }),
            attributes: { [counterFieldName]: 1 },
            migrationVersion,
            updated_at: time,
        });
        const raw = this._serializer.savedObjectToRaw(migrated);
        const response = await this._writeToCluster('update', {
            id: raw._id,
            index: this.getIndexForType(type),
            refresh,
            _source: true,
            body: {
                script: {
                    source: `
              if (ctx._source[params.type][params.counterFieldName] == null) {
                ctx._source[params.type][params.counterFieldName] = params.count;
              }
              else {
                ctx._source[params.type][params.counterFieldName] += params.count;
              }
              ctx._source.updated_at = params.time;
            `,
                    lang: 'painless',
                    params: {
                        count: 1,
                        time,
                        type,
                        counterFieldName,
                    },
                },
                upsert: raw._source,
            },
        });
        return {
            id,
            type,
            updated_at: time,
            references: response.get._source.references,
            version: version_1.encodeHitVersion(response),
            attributes: response.get._source[type],
        };
    }
    async _writeToCluster(...args) {
        try {
            return await this._callCluster(...args);
        }
        catch (err) {
            throw decorate_es_error_1.decorateEsError(err);
        }
    }
    async _callCluster(...args) {
        try {
            return await this._unwrappedCallCluster(...args);
        }
        catch (err) {
            throw decorate_es_error_1.decorateEsError(err);
        }
    }
    /**
     * Returns index specified by the given type or the default index
     *
     * @param type - the type
     */
    getIndexForType(type) {
        return this._registry.getIndex(type) || this._index;
    }
    /**
     * Returns an array of indices as specified in `this._registry` for each of the
     * given `types`. If any of the types don't have an associated index, the
     * default index `this._index` will be included.
     *
     * @param types The types whose indices should be retrieved
     */
    getIndicesForTypes(types) {
        return unique(types.map((t) => this.getIndexForType(t)));
    }
    _getCurrentTime() {
        return new Date().toISOString();
    }
    _rawToSavedObject(raw) {
        const savedObject = this._serializer.rawToSavedObject(raw);
        const { namespace, type } = savedObject;
        if (this._registry.isSingleNamespace(type)) {
            savedObject.namespaces = [getNamespaceString(namespace)];
        }
        return lodash_1.omit(savedObject, 'namespace');
    }
    /**
     * Check to ensure that a raw document exists in a namespace. If the document is not a multi-namespace type, then this returns `true` as
     * we rely on the guarantees of the document ID format. If the document is a multi-namespace type, this checks to ensure that the
     * document's `namespaces` value includes the string representation of the given namespace.
     *
     * WARNING: This should only be used for documents that were retrieved from Elasticsearch. Otherwise, the guarantees of the document ID
     * format mentioned above do not apply.
     */
    rawDocExistsInNamespace(raw, namespace) {
        const rawDocType = raw._source.type;
        // if the type is namespace isolated, or namespace agnostic, we can continue to rely on the guarantees
        // of the document ID format and don't need to check this
        if (!this._registry.isMultiNamespace(rawDocType)) {
            return true;
        }
        const namespaces = raw._source.namespaces;
        return namespaces?.includes(getNamespaceString(namespace)) ?? false;
    }
    /**
     * Pre-flight check to get a multi-namespace saved object's included namespaces. This ensures that, if the saved object exists, it
     * includes the target namespace.
     *
     * @param type The type of the saved object.
     * @param id The ID of the saved object.
     * @param namespace The target namespace.
     * @returns Array of namespaces that this saved object currently includes, or (if the object does not exist yet) the namespaces that a
     * newly-created object will include. Value may be undefined if an existing saved object has no namespaces attribute; this should not
     * happen in normal operations, but it is possible if the Elasticsearch document is manually modified.
     * @throws Will throw an error if the saved object exists and it does not include the target namespace.
     */
    async preflightGetNamespaces(type, id, namespace) {
        if (!this._registry.isMultiNamespace(type)) {
            throw new Error(`Cannot make preflight get request for non-multi-namespace type '${type}'.`);
        }
        const response = await this._callCluster('get', {
            id: this._serializer.generateRawId(undefined, type, id),
            index: this.getIndexForType(type),
            ignore: [404],
        });
        const indexFound = response.status !== 404;
        const docFound = indexFound && response.found === true;
        if (docFound) {
            if (!this.rawDocExistsInNamespace(response, namespace)) {
                throw errors_1.SavedObjectsErrorHelpers.createConflictError(type, id);
            }
            return getSavedObjectNamespaces(namespace, response);
        }
        return getSavedObjectNamespaces(namespace);
    }
    /**
     * Pre-flight check for a multi-namespace saved object's namespaces. This ensures that, if the saved object exists, it includes the target
     * namespace.
     *
     * @param type The type of the saved object.
     * @param id The ID of the saved object.
     * @param namespace The target namespace.
     * @returns Raw document from Elasticsearch.
     * @throws Will throw an error if the saved object is not found, or if it doesn't include the target namespace.
     */
    async preflightCheckIncludesNamespace(type, id, namespace) {
        if (!this._registry.isMultiNamespace(type)) {
            throw new Error(`Cannot make preflight get request for non-multi-namespace type '${type}'.`);
        }
        const rawId = this._serializer.generateRawId(undefined, type, id);
        const response = await this._callCluster('get', {
            id: rawId,
            index: this.getIndexForType(type),
            ignore: [404],
        });
        const indexFound = response.status !== 404;
        const docFound = indexFound && response.found === true;
        if (!docFound || !this.rawDocExistsInNamespace(response, namespace)) {
            throw errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
        return response;
    }
}
exports.SavedObjectsRepository = SavedObjectsRepository;
function getBulkOperationError(error, type, id) {
    switch (error.type) {
        case 'version_conflict_engine_exception':
            return errors_1.SavedObjectsErrorHelpers.createConflictError(type, id).output.payload;
        case 'document_missing_exception':
            return errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id).output.payload;
        default:
            return {
                message: error.reason || JSON.stringify(error),
            };
    }
}
/**
 * Returns an object with the expected version properties. This facilitates Elasticsearch's Optimistic Concurrency Control.
 *
 * @param version Optional version specified by the consumer.
 * @param document Optional existing document that was obtained in a preflight operation.
 */
function getExpectedVersionProperties(version, document) {
    if (version) {
        return version_1.decodeRequestVersion(version);
    }
    else if (document) {
        return {
            if_seq_no: document._seq_no,
            if_primary_term: document._primary_term,
        };
    }
    return {};
}
/**
 * Returns the string representation of a namespace.
 * The default namespace is undefined, and is represented by the string 'default'.
 */
function getNamespaceString(namespace) {
    return namespace ?? 'default';
}
/**
 * Returns a string array of namespaces for a given saved object. If the saved object is undefined, the result is an array that contains the
 * current namespace. Value may be undefined if an existing saved object has no namespaces attribute; this should not happen in normal
 * operations, but it is possible if the Elasticsearch document is manually modified.
 *
 * @param namespace The current namespace.
 * @param document Optional existing saved object that was obtained in a preflight operation.
 */
function getSavedObjectNamespaces(namespace, document) {
    if (document) {
        return document._source?.namespaces;
    }
    return [getNamespaceString(namespace)];
}
const unique = (array) => [...new Set(array)];
