"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupFields = void 0;
const field_filter_1 = require("./field_filter");
/**
 * group the fields into selected, popular and unpopular, filter by fieldFilterState
 */
function groupFields(fields, columns, popularLimit, fieldCounts, fieldFilterState) {
    const result = {
        selected: [],
        popular: [],
        unpopular: [],
    };
    if (!Array.isArray(fields) || !Array.isArray(columns) || typeof fieldCounts !== 'object') {
        return result;
    }
    const popular = fields
        .filter((field) => !columns.includes(field.name) && field.count)
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .map((field) => field.name)
        .slice(0, popularLimit);
    const compareFn = (a, b) => {
        if (!a.displayName) {
            return 0;
        }
        return a.displayName.localeCompare(b.displayName || '');
    };
    const fieldsSorted = fields.sort(compareFn);
    for (const field of fieldsSorted) {
        if (!field_filter_1.isFieldFiltered(field, fieldFilterState, fieldCounts)) {
            continue;
        }
        if (columns.includes(field.name)) {
            result.selected.push(field);
        }
        else if (popular.includes(field.name) && field.type !== '_source') {
            result.popular.push(field);
        }
        else if (field.type !== '_source') {
            result.unpopular.push(field);
        }
    }
    return result;
}
exports.groupFields = groupFields;
