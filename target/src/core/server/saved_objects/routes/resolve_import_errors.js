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
exports.registerResolveImportErrorsRoute = void 0;
const path_1 = require("path");
const config_schema_1 = require("@kbn/config-schema");
const import_1 = require("../import");
const utils_1 = require("./utils");
exports.registerResolveImportErrorsRoute = (router, config) => {
    const { maxImportExportSize, maxImportPayloadBytes } = config;
    router.post({
        path: '/_resolve_import_errors',
        options: {
            body: {
                maxBytes: maxImportPayloadBytes,
                output: 'stream',
                accepts: 'multipart/form-data',
            },
        },
        validate: {
            body: config_schema_1.schema.object({
                file: config_schema_1.schema.stream(),
                retries: config_schema_1.schema.arrayOf(config_schema_1.schema.object({
                    type: config_schema_1.schema.string(),
                    id: config_schema_1.schema.string(),
                    overwrite: config_schema_1.schema.boolean({ defaultValue: false }),
                    replaceReferences: config_schema_1.schema.arrayOf(config_schema_1.schema.object({
                        type: config_schema_1.schema.string(),
                        from: config_schema_1.schema.string(),
                        to: config_schema_1.schema.string(),
                    }), { defaultValue: [] }),
                })),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const file = req.body.file;
        const fileExtension = path_1.extname(file.hapi.filename).toLowerCase();
        if (fileExtension !== '.ndjson') {
            return res.badRequest({ body: `Invalid file extension ${fileExtension}` });
        }
        const supportedTypes = context.core.savedObjects.typeRegistry
            .getImportableAndExportableTypes()
            .map((type) => type.name);
        const result = await import_1.resolveSavedObjectsImportErrors({
            supportedTypes,
            savedObjectsClient: context.core.savedObjects.client,
            readStream: utils_1.createSavedObjectsStreamFromNdJson(file),
            retries: req.body.retries,
            objectLimit: maxImportExportSize,
        });
        return res.ok({ body: result });
    }));
};
