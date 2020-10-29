"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateIndexPattern = void 0;
/**
 * After creation or fetching from ES, ensure that the searchSources index indexPattern
 * is an bonafide IndexPattern object.
 *
 * @return {Promise<IndexPattern | null>}
 */
async function hydrateIndexPattern(id, savedObject, indexPatterns, config) {
    const indexPattern = config.indexPattern;
    if (!savedObject.searchSource) {
        return null;
    }
    const index = id || indexPattern || savedObject.searchSource.getOwnField('index');
    if (typeof index !== 'string' || !index) {
        return null;
    }
    const indexObj = await indexPatterns.get(index);
    savedObject.searchSource.setField('index', indexObj);
    return indexObj;
}
exports.hydrateIndexPattern = hydrateIndexPattern;
