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
exports.QueryService = void 0;
const operators_1 = require("rxjs/operators");
const filter_manager_1 = require("./filter_manager");
const lib_1 = require("./lib");
const timefilter_1 = require("./timefilter");
const saved_query_service_1 = require("./saved_query/saved_query_service");
const create_global_query_observable_1 = require("./state_sync/create_global_query_observable");
class QueryService {
    setup({ storage, uiSettings }) {
        this.filterManager = new filter_manager_1.FilterManager(uiSettings);
        const timefilterService = new timefilter_1.TimefilterService();
        this.timefilter = timefilterService.setup({
            uiSettings,
            storage,
        });
        this.state$ = create_global_query_observable_1.createQueryStateObservable({
            filterManager: this.filterManager,
            timefilter: this.timefilter,
        }).pipe(operators_1.share());
        return {
            filterManager: this.filterManager,
            timefilter: this.timefilter,
            state$: this.state$,
        };
    }
    start({ savedObjectsClient, storage, uiSettings }) {
        return {
            addToQueryLog: lib_1.createAddToQueryLog({
                storage,
                uiSettings,
            }),
            filterManager: this.filterManager,
            savedQueries: saved_query_service_1.createSavedQueryService(savedObjectsClient),
            state$: this.state$,
            timefilter: this.timefilter,
        };
    }
    stop() {
        // nothing to do here yet
    }
}
exports.QueryService = QueryService;
