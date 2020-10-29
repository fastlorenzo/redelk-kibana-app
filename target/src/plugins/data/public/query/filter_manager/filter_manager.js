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
exports.FilterManager = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const rxjs_1 = require("rxjs");
const sort_filters_1 = require("./lib/sort_filters");
const map_and_flatten_filters_1 = require("./lib/map_and_flatten_filters");
const only_disabled_1 = require("./lib/only_disabled");
const common_1 = require("../../../common");
class FilterManager {
    constructor(uiSettings) {
        this.filters = [];
        this.updated$ = new rxjs_1.Subject();
        this.fetch$ = new rxjs_1.Subject();
        this.uiSettings = uiSettings;
    }
    mergeIncomingFilters(partitionedFilters) {
        const globalFilters = partitionedFilters.globalFilters;
        const appFilters = partitionedFilters.appFilters;
        // existing globalFilters should be mutated by appFilters
        // ignore original appFilters which are already inside globalFilters
        const cleanedAppFilters = [];
        lodash_1.default.each(appFilters, function (filter, i) {
            const match = lodash_1.default.find(globalFilters, function (globalFilter) {
                return common_1.compareFilters(globalFilter, filter);
            });
            // no match, do continue with app filter
            if (!match) {
                return cleanedAppFilters.push(filter);
            }
            // matching filter in globalState, update global and don't add from appState
            lodash_1.default.assignIn(match.meta, filter.meta);
        });
        return FilterManager.mergeFilters(cleanedAppFilters, globalFilters);
    }
    static mergeFilters(appFilters, globalFilters) {
        return common_1.uniqFilters(appFilters.reverse().concat(globalFilters.reverse())).reverse();
    }
    static partitionFilters(filters) {
        const [globalFilters, appFilters] = lodash_1.default.partition(filters, common_1.isFilterPinned);
        return {
            globalFilters,
            appFilters,
        };
    }
    handleStateUpdate(newFilters) {
        newFilters.sort(sort_filters_1.sortFilters);
        const filtersUpdated = !common_1.compareFilters(this.filters, newFilters, common_1.COMPARE_ALL_OPTIONS);
        const updatedOnlyDisabledFilters = only_disabled_1.onlyDisabledFiltersChanged(newFilters, this.filters);
        this.filters = newFilters;
        if (filtersUpdated) {
            this.updated$.next();
            if (!updatedOnlyDisabledFilters) {
                this.fetch$.next();
            }
        }
    }
    /* Getters */
    getFilters() {
        return lodash_1.default.cloneDeep(this.filters);
    }
    getAppFilters() {
        const { appFilters } = this.getPartitionedFilters();
        return appFilters;
    }
    getGlobalFilters() {
        const { globalFilters } = this.getPartitionedFilters();
        return globalFilters;
    }
    getPartitionedFilters() {
        return FilterManager.partitionFilters(this.getFilters());
    }
    getUpdates$() {
        return this.updated$.asObservable();
    }
    getFetches$() {
        return this.fetch$.asObservable();
    }
    /* Setters */
    addFilters(filters, pinFilterStatus = this.uiSettings.get(common_1.UI_SETTINGS.FILTERS_PINNED_BY_DEFAULT)) {
        if (!Array.isArray(filters)) {
            filters = [filters];
        }
        if (filters.length === 0) {
            return;
        }
        const store = pinFilterStatus ? common_1.FilterStateStore.GLOBAL_STATE : common_1.FilterStateStore.APP_STATE;
        FilterManager.setFiltersStore(filters, store);
        const mappedFilters = map_and_flatten_filters_1.mapAndFlattenFilters(filters);
        // This is where we add new filters to the correct place (app \ global)
        const newPartitionedFilters = FilterManager.partitionFilters(mappedFilters);
        const currentFilters = this.getPartitionedFilters();
        currentFilters.appFilters.push(...newPartitionedFilters.appFilters);
        currentFilters.globalFilters.push(...newPartitionedFilters.globalFilters);
        const newFilters = this.mergeIncomingFilters(currentFilters);
        this.handleStateUpdate(newFilters);
    }
    setFilters(newFilters, pinFilterStatus = this.uiSettings.get(common_1.UI_SETTINGS.FILTERS_PINNED_BY_DEFAULT)) {
        const store = pinFilterStatus ? common_1.FilterStateStore.GLOBAL_STATE : common_1.FilterStateStore.APP_STATE;
        FilterManager.setFiltersStore(newFilters, store);
        const mappedFilters = map_and_flatten_filters_1.mapAndFlattenFilters(newFilters);
        const newPartitionedFilters = FilterManager.partitionFilters(mappedFilters);
        const mergedFilters = this.mergeIncomingFilters(newPartitionedFilters);
        this.handleStateUpdate(mergedFilters);
    }
    /**
     * Sets new global filters and leaves app filters untouched,
     * Removes app filters for which there is a duplicate within new global filters
     * @param newGlobalFilters
     */
    setGlobalFilters(newGlobalFilters) {
        newGlobalFilters = map_and_flatten_filters_1.mapAndFlattenFilters(newGlobalFilters);
        FilterManager.setFiltersStore(newGlobalFilters, common_1.FilterStateStore.GLOBAL_STATE, true);
        const { appFilters } = this.getPartitionedFilters();
        const newFilters = this.mergeIncomingFilters({
            appFilters,
            globalFilters: newGlobalFilters,
        });
        this.handleStateUpdate(newFilters);
    }
    /**
     * Sets new app filters and leaves global filters untouched,
     * Removes app filters for which there is a duplicate within new global filters
     * @param newAppFilters
     */
    setAppFilters(newAppFilters) {
        newAppFilters = map_and_flatten_filters_1.mapAndFlattenFilters(newAppFilters);
        FilterManager.setFiltersStore(newAppFilters, common_1.FilterStateStore.APP_STATE, true);
        const { globalFilters } = this.getPartitionedFilters();
        const newFilters = this.mergeIncomingFilters({
            globalFilters,
            appFilters: newAppFilters,
        });
        this.handleStateUpdate(newFilters);
    }
    removeFilter(filter) {
        const filterIndex = lodash_1.default.findIndex(this.filters, (item) => {
            return lodash_1.default.isEqual(item.meta, filter.meta) && lodash_1.default.isEqual(item.query, filter.query);
        });
        if (filterIndex >= 0) {
            const newFilters = lodash_1.default.cloneDeep(this.filters);
            newFilters.splice(filterIndex, 1);
            this.handleStateUpdate(newFilters);
        }
    }
    removeAll() {
        this.setFilters([]);
    }
    static setFiltersStore(filters, store, shouldOverrideStore = false) {
        lodash_1.default.map(filters, (filter) => {
            // Override status only for filters that didn't have state in the first place.
            // or if shouldOverrideStore is explicitly true
            if (shouldOverrideStore || filter.$state === undefined) {
                filter.$state = { store };
            }
        });
    }
}
exports.FilterManager = FilterManager;
