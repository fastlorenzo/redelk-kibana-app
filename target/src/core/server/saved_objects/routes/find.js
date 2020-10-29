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
exports.registerFindRoute = void 0;
const config_schema_1 = require("@kbn/config-schema");
exports.registerFindRoute = (router) => {
    router.get({
        path: '/_find',
        validate: {
            query: config_schema_1.schema.object({
                per_page: config_schema_1.schema.number({ min: 0, defaultValue: 20 }),
                page: config_schema_1.schema.number({ min: 0, defaultValue: 1 }),
                type: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())]),
                search: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                default_search_operator: config_schema_1.schema.oneOf([config_schema_1.schema.literal('OR'), config_schema_1.schema.literal('AND')], {
                    defaultValue: 'OR',
                }),
                search_fields: config_schema_1.schema.maybe(config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())])),
                sort_field: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                has_reference: config_schema_1.schema.maybe(config_schema_1.schema.object({
                    type: config_schema_1.schema.string(),
                    id: config_schema_1.schema.string(),
                })),
                fields: config_schema_1.schema.maybe(config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())])),
                filter: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                namespaces: config_schema_1.schema.maybe(config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())])),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const query = req.query;
        const namespaces = typeof req.query.namespaces === 'string' ? [req.query.namespaces] : req.query.namespaces;
        const result = await context.core.savedObjects.client.find({
            perPage: query.per_page,
            page: query.page,
            type: Array.isArray(query.type) ? query.type : [query.type],
            search: query.search,
            defaultSearchOperator: query.default_search_operator,
            searchFields: typeof query.search_fields === 'string' ? [query.search_fields] : query.search_fields,
            sortField: query.sort_field,
            hasReference: query.has_reference,
            fields: typeof query.fields === 'string' ? [query.fields] : query.fields,
            filter: query.filter,
            namespaces,
        });
        return res.ok({ body: result });
    }));
};
