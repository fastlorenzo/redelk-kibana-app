"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaConversion = void 0;
exports.MetaConversion = {
    pattern: /%meta/g,
    convert(record) {
        return record.meta ? `${JSON.stringify(record.meta)}` : '';
    },
};
