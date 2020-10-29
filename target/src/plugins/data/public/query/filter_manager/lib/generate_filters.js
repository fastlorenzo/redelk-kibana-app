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
exports.generateFilters = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const common_1 = require("../../../../common");
function getExistingFilter(appFilters, fieldName, value) {
    // TODO: On array fields, negating does not negate the combination, rather all terms
    return lodash_1.default.find(appFilters, function (filter) {
        if (!filter)
            return;
        if (fieldName === '_exists_' && common_1.isExistsFilter(filter)) {
            return filter.exists.field === value;
        }
        if (common_1.isPhraseFilter(filter)) {
            return common_1.getPhraseFilterField(filter) === fieldName && common_1.getPhraseFilterValue(filter) === value;
        }
        if (common_1.isScriptedPhraseFilter(filter)) {
            return filter.meta.field === fieldName && filter.script.script.params.value === value;
        }
    });
}
function updateExistingFilter(existingFilter, negate) {
    existingFilter.meta.disabled = false;
    if (existingFilter.meta.negate !== negate) {
        existingFilter.meta.negate = !existingFilter.meta.negate;
    }
}
/**
 * Generate filter objects, as a result of triggering a filter action on a
 * specific index pattern field.
 *
 * @param {FilterManager} filterManager - The active filter manager to lookup for existing filters
 * @param {Field | string} field - The field for which filters should be generated
 * @param {any} values - One or more values to filter for.
 * @param {string} operation - "-" to create a negated filter
 * @param {string} index - Index string to generate filters for
 *
 * @returns {object} An array of filters to be added back to filterManager
 */
function generateFilters(filterManager, field, values, operation, index) {
    values = Array.isArray(values) ? values : [values];
    const fieldObj = (lodash_1.default.isObject(field)
        ? field
        : {
            name: field,
        });
    const fieldName = fieldObj.name;
    const newFilters = [];
    const appFilters = filterManager.getAppFilters();
    const negate = operation === '-';
    let filter;
    lodash_1.default.each(values, function (value) {
        const existing = getExistingFilter(appFilters, fieldName, value);
        if (existing) {
            updateExistingFilter(existing, negate);
            filter = existing;
        }
        else {
            const tmpIndexPattern = { id: index };
            // exists filter special case:  fieldname = '_exists' and value = fieldname
            const filterType = fieldName === '_exists_' ? common_1.FILTERS.EXISTS : common_1.FILTERS.PHRASE;
            const actualFieldObj = fieldName === '_exists_' ? { name: value } : fieldObj;
            // Fix for #7189 - if value is empty, phrase filters become exists filters.
            const isNullFilter = value === null || value === undefined;
            filter = common_1.buildFilter(tmpIndexPattern, actualFieldObj, isNullFilter ? common_1.FILTERS.EXISTS : filterType, isNullFilter ? !negate : negate, false, value, null, common_1.FilterStateStore.APP_STATE);
        }
        newFilters.push(filter);
    });
    return newFilters;
}
exports.generateFilters = generateFilters;
