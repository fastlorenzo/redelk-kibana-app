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
exports.connectToQueryState = void 0;
const tslib_1 = require("tslib");
const operators_1 = require("rxjs/operators");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const common_1 = require("../../../common");
const timefilter_1 = require("../timefilter");
/**
 * Helper to setup two-way syncing of global data and a state container
 * @param QueryService: either setup or start
 * @param stateContainer to use for syncing
 */
exports.connectToQueryState = ({ timefilter: { timefilter }, filterManager, state$, }, stateContainer, syncConfig) => {
    const syncKeys = [];
    if (syncConfig.time) {
        syncKeys.push('time');
    }
    if (syncConfig.refreshInterval) {
        syncKeys.push('refreshInterval');
    }
    if (syncConfig.filters) {
        switch (syncConfig.filters) {
            case true:
                syncKeys.push('filters');
                break;
            case common_1.FilterStateStore.APP_STATE:
                syncKeys.push('appFilters');
                break;
            case common_1.FilterStateStore.GLOBAL_STATE:
                syncKeys.push('globalFilters');
                break;
        }
    }
    // initial syncing
    // TODO:
    // data services take precedence, this seems like a good default,
    // and apps could anyway set their own value after initialisation,
    // but maybe maybe this should be a configurable option?
    const initialState = { ...stateContainer.get() };
    let initialDirty = false;
    if (syncConfig.time && !lodash_1.default.isEqual(initialState.time, timefilter.getTime())) {
        initialState.time = timefilter.getTime();
        initialDirty = true;
    }
    if (syncConfig.refreshInterval &&
        !lodash_1.default.isEqual(initialState.refreshInterval, timefilter.getRefreshInterval())) {
        initialState.refreshInterval = timefilter.getRefreshInterval();
        initialDirty = true;
    }
    if (syncConfig.filters) {
        if (syncConfig.filters === true) {
            if (!initialState.filters ||
                !common_1.compareFilters(initialState.filters, filterManager.getFilters(), common_1.COMPARE_ALL_OPTIONS)) {
                initialState.filters = filterManager.getFilters();
                initialDirty = true;
            }
        }
        else if (syncConfig.filters === common_1.FilterStateStore.GLOBAL_STATE) {
            if (!initialState.filters ||
                !common_1.compareFilters(initialState.filters, filterManager.getGlobalFilters(), {
                    ...common_1.COMPARE_ALL_OPTIONS,
                    state: false,
                })) {
                initialState.filters = filterManager.getGlobalFilters();
                initialDirty = true;
            }
        }
        else if (syncConfig.filters === common_1.FilterStateStore.APP_STATE) {
            if (!initialState.filters ||
                !common_1.compareFilters(initialState.filters, filterManager.getAppFilters(), {
                    ...common_1.COMPARE_ALL_OPTIONS,
                    state: false,
                })) {
                initialState.filters = filterManager.getAppFilters();
                initialDirty = true;
            }
        }
    }
    if (initialDirty) {
        stateContainer.set({ ...stateContainer.get(), ...initialState });
    }
    // to ignore own state updates
    let updateInProgress = false;
    const subs = [
        state$
            .pipe(operators_1.filter(({ changes, state }) => {
            if (updateInProgress)
                return false;
            return syncKeys.some((syncKey) => changes[syncKey]);
        }), operators_1.map(({ changes }) => {
            const newState = {};
            if (syncConfig.time && changes.time) {
                newState.time = timefilter.getTime();
            }
            if (syncConfig.refreshInterval && changes.refreshInterval) {
                newState.refreshInterval = timefilter.getRefreshInterval();
            }
            if (syncConfig.filters) {
                if (syncConfig.filters === true && changes.filters) {
                    newState.filters = filterManager.getFilters();
                }
                else if (syncConfig.filters === common_1.FilterStateStore.GLOBAL_STATE &&
                    changes.globalFilters) {
                    newState.filters = filterManager.getGlobalFilters();
                }
                else if (syncConfig.filters === common_1.FilterStateStore.APP_STATE && changes.appFilters) {
                    newState.filters = filterManager.getAppFilters();
                }
            }
            return newState;
        }))
            .subscribe((newState) => {
            stateContainer.set({ ...stateContainer.get(), ...newState });
        }),
        stateContainer.state$.subscribe((state) => {
            updateInProgress = true;
            // cloneDeep is required because services are mutating passed objects
            // and state in state container is frozen
            if (syncConfig.time) {
                const time = timefilter_1.validateTimeRange(state.time) ? state.time : timefilter.getTimeDefaults();
                if (!lodash_1.default.isEqual(time, timefilter.getTime())) {
                    timefilter.setTime(lodash_1.default.cloneDeep(time));
                }
            }
            if (syncConfig.refreshInterval) {
                const refreshInterval = state.refreshInterval || timefilter.getRefreshIntervalDefaults();
                if (!lodash_1.default.isEqual(refreshInterval, timefilter.getRefreshInterval())) {
                    timefilter.setRefreshInterval(lodash_1.default.cloneDeep(refreshInterval));
                }
            }
            if (syncConfig.filters) {
                const filters = state.filters || [];
                if (syncConfig.filters === true) {
                    if (!common_1.compareFilters(filters, filterManager.getFilters(), common_1.COMPARE_ALL_OPTIONS)) {
                        filterManager.setFilters(lodash_1.default.cloneDeep(filters));
                    }
                }
                else if (syncConfig.filters === common_1.FilterStateStore.APP_STATE) {
                    if (!common_1.compareFilters(filters, filterManager.getAppFilters(), {
                        ...common_1.COMPARE_ALL_OPTIONS,
                        state: false,
                    })) {
                        filterManager.setAppFilters(lodash_1.default.cloneDeep(filters));
                    }
                }
                else if (syncConfig.filters === common_1.FilterStateStore.GLOBAL_STATE) {
                    if (!common_1.compareFilters(filters, filterManager.getGlobalFilters(), {
                        ...common_1.COMPARE_ALL_OPTIONS,
                        state: false,
                    })) {
                        filterManager.setGlobalFilters(lodash_1.default.cloneDeep(filters));
                    }
                }
            }
            updateInProgress = false;
        }),
    ];
    return () => {
        subs.forEach((s) => s.unsubscribe());
    };
};
