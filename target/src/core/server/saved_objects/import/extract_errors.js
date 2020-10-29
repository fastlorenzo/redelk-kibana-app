"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractErrors = void 0;
function extractErrors(
// TODO: define saved object type
savedObjectResults, savedObjectsToImport) {
    const errors = [];
    const originalSavedObjectsMap = new Map();
    for (const savedObject of savedObjectsToImport) {
        originalSavedObjectsMap.set(`${savedObject.type}:${savedObject.id}`, savedObject);
    }
    for (const savedObject of savedObjectResults) {
        if (savedObject.error) {
            const originalSavedObject = originalSavedObjectsMap.get(`${savedObject.type}:${savedObject.id}`);
            const title = originalSavedObject &&
                originalSavedObject.attributes &&
                originalSavedObject.attributes.title;
            if (savedObject.error.statusCode === 409) {
                errors.push({
                    id: savedObject.id,
                    type: savedObject.type,
                    title,
                    error: {
                        type: 'conflict',
                    },
                });
                continue;
            }
            errors.push({
                id: savedObject.id,
                type: savedObject.type,
                title,
                error: {
                    ...savedObject.error,
                    type: 'unknown',
                },
            });
        }
    }
    return errors;
}
exports.extractErrors = extractErrors;
