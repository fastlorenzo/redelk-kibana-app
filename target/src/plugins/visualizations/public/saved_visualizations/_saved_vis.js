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
exports.createSavedVisClass = exports.convertFromSerializedVis = exports.convertToSerializedVis = void 0;
/**
 * @name SavedVis
 *
 * @extends SavedObject.
 *
 * NOTE: It's a type of SavedObject, but specific to visualizations.
 */
const public_1 = require("../../../../plugins/saved_objects/public");
// @ts-ignore
const vis_update_state_1 = require("../legacy/vis_update_state");
const saved_visualization_references_1 = require("./saved_visualization_references");
const public_2 = require("../../../discover/public");
exports.convertToSerializedVis = (savedVis) => {
    const { id, title, description, visState, uiStateJSON, searchSourceFields } = savedVis;
    const aggs = searchSourceFields && searchSourceFields.index ? visState.aggs || [] : visState.aggs;
    return {
        id,
        title,
        type: visState.type,
        description,
        params: visState.params,
        uiState: JSON.parse(uiStateJSON || '{}'),
        data: {
            aggs,
            searchSource: searchSourceFields,
            savedSearchId: savedVis.savedSearchId,
        },
    };
};
exports.convertFromSerializedVis = (vis) => {
    return {
        id: vis.id,
        title: vis.title,
        description: vis.description,
        visState: {
            title: vis.title,
            type: vis.type,
            aggs: vis.data.aggs,
            params: vis.params,
        },
        uiStateJSON: JSON.stringify(vis.uiState),
        searchSourceFields: vis.data.searchSource,
        savedSearchId: vis.data.savedSearchId,
    };
};
function createSavedVisClass(services) {
    const SavedObjectClass = public_1.createSavedObjectClass(services);
    const savedSearch = public_2.createSavedSearchesLoader(services);
    class SavedVis extends SavedObjectClass {
        constructor(opts = {}) {
            if (typeof opts !== 'object') {
                opts = { id: opts };
            }
            const visState = !opts.type ? null : { type: opts.type };
            // Gives our SavedWorkspace the properties of a SavedObject
            super({
                type: SavedVis.type,
                mapping: SavedVis.mapping,
                extractReferences: saved_visualization_references_1.extractReferences,
                injectReferences: saved_visualization_references_1.injectReferences,
                id: opts.id || '',
                indexPattern: opts.indexPattern,
                defaults: {
                    title: '',
                    visState,
                    uiStateJSON: '{}',
                    description: '',
                    savedSearchId: opts.savedSearchId,
                    version: 1,
                },
                afterESResp: async (savedObject) => {
                    const savedVis = savedObject;
                    savedVis.visState = await vis_update_state_1.updateOldState(savedVis.visState);
                    if (savedVis.searchSourceFields?.index) {
                        await services.indexPatterns.get(savedVis.searchSourceFields.index);
                    }
                    if (savedVis.savedSearchId) {
                        await savedSearch.get(savedVis.savedSearchId);
                    }
                    return savedVis;
                },
            });
            this.showInRecentlyAccessed = true;
            this.getFullPath = () => {
                return `/app/visualize#/edit/${this.id}`;
            };
        }
    }
    SavedVis.type = 'visualization';
    SavedVis.mapping = {
        title: 'text',
        visState: 'json',
        uiStateJSON: 'text',
        description: 'text',
        savedSearchId: 'keyword',
        version: 'integer',
    };
    // Order these fields to the top, the rest are alphabetical
    SavedVis.fieldOrder = ['title', 'description'];
    return SavedVis;
}
exports.createSavedVisClass = createSavedVisClass;
