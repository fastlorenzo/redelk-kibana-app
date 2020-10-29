"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visTypeAliasRegistry = void 0;
const registry = [];
exports.visTypeAliasRegistry = {
    get: () => [...registry],
    add: (newVisTypeAlias) => {
        if (registry.find((visTypeAlias) => visTypeAlias.name === newVisTypeAlias.name)) {
            throw new Error(`${newVisTypeAlias.name} already registered`);
        }
        registry.push(newVisTypeAlias);
    },
};
