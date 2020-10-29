"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSavedObject = void 0;
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
const lodash_1 = require("lodash");
const hydrate_index_pattern_1 = require("./hydrate_index_pattern");
const initialize_saved_object_1 = require("./initialize_saved_object");
const serialize_saved_object_1 = require("./serialize_saved_object");
const apply_es_resp_1 = require("./apply_es_resp");
const save_saved_object_1 = require("./save_saved_object");
function buildSavedObject(savedObject, config = {}, services) {
    const { indexPatterns, savedObjectsClient } = services;
    // type name for this object, used as the ES-type
    const esType = config.type || '';
    savedObject.getDisplayName = () => esType;
    // NOTE: this.type (not set in this file, but somewhere else) is the sub type, e.g. 'area' or
    // 'data table', while esType is the more generic type - e.g. 'visualization' or 'saved search'.
    savedObject.getEsType = () => esType;
    /**
     * Flips to true during a save operation, and back to false once the save operation
     * completes.
     * @type {boolean}
     */
    savedObject.isSaving = false;
    savedObject.defaults = config.defaults || {};
    // optional search source which this object configures
    savedObject.searchSource = config.searchSource
        ? services.search.searchSource.createEmpty()
        : undefined;
    // the id of the document
    savedObject.id = config.id || void 0;
    // the migration version of the document, should only be set on imports
    savedObject.migrationVersion = config.migrationVersion;
    // Whether to create a copy when the object is saved. This should eventually go away
    // in favor of a better rename/save flow.
    savedObject.copyOnSave = false;
    /**
     * After creation or fetching from ES, ensure that the searchSources index indexPattern
     * is an bonafide IndexPattern object.
     *
     * @return {Promise<IndexPattern | null>}
     */
    savedObject.hydrateIndexPattern = (id) => hydrate_index_pattern_1.hydrateIndexPattern(id || '', savedObject, indexPatterns, config);
    /**
     * Asynchronously initialize this object - will only run
     * once even if called multiple times.
     *
     * @return {Promise}
     * @resolved {SavedObject}
     */
    savedObject.init = lodash_1.once(() => initialize_saved_object_1.intializeSavedObject(savedObject, savedObjectsClient, config));
    savedObject.applyESResp = (resp) => apply_es_resp_1.applyESResp(resp, savedObject, config, services);
    /**
     * Serialize this object
     * @return {Object}
     */
    savedObject._serialize = () => serialize_saved_object_1.serializeSavedObject(savedObject, config);
    /**
     * Returns true if the object's original title has been changed. New objects return false.
     * @return {boolean}
     */
    savedObject.isTitleChanged = () => savedObject._source && savedObject._source.title !== savedObject.title;
    savedObject.creationOpts = (opts = {}) => ({
        id: savedObject.id,
        migrationVersion: savedObject.migrationVersion,
        ...opts,
    });
    savedObject.save = async (opts) => {
        try {
            const result = await save_saved_object_1.saveSavedObject(savedObject, config, opts, services);
            return Promise.resolve(result);
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    savedObject.destroy = () => { };
    /**
     * Delete this object from Elasticsearch
     * @return {promise}
     */
    savedObject.delete = () => {
        if (!savedObject.id) {
            return Promise.reject(new Error('Deleting a saved Object requires type and id'));
        }
        return savedObjectsClient.delete(esType, savedObject.id);
    };
}
exports.buildSavedObject = buildSavedObject;
