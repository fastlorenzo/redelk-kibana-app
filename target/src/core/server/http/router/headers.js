"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHeaders = void 0;
const utils_1 = require("../../../utils");
const normalizeHeaderField = (field) => field.trim().toLowerCase();
function filterHeaders(headers, fieldsToKeep, fieldsToExclude = []) {
    const fieldsToExcludeNormalized = fieldsToExclude.map(normalizeHeaderField);
    // Normalize list of headers we want to allow in upstream request
    const fieldsToKeepNormalized = fieldsToKeep
        .map(normalizeHeaderField)
        .filter((name) => !fieldsToExcludeNormalized.includes(name));
    return utils_1.pick(headers, fieldsToKeepNormalized);
}
exports.filterHeaders = filterHeaders;
