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
exports.registerCreateRoute = void 0;
const config_schema_1 = require("@kbn/config-schema");
exports.registerCreateRoute = (router) => {
    router.post({
        path: '/{type}/{id?}',
        validate: {
            params: config_schema_1.schema.object({
                type: config_schema_1.schema.string(),
                id: config_schema_1.schema.maybe(config_schema_1.schema.string()),
            }),
            query: config_schema_1.schema.object({
                overwrite: config_schema_1.schema.boolean({ defaultValue: false }),
            }),
            body: config_schema_1.schema.object({
                attributes: config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.any()),
                migrationVersion: config_schema_1.schema.maybe(config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.string())),
                references: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({
                    name: config_schema_1.schema.string(),
                    type: config_schema_1.schema.string(),
                    id: config_schema_1.schema.string(),
                }))),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const { type, id } = req.params;
        const { overwrite } = req.query;
        const { attributes, migrationVersion, references } = req.body;
        const options = { id, overwrite, migrationVersion, references };
        const result = await context.core.savedObjects.client.create(type, attributes, options);
        return res.ok({ body: result });
    }));
};
