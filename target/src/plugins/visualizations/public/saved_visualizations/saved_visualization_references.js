"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectReferences = exports.extractReferences = void 0;
const public_1 = require("../../../data/public");
function extractReferences({ attributes, references = [], }) {
    const updatedAttributes = { ...attributes };
    const updatedReferences = [...references];
    if (updatedAttributes.searchSourceFields) {
        const [searchSource, searchSourceReferences] = public_1.extractSearchSourceReferences(updatedAttributes.searchSourceFields);
        updatedAttributes.searchSourceFields = searchSource;
        searchSourceReferences.forEach((r) => updatedReferences.push(r));
    }
    // Extract saved search
    if (updatedAttributes.savedSearchId) {
        updatedReferences.push({
            name: 'search_0',
            type: 'search',
            id: String(updatedAttributes.savedSearchId),
        });
        delete updatedAttributes.savedSearchId;
        updatedAttributes.savedSearchRefName = 'search_0';
    }
    // Extract index patterns from controls
    if (updatedAttributes.visState) {
        const visState = JSON.parse(String(updatedAttributes.visState));
        const controls = (visState.params && visState.params.controls) || [];
        controls.forEach((control, i) => {
            if (!control.indexPattern) {
                return;
            }
            control.indexPatternRefName = `control_${i}_index_pattern`;
            updatedReferences.push({
                name: control.indexPatternRefName,
                type: 'index-pattern',
                id: control.indexPattern,
            });
            delete control.indexPattern;
        });
        updatedAttributes.visState = JSON.stringify(visState);
    }
    return {
        references: updatedReferences,
        attributes: updatedAttributes,
    };
}
exports.extractReferences = extractReferences;
function injectReferences(savedObject, references) {
    if (savedObject.searchSourceFields) {
        savedObject.searchSourceFields = public_1.injectSearchSourceReferences(savedObject.searchSourceFields, references);
    }
    if (savedObject.savedSearchRefName) {
        const savedSearchReference = references.find((reference) => reference.name === savedObject.savedSearchRefName);
        if (!savedSearchReference) {
            throw new Error(`Could not find saved search reference "${savedObject.savedSearchRefName}"`);
        }
        savedObject.savedSearchId = savedSearchReference.id;
        delete savedObject.savedSearchRefName;
    }
    if (savedObject.visState) {
        const controls = (savedObject.visState.params && savedObject.visState.params.controls) || [];
        controls.forEach((control) => {
            if (!control.indexPatternRefName) {
                return;
            }
            const reference = references.find((ref) => ref.name === control.indexPatternRefName);
            if (!reference) {
                throw new Error(`Could not find index pattern reference "${control.indexPatternRefName}"`);
            }
            control.indexPattern = reference.id;
            delete control.indexPatternRefName;
        });
    }
}
exports.injectReferences = injectReferences;
