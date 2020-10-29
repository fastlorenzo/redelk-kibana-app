"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExportRoute = void 0;
const tslib_1 = require("tslib");
const config_schema_1 = require("@kbn/config-schema");
const json_stable_stringify_1 = tslib_1.__importDefault(require("json-stable-stringify"));
const streams_1 = require("../../../../legacy/utils/streams");
const export_1 = require("../export");
const utils_1 = require("./utils");
exports.registerExportRoute = (router, config) => {
    const { maxImportExportSize } = config;
    router.post({
        path: '/_export',
        validate: {
            body: config_schema_1.schema.object({
                type: config_schema_1.schema.maybe(config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())])),
                objects: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({
                    type: config_schema_1.schema.string(),
                    id: config_schema_1.schema.string(),
                }), { maxSize: maxImportExportSize })),
                search: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                includeReferencesDeep: config_schema_1.schema.boolean({ defaultValue: false }),
                excludeExportDetails: config_schema_1.schema.boolean({ defaultValue: false }),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const savedObjectsClient = context.core.savedObjects.client;
        const { type, objects, search, excludeExportDetails, includeReferencesDeep } = req.body;
        const types = typeof type === 'string' ? [type] : type;
        // need to access the registry for type validation, can't use the schema for this
        const supportedTypes = context.core.savedObjects.typeRegistry
            .getImportableAndExportableTypes()
            .map((t) => t.name);
        if (types) {
            const validationError = utils_1.validateTypes(types, supportedTypes);
            if (validationError) {
                return res.badRequest({
                    body: {
                        message: validationError,
                    },
                });
            }
        }
        if (objects) {
            const validationError = utils_1.validateObjects(objects, supportedTypes);
            if (validationError) {
                return res.badRequest({
                    body: {
                        message: validationError,
                    },
                });
            }
        }
        const exportStream = await export_1.exportSavedObjectsToStream({
            savedObjectsClient,
            types,
            search,
            objects,
            exportSizeLimit: maxImportExportSize,
            includeReferencesDeep,
            excludeExportDetails,
        });
        const docsToExport = await streams_1.createPromiseFromStreams([
            exportStream,
            streams_1.createMapStream((obj) => {
                return json_stable_stringify_1.default(obj);
            }),
            streams_1.createConcatStream([]),
        ]);
        return res.ok({
            body: docsToExport.join('\n'),
            headers: {
                'Content-Disposition': `attachment; filename="export.ndjson"`,
                'Content-Type': 'application/ndjson',
            },
        });
    }));
};
