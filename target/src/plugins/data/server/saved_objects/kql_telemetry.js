"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kqlTelemetry = void 0;
exports.kqlTelemetry = {
    name: 'kql-telemetry',
    namespaceType: 'agnostic',
    hidden: false,
    mappings: {
        properties: {
            optInCount: {
                type: 'long',
            },
            optOutCount: {
                type: 'long',
            },
        },
    },
};
