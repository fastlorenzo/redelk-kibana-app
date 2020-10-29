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
exports.registerRoutes = void 0;
const config_schema_1 = require("@kbn/config-schema");
const fetcher_1 = require("./fetcher");
function registerRoutes(http) {
    const parseMetaFields = (metaFields) => {
        let parsedFields = [];
        if (typeof metaFields === 'string') {
            parsedFields = JSON.parse(metaFields);
        }
        else {
            parsedFields = metaFields;
        }
        return parsedFields;
    };
    const router = http.createRouter();
    router.get({
        path: '/api/index_patterns/_fields_for_wildcard',
        validate: {
            query: config_schema_1.schema.object({
                pattern: config_schema_1.schema.string(),
                meta_fields: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())], {
                    defaultValue: [],
                }),
            }),
        },
    }, async (context, request, response) => {
        const { callAsCurrentUser } = context.core.elasticsearch.legacy.client;
        const indexPatterns = new fetcher_1.IndexPatternsFetcher(callAsCurrentUser);
        const { pattern, meta_fields: metaFields } = request.query;
        let parsedFields = [];
        try {
            parsedFields = parseMetaFields(metaFields);
        }
        catch (error) {
            return response.badRequest();
        }
        try {
            const fields = await indexPatterns.getFieldsForWildcard({
                pattern,
                metaFields: parsedFields,
            });
            return response.ok({
                body: { fields },
                headers: {
                    'content-type': 'application/json',
                },
            });
        }
        catch (error) {
            if (typeof error === 'object' &&
                !!error?.isBoom &&
                !!error?.output?.payload &&
                typeof error?.output?.payload === 'object') {
                const payload = error?.output?.payload;
                return response.notFound({
                    body: {
                        message: payload.message,
                        attributes: payload,
                    },
                });
            }
            else {
                return response.notFound();
            }
        }
    });
    router.get({
        path: '/api/index_patterns/_fields_for_time_pattern',
        validate: {
            query: config_schema_1.schema.object({
                pattern: config_schema_1.schema.string(),
                interval: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                look_back: config_schema_1.schema.number({ min: 1 }),
                meta_fields: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())], {
                    defaultValue: [],
                }),
            }),
        },
    }, async (context, request, response) => {
        const { callAsCurrentUser } = context.core.elasticsearch.legacy.client;
        const indexPatterns = new fetcher_1.IndexPatternsFetcher(callAsCurrentUser);
        const { pattern, interval, look_back: lookBack, meta_fields: metaFields } = request.query;
        let parsedFields = [];
        try {
            parsedFields = parseMetaFields(metaFields);
        }
        catch (error) {
            return response.badRequest();
        }
        try {
            const fields = await indexPatterns.getFieldsForTimePattern({
                pattern,
                interval: interval ? interval : '',
                lookBack,
                metaFields: parsedFields,
            });
            return response.ok({
                body: { fields },
                headers: {
                    'content-type': 'application/json',
                },
            });
        }
        catch (error) {
            return response.notFound();
        }
    });
}
exports.registerRoutes = registerRoutes;
