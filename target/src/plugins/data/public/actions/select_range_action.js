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
exports.selectRangeAction = exports.ACTION_SELECT_RANGE = void 0;
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../plugins/ui_actions/public");
const create_filters_from_range_select_1 = require("./filters/create_filters_from_range_select");
const __1 = require("..");
exports.ACTION_SELECT_RANGE = 'ACTION_SELECT_RANGE';
async function isCompatible(context) {
    try {
        return Boolean(await create_filters_from_range_select_1.createFiltersFromRangeSelectAction(context.data));
    }
    catch {
        return false;
    }
}
function selectRangeAction(filterManager, timeFilter) {
    return public_1.createAction({
        type: exports.ACTION_SELECT_RANGE,
        id: exports.ACTION_SELECT_RANGE,
        getIconType: () => 'filter',
        getDisplayName: () => {
            return i18n_1.i18n.translate('data.filter.applyFilterActionTitle', {
                defaultMessage: 'Apply filter to current view',
            });
        },
        isCompatible,
        execute: async ({ data }) => {
            if (!(await isCompatible({ data }))) {
                throw new public_1.IncompatibleActionError();
            }
            const selectedFilters = await create_filters_from_range_select_1.createFiltersFromRangeSelectAction(data);
            if (data.timeFieldName) {
                const { timeRangeFilter, restOfFilters } = __1.esFilters.extractTimeFilter(data.timeFieldName, selectedFilters);
                filterManager.addFilters(restOfFilters);
                if (timeRangeFilter) {
                    __1.esFilters.changeTimeFilter(timeFilter, timeRangeFilter);
                }
            }
            else {
                filterManager.addFilters(selectedFilters);
            }
        },
    });
}
exports.selectRangeAction = selectRangeAction;
