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
exports.registerBulkCreateRoute = void 0;
const config_schema_1 = require("@kbn/config-schema");
exports.registerBulkCreateRoute = (router) => {
    router.post({
        path: '/_bulk_create',
        validate: {
            query: config_schema_1.schema.object({
                overwrite: config_schema_1.schema.boolean({ defaultValue: false }),
            }),
            body: config_schema_1.schema.arrayOf(config_schema_1.schema.object({
                type: config_schema_1.schema.string(),
                id: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                attributes: config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.any()),
                version: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                migrationVersion: config_schema_1.schema.maybe(config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.string())),
                references: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({
                    name: config_schema_1.schema.string(),
                    type: config_schema_1.schema.string(),
                    id: config_schema_1.schema.string(),
                }))),
            })),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const { overwrite } = req.query;
        const result = await context.core.savedObjects.client.bulkCreate(req.body, { overwrite });
        return res.ok({ body: result });
    }));
};
