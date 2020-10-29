"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultSort = void 0;
// @ts-ignore
const get_sort_1 = require("./get_sort");
/**
 * use in case the user didn't manually sort.
 * the default sort is returned depending of the index pattern
 */
function getDefaultSort(indexPattern, defaultSortOrder = 'desc') {
    if (indexPattern.timeFieldName && get_sort_1.isSortable(indexPattern.timeFieldName, indexPattern)) {
        return [[indexPattern.timeFieldName, defaultSortOrder]];
    }
    else {
        return [['_score', defaultSortOrder]];
    }
}
exports.getDefaultSort = getDefaultSort;
