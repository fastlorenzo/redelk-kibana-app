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
exports.getVisualizationInstance = void 0;
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../discover/public");
exports.getVisualizationInstance = async ({ chrome, data, overlays, visualizations, createVisEmbeddableFromObject, savedObjects, savedVisualizations, toastNotifications, }, 
/**
 * opts can be either a saved visualization id passed as string,
 * or an object of new visualization params.
 * Both come from url search query
 */
opts) => {
    const savedVis = await savedVisualizations.get(opts);
    if (typeof opts !== 'string') {
        savedVis.searchSourceFields = { index: opts?.indexPattern };
    }
    const serializedVis = visualizations.convertToSerializedVis(savedVis);
    let vis = await visualizations.createVis(serializedVis.type, serializedVis);
    if (vis.type.setup) {
        try {
            vis = await vis.type.setup(vis);
        }
        catch {
            // skip this catch block
        }
    }
    const embeddableHandler = (await createVisEmbeddableFromObject(vis, {
        timeRange: data.query.timefilter.timefilter.getTime(),
        filters: data.query.filterManager.getFilters(),
        id: '',
    }));
    embeddableHandler.getOutput$().subscribe((output) => {
        if (output.error) {
            toastNotifications.addError(output.error, {
                title: i18n_1.i18n.translate('visualize.error.title', {
                    defaultMessage: 'Visualization error',
                }),
            });
        }
    });
    let savedSearch;
    if (vis.data.savedSearchId) {
        savedSearch = await public_1.createSavedSearchesLoader({
            savedObjectsClient: savedObjects.client,
            indexPatterns: data.indexPatterns,
            search: data.search,
            chrome,
            overlays,
        }).get(vis.data.savedSearchId);
    }
    return { vis, savedVis, savedSearch, embeddableHandler };
};
