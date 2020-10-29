"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMappingChain = void 0;
const noop = () => {
    throw new Error('No mappings have been found for filter.');
};
exports.generateMappingChain = (fn, next = noop) => {
    return (filter) => {
        try {
            return fn(filter);
        }
        catch (result) {
            if (result === filter) {
                return next(filter);
            }
            throw result;
        }
    };
};
