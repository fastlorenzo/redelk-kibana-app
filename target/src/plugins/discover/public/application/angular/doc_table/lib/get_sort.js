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
exports.getSortArray = exports.getSort = exports.isSortable = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
function isSortable(fieldName, indexPattern) {
    const field = indexPattern.getFieldByName(fieldName);
    return field && field.sortable;
}
exports.isSortable = isSortable;
function createSortObject(sortPair, indexPattern) {
    if (Array.isArray(sortPair) &&
        sortPair.length === 2 &&
        isSortable(String(sortPair[0]), indexPattern)) {
        const [field, direction] = sortPair;
        return { [field]: direction };
    }
    else if (lodash_1.default.isPlainObject(sortPair) && isSortable(Object.keys(sortPair)[0], indexPattern)) {
        return sortPair;
    }
}
/**
 * Take a sorting array and make it into an object
 * @param {array} sort two dimensional array [[fieldToSort, directionToSort]]
 *  or an array of objects [{fieldToSort: directionToSort}]
 * @param {object} indexPattern used for determining default sort
 * @returns Array<{object}> an array of sort objects
 */
function getSort(sort, indexPattern) {
    if (Array.isArray(sort)) {
        return sort
            .map((sortPair) => createSortObject(sortPair, indexPattern))
            .filter((sortPairObj) => typeof sortPairObj === 'object');
    }
    return [];
}
exports.getSort = getSort;
/**
 * compared to getSort it doesn't return an array of objects, it returns an array of arrays
 * [[fieldToSort: directionToSort]]
 */
function getSortArray(sort, indexPattern) {
    return getSort(sort, indexPattern).map((sortPair) => Object.entries(sortPair).pop());
}
exports.getSortArray = getSortArray;
