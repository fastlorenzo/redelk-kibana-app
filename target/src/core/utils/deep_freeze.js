"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepFreeze = void 0;
/**
 * Apply Object.freeze to a value recursively and convert the return type to
 * Readonly variant recursively
 *
 * @public
 */
function deepFreeze(object) {
    // for any properties that reference an object, makes sure that object is
    // recursively frozen as well
    for (const value of Object.values(object)) {
        if (value !== null && typeof value === 'object') {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}
exports.deepFreeze = deepFreeze;
