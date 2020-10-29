"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSavedVisLoader = void 0;
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
const public_1 = require("../../../../plugins/saved_objects/public");
const find_list_items_1 = require("./find_list_items");
const _saved_vis_1 = require("./_saved_vis");
function createSavedVisLoader(services) {
    const { savedObjectsClient, visualizationTypes } = services;
    class SavedObjectLoaderVisualize extends public_1.SavedObjectLoader {
        constructor() {
            super(...arguments);
            this.mapHitSource = (source, id) => {
                const visTypes = visualizationTypes;
                source.id = id;
                source.url = this.urlFor(id);
                let typeName = source.typeName;
                if (source.visState) {
                    try {
                        typeName = JSON.parse(String(source.visState)).type;
                    }
                    catch (e) {
                        /* missing typename handled below */
                    } // eslint-disable-line no-empty
                }
                if (!typeName || !visTypes.get(typeName)) {
                    source.error = 'Unknown visualization type';
                    return source;
                }
                source.type = visTypes.get(typeName);
                source.savedObjectType = 'visualization';
                source.icon = source.type.icon;
                source.image = source.type.image;
                source.typeTitle = source.type.title;
                source.editUrl = `/edit/${id}`;
                return source;
            };
        }
        urlFor(id) {
            return `#/edit/${encodeURIComponent(id)}`;
        }
        // This behaves similarly to find, except it returns visualizations that are
        // defined as appExtensions and which may not conform to type: visualization
        findListItems(search = '', size = 100) {
            return find_list_items_1.findListItems({
                search,
                size,
                mapSavedObjectApiHits: this.mapSavedObjectApiHits.bind(this),
                savedObjectsClient,
                visTypes: visualizationTypes.getAliases(),
            });
        }
    }
    const SavedVis = _saved_vis_1.createSavedVisClass(services);
    return new SavedObjectLoaderVisualize(SavedVis, savedObjectsClient, services.chrome);
}
exports.createSavedVisLoader = createSavedVisLoader;
