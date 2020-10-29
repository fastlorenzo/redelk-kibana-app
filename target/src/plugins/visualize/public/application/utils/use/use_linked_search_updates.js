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
exports.useLinkedSearchUpdates = void 0;
const react_1 = require("react");
const i18n_1 = require("@kbn/i18n");
exports.useLinkedSearchUpdates = (services, eventEmitter, appState, savedVisInstance) => {
    react_1.useEffect(() => {
        if (appState &&
            savedVisInstance &&
            savedVisInstance.savedSearch &&
            savedVisInstance.vis.data.searchSource) {
            const { savedSearch } = savedVisInstance;
            // SearchSource is a promise-based stream of search results that can inherit from other search sources.
            const { searchSource } = savedVisInstance.vis.data;
            const unlinkFromSavedSearch = () => {
                const searchSourceParent = savedSearch.searchSource;
                const searchSourceGrandparent = searchSourceParent?.getParent();
                const currentIndex = searchSourceParent?.getField('index');
                searchSource.setField('index', currentIndex);
                searchSource.setParent(searchSourceGrandparent);
                appState.transitions.unlinkSavedSearch({
                    query: searchSourceParent?.getField('query'),
                    parentFilters: searchSourceParent?.getOwnField('filter') || [],
                });
                services.toastNotifications.addSuccess(i18n_1.i18n.translate('visualize.linkedToSearch.unlinkSuccessNotificationText', {
                    defaultMessage: `Unlinked from saved search '{searchTitle}'`,
                    values: {
                        searchTitle: savedSearch.title,
                    },
                }));
            };
            eventEmitter.on('unlinkFromSavedSearch', unlinkFromSavedSearch);
            return () => {
                eventEmitter.off('unlinkFromSavedSearch', unlinkFromSavedSearch);
            };
        }
    }, [appState, eventEmitter, savedVisInstance, services.toastNotifications]);
};
