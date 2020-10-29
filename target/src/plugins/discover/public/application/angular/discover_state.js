"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqualState = exports.splitState = exports.isEqualFilters = exports.setState = exports.getState = void 0;
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
const public_1 = require("../../../../kibana_utils/public");
const public_2 = require("../../../../data/public");
const public_3 = require("../../../../kibana_legacy/public");
const APP_STATE_URL_KEY = '_a';
/**
 * Builds and returns appState and globalState containers and helper functions
 * Used to sync URL with UI state
 */
function getState({ defaultAppState = {}, storeInSessionStorage = false, history, }) {
    const stateStorage = public_1.createKbnUrlStateStorage({
        useHash: storeInSessionStorage,
        history,
    });
    const appStateFromUrl = stateStorage.get(APP_STATE_URL_KEY);
    if (appStateFromUrl && appStateFromUrl.query && !appStateFromUrl.query.language) {
        appStateFromUrl.query = public_3.migrateLegacyQuery(appStateFromUrl.query);
    }
    let initialAppState = {
        ...defaultAppState,
        ...appStateFromUrl,
    };
    let previousAppState;
    const appStateContainer = public_1.createStateContainer(initialAppState);
    const appStateContainerModified = {
        ...appStateContainer,
        set: (value) => {
            if (value) {
                previousAppState = appStateContainer.getState();
                appStateContainer.set(value);
            }
        },
    };
    const { start, stop } = public_1.syncState({
        storageKey: APP_STATE_URL_KEY,
        stateContainer: appStateContainerModified,
        stateStorage,
    });
    return {
        kbnUrlStateStorage: stateStorage,
        appStateContainer: appStateContainerModified,
        startSync: start,
        stopSync: stop,
        setAppState: (newPartial) => setState(appStateContainerModified, newPartial),
        replaceUrlAppState: async (newPartial = {}) => {
            const state = { ...appStateContainer.getState(), ...newPartial };
            await stateStorage.set(APP_STATE_URL_KEY, state, { replace: true });
        },
        resetInitialAppState: () => {
            initialAppState = appStateContainer.getState();
        },
        getPreviousAppState: () => previousAppState,
        flushToUrl: () => stateStorage.flush(),
        isAppStateDirty: () => !isEqualState(initialAppState, appStateContainer.getState()),
    };
}
exports.getState = getState;
/**
 * Helper function to merge a given new state with the existing state and to set the given state
 * container
 */
function setState(stateContainer, newState) {
    const oldState = stateContainer.getState();
    const mergedState = { ...oldState, ...newState };
    if (!isEqualState(oldState, mergedState)) {
        stateContainer.set(mergedState);
    }
}
exports.setState = setState;
/**
 * Helper function to compare 2 different filter states
 */
function isEqualFilters(filtersA, filtersB) {
    if (!filtersA && !filtersB) {
        return true;
    }
    else if (!filtersA || !filtersB) {
        return false;
    }
    return public_2.esFilters.compareFilters(filtersA, filtersB, public_2.esFilters.COMPARE_ALL_OPTIONS);
}
exports.isEqualFilters = isEqualFilters;
/**
 * helper function to extract filters of the given state
 * returns a state object without filters and an array of filters
 */
function splitState(state = {}) {
    const { filters = [], ...statePartial } = state;
    return { filters, state: statePartial };
}
exports.splitState = splitState;
/**
 * Helper function to compare 2 different state, is needed since comparing filters
 * works differently
 */
function isEqualState(stateA, stateB) {
    if (!stateA && !stateB) {
        return true;
    }
    else if (!stateA || !stateB) {
        return false;
    }
    const { filters: stateAFilters = [], ...stateAPartial } = stateA;
    const { filters: stateBFilters = [], ...stateBPartial } = stateB;
    return lodash_1.isEqual(stateAPartial, stateBPartial) && isEqualFilters(stateAFilters, stateBFilters);
}
exports.isEqualState = isEqualState;
