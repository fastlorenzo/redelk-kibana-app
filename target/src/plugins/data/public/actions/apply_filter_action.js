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
exports.createFilterAction = exports.ACTION_GLOBAL_APPLY_FILTER = void 0;
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../kibana_react/public");
const public_2 = require("../../../ui_actions/public");
const services_1 = require("../services");
const apply_filters_1 = require("../ui/apply_filters");
const __1 = require("..");
exports.ACTION_GLOBAL_APPLY_FILTER = 'ACTION_GLOBAL_APPLY_FILTER';
async function isCompatible(context) {
    return context.filters !== undefined;
}
function createFilterAction(filterManager, timeFilter) {
    return public_2.createAction({
        type: exports.ACTION_GLOBAL_APPLY_FILTER,
        id: exports.ACTION_GLOBAL_APPLY_FILTER,
        getIconType: () => 'filter',
        getDisplayName: () => {
            return i18n_1.i18n.translate('data.filter.applyFilterActionTitle', {
                defaultMessage: 'Apply filter to current view',
            });
        },
        isCompatible,
        execute: async ({ filters, timeFieldName }) => {
            if (!filters) {
                throw new Error('Applying a filter requires a filter');
            }
            if (!(await isCompatible({ filters }))) {
                throw new public_2.IncompatibleActionError();
            }
            let selectedFilters = filters;
            if (selectedFilters.length > 1) {
                const indexPatterns = await Promise.all(filters.map((filter) => {
                    return services_1.getIndexPatterns().get(filter.meta.index);
                }));
                const filterSelectionPromise = new Promise((resolve) => {
                    const overlay = services_1.getOverlays().openModal(public_1.toMountPoint(apply_filters_1.applyFiltersPopover(filters, indexPatterns, () => {
                        overlay.close();
                        resolve([]);
                    }, (filterSelection) => {
                        overlay.close();
                        resolve(filterSelection);
                    })), {
                        'data-test-subj': 'test',
                    });
                });
                selectedFilters = await filterSelectionPromise;
            }
            if (timeFieldName) {
                const { timeRangeFilter, restOfFilters } = __1.esFilters.extractTimeFilter(timeFieldName, selectedFilters);
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
exports.createFilterAction = createFilterAction;
