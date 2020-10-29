"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyESResp = void 0;
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
const public_1 = require("../../../../kibana_utils/public");
const public_2 = require("../../../../data/public");
/**
 * A given response of and ElasticSearch containing a plain saved object is applied to the given
 * savedObject
 */
async function applyESResp(resp, savedObject, config, dependencies) {
    const mapping = public_2.expandShorthand(config.mapping);
    const esType = config.type || '';
    savedObject._source = lodash_1.default.cloneDeep(resp._source);
    const injectReferences = config.injectReferences;
    if (typeof resp.found === 'boolean' && !resp.found) {
        throw new public_1.SavedObjectNotFound(esType, savedObject.id || '');
    }
    const meta = resp._source.kibanaSavedObjectMeta || {};
    delete resp._source.kibanaSavedObjectMeta;
    if (!config.indexPattern && savedObject._source.indexPattern) {
        config.indexPattern = savedObject._source.indexPattern;
        delete savedObject._source.indexPattern;
    }
    // assign the defaults to the response
    lodash_1.default.defaults(savedObject._source, savedObject.defaults);
    // transform the source using _deserializers
    lodash_1.default.forOwn(mapping, (fieldMapping, fieldName) => {
        if (fieldMapping._deserialize && typeof fieldName === 'string') {
            savedObject._source[fieldName] = fieldMapping._deserialize(savedObject._source[fieldName]);
        }
    });
    // Give obj all of the values in _source.fields
    lodash_1.default.assign(savedObject, savedObject._source);
    savedObject.lastSavedTitle = savedObject.title;
    if (meta.searchSourceJSON) {
        try {
            let searchSourceValues = public_2.parseSearchSourceJSON(meta.searchSourceJSON);
            if (config.searchSource) {
                searchSourceValues = public_2.injectSearchSourceReferences(searchSourceValues, resp.references);
                savedObject.searchSource = await dependencies.search.searchSource.create(searchSourceValues);
            }
            else {
                savedObject.searchSourceFields = searchSourceValues;
            }
        }
        catch (error) {
            if (error.constructor.name === 'SavedObjectNotFound' &&
                error.savedObjectType === 'index-pattern') {
                // if parsing the search source fails because the index pattern wasn't found,
                // remember the reference - this is required for error handling on legacy imports
                savedObject.unresolvedIndexPatternReference = {
                    name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                    id: JSON.parse(meta.searchSourceJSON).index,
                    type: 'index-pattern',
                };
            }
            throw error;
        }
    }
    if (injectReferences && resp.references && resp.references.length > 0) {
        injectReferences(savedObject, resp.references);
    }
    if (typeof config.afterESResp === 'function') {
        savedObject = await config.afterESResp(savedObject);
    }
    return savedObject;
}
exports.applyESResp = applyESResp;
