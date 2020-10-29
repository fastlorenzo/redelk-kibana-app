"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortForSearchSource = void 0;
const get_sort_1 = require("./get_sort");
const get_default_sort_1 = require("./get_default_sort");
/**
 * Prepares sort for search source, that's sending the request to ES
 * - Adds default sort if necessary
 * - Handles the special case when there's sorting by date_nanos typed fields
 *   the addon of the numeric_type guarantees the right sort order
 *   when there are indices with date and indices with date_nanos field
 */
function getSortForSearchSource(sort, indexPattern, defaultDirection = 'desc') {
    if (!sort || !indexPattern) {
        return [];
    }
    else if (Array.isArray(sort) && sort.length === 0) {
        sort = get_default_sort_1.getDefaultSort(indexPattern, defaultDirection);
    }
    const { timeFieldName } = indexPattern;
    return get_sort_1.getSort(sort, indexPattern).map((sortPair) => {
        if (indexPattern.isTimeNanosBased() && timeFieldName && sortPair[timeFieldName]) {
            return {
                [timeFieldName]: {
                    order: sortPair[timeFieldName],
                    numeric_type: 'date_nanos',
                },
            };
        }
        return sortPair;
    });
}
exports.getSortForSearchSource = getSortForSearchSource;
