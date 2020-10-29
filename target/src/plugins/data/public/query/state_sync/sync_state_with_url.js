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
exports.syncQueryStateWithUrl = void 0;
const public_1 = require("../../../../kibana_utils/public");
const connect_to_query_state_1 = require("./connect_to_query_state");
const filters_1 = require("../../../common/es_query/filters");
const GLOBAL_STATE_STORAGE_KEY = '_g';
/**
 * Helper to setup syncing of global data with the URL
 * @param QueryService: either setup or start
 * @param kbnUrlStateStorage to use for syncing
 */
exports.syncQueryStateWithUrl = (query, kbnUrlStateStorage) => {
    const { timefilter: { timefilter }, filterManager, } = query;
    const defaultState = {
        time: timefilter.getTime(),
        refreshInterval: timefilter.getRefreshInterval(),
        filters: filterManager.getGlobalFilters(),
    };
    // retrieve current state from `_g` url
    const initialStateFromUrl = kbnUrlStateStorage.get(GLOBAL_STATE_STORAGE_KEY);
    // remember whether there was info in the URL
    const hasInheritedQueryFromUrl = Boolean(initialStateFromUrl && Object.keys(initialStateFromUrl).length);
    // prepare initial state, whatever was in URL takes precedences over current state in services
    const initialState = {
        ...defaultState,
        ...initialStateFromUrl,
    };
    const globalQueryStateContainer = public_1.createStateContainer(initialState);
    const stopSyncingWithStateContainer = connect_to_query_state_1.connectToQueryState(query, globalQueryStateContainer, {
        refreshInterval: true,
        time: true,
        filters: filters_1.FilterStateStore.GLOBAL_STATE,
    });
    // if there weren't any initial state in url,
    // then put _g key into url
    if (!initialStateFromUrl) {
        kbnUrlStateStorage.set(GLOBAL_STATE_STORAGE_KEY, initialState, {
            replace: true,
        });
    }
    // trigger initial syncing from state container to services if needed
    globalQueryStateContainer.set(initialState);
    const { start, stop: stopSyncingWithUrl } = public_1.syncState({
        stateStorage: kbnUrlStateStorage,
        stateContainer: {
            ...globalQueryStateContainer,
            set: (state) => {
                if (state) {
                    // syncState utils requires to handle incoming "null" value
                    globalQueryStateContainer.set(state);
                }
            },
        },
        storageKey: GLOBAL_STATE_STORAGE_KEY,
    });
    start();
    return {
        stop: () => {
            stopSyncingWithStateContainer();
            stopSyncingWithUrl();
        },
        hasInheritedQueryFromUrl,
    };
};
