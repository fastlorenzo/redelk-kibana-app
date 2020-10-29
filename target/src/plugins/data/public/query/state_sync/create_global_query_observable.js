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
exports.createQueryStateObservable = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const public_1 = require("../../../../kibana_utils/public");
const common_1 = require("../../../common");
function createQueryStateObservable({ timefilter: { timefilter }, filterManager, }) {
    return new rxjs_1.Observable((subscriber) => {
        const state = public_1.createStateContainer({
            time: timefilter.getTime(),
            refreshInterval: timefilter.getRefreshInterval(),
            filters: filterManager.getFilters(),
        });
        let currentChange = {};
        const subs = [
            timefilter.getTimeUpdate$().subscribe(() => {
                currentChange.time = true;
                state.set({ ...state.get(), time: timefilter.getTime() });
            }),
            timefilter.getRefreshIntervalUpdate$().subscribe(() => {
                currentChange.refreshInterval = true;
                state.set({ ...state.get(), refreshInterval: timefilter.getRefreshInterval() });
            }),
            filterManager.getUpdates$().subscribe(() => {
                currentChange.filters = true;
                const { filters } = state.get();
                const globalOld = filters?.filter((f) => common_1.isFilterPinned(f));
                const appOld = filters?.filter((f) => !common_1.isFilterPinned(f));
                const globalNew = filterManager.getGlobalFilters();
                const appNew = filterManager.getAppFilters();
                if (!globalOld || !common_1.compareFilters(globalOld, globalNew, common_1.COMPARE_ALL_OPTIONS)) {
                    currentChange.globalFilters = true;
                }
                if (!appOld || !common_1.compareFilters(appOld, appNew, common_1.COMPARE_ALL_OPTIONS)) {
                    currentChange.appFilters = true;
                }
                state.set({
                    ...state.get(),
                    filters: filterManager.getFilters(),
                });
            }),
            state.state$
                .pipe(operators_1.map((newState) => ({ state: newState, changes: currentChange })), operators_1.tap(() => {
                currentChange = {};
            }))
                .subscribe(subscriber),
        ];
        return () => {
            subs.forEach((s) => s.unsubscribe());
        };
    });
}
exports.createQueryStateObservable = createQueryStateObservable;
