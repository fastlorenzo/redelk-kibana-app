"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisplayedColumns = exports.getTimeColumn = void 0;
const helpers_1 = require("../../../../helpers");
/**
 * Returns properties necessary to display the time column
 * If it's an IndexPattern with timefield, the time column is
 * prepended, not moveable and removeable
 * @param timeFieldName
 */
function getTimeColumn(timeFieldName) {
    return {
        name: timeFieldName,
        displayName: 'Time',
        isSortable: true,
        isRemoveable: false,
        colLeftIdx: -1,
        colRightIdx: -1,
    };
}
exports.getTimeColumn = getTimeColumn;
/**
 * A given array of column names returns an array of properties
 * necessary to display the columns. If the given indexPattern
 * has a timefield, a time column is prepended
 * @param columns
 * @param indexPattern
 * @param hideTimeField
 * @param isShortDots
 */
function getDisplayedColumns(columns, indexPattern, hideTimeField, isShortDots) {
    if (!Array.isArray(columns) || typeof indexPattern !== 'object' || !indexPattern.getFieldByName) {
        return [];
    }
    const columnProps = columns.map((column, idx) => {
        const field = indexPattern.getFieldByName(column);
        return {
            name: column,
            displayName: isShortDots ? helpers_1.shortenDottedString(column) : column,
            isSortable: field && field.sortable ? true : false,
            isRemoveable: column !== '_source' || columns.length > 1,
            colLeftIdx: idx - 1 < 0 ? -1 : idx - 1,
            colRightIdx: idx + 1 >= columns.length ? -1 : idx + 1,
        };
    });
    return !hideTimeField && indexPattern.timeFieldName
        ? [getTimeColumn(indexPattern.timeFieldName), ...columnProps]
        : columnProps;
}
exports.getDisplayedColumns = getDisplayedColumns;
