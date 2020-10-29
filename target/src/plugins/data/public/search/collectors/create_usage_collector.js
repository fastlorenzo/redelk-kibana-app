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
exports.createUsageCollector = void 0;
const operators_1 = require("rxjs/operators");
const public_1 = require("../../../../usage_collection/public");
const types_1 = require("./types");
exports.createUsageCollector = (core, usageCollection) => {
    const getCurrentApp = async () => {
        const [{ application }] = await core.getStartServices();
        return application.currentAppId$.pipe(operators_1.first()).toPromise();
    };
    return {
        trackQueryTimedOut: async () => {
            const currentApp = await getCurrentApp();
            return usageCollection?.reportUiStats(currentApp, public_1.METRIC_TYPE.LOADED, types_1.SEARCH_EVENT_TYPE.QUERY_TIMED_OUT);
        },
        trackQueriesCancelled: async () => {
            const currentApp = await getCurrentApp();
            return usageCollection?.reportUiStats(currentApp, public_1.METRIC_TYPE.LOADED, types_1.SEARCH_EVENT_TYPE.QUERIES_CANCELLED);
        },
        trackLongQueryPopupShown: async () => {
            const currentApp = await getCurrentApp();
            return usageCollection?.reportUiStats(currentApp, public_1.METRIC_TYPE.LOADED, types_1.SEARCH_EVENT_TYPE.LONG_QUERY_POPUP_SHOWN);
        },
        trackLongQueryDialogDismissed: async () => {
            const currentApp = await getCurrentApp();
            return usageCollection?.reportUiStats(currentApp, public_1.METRIC_TYPE.CLICK, types_1.SEARCH_EVENT_TYPE.LONG_QUERY_DIALOG_DISMISSED);
        },
        trackLongQueryRunBeyondTimeout: async () => {
            const currentApp = await getCurrentApp();
            return usageCollection?.reportUiStats(currentApp, public_1.METRIC_TYPE.CLICK, types_1.SEARCH_EVENT_TYPE.LONG_QUERY_RUN_BEYOND_TIMEOUT);
        },
    };
};
