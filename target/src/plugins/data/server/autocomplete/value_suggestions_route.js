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
exports.registerValueSuggestionsRoute = void 0;
const lodash_1 = require("lodash");
const config_schema_1 = require("@kbn/config-schema");
const operators_1 = require("rxjs/operators");
const index_patterns_1 = require("../index_patterns");
const lib_1 = require("../lib");
function registerValueSuggestionsRoute(router, config$) {
    router.post({
        path: '/api/kibana/suggestions/values/{index}',
        validate: {
            params: config_schema_1.schema.object({
                index: config_schema_1.schema.string(),
            }, { unknowns: 'allow' }),
            body: config_schema_1.schema.object({
                field: config_schema_1.schema.string(),
                query: config_schema_1.schema.string(),
                boolFilter: config_schema_1.schema.maybe(config_schema_1.schema.any()),
            }, { unknowns: 'allow' }),
        },
    }, async (context, request, response) => {
        const config = await config$.pipe(operators_1.first()).toPromise();
        const { field: fieldName, query, boolFilter } = request.body;
        const { index } = request.params;
        const { client } = context.core.elasticsearch.legacy;
        const signal = lib_1.getRequestAbortedSignal(request.events.aborted$);
        const autocompleteSearchOptions = {
            timeout: `${config.kibana.autocompleteTimeout.asMilliseconds()}ms`,
            terminate_after: config.kibana.autocompleteTerminateAfter.asMilliseconds(),
        };
        const indexPattern = await index_patterns_1.findIndexPatternById(context.core.savedObjects.client, index);
        const field = indexPattern && index_patterns_1.getFieldByName(fieldName, indexPattern);
        const body = await getBody(autocompleteSearchOptions, field || fieldName, query, boolFilter);
        try {
            const result = await client.callAsCurrentUser('search', { index, body }, { signal });
            const buckets = lodash_1.get(result, 'aggregations.suggestions.buckets') ||
                lodash_1.get(result, 'aggregations.nestedSuggestions.suggestions.buckets');
            return response.ok({ body: lodash_1.map(buckets || [], 'key') });
        }
        catch (error) {
            return response.internalError({ body: error });
        }
    });
}
exports.registerValueSuggestionsRoute = registerValueSuggestionsRoute;
async function getBody({ timeout, terminate_after }, field, query, boolFilter = []) {
    const isFieldObject = (f) => Boolean(f && f.name);
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#_standard_operators
    const getEscapedQuery = (q = '') => q.replace(/[.?+*|{}[\]()"\\#@&<>~]/g, (match) => `\\${match}`);
    // Helps ensure that the regex is not evaluated eagerly against the terms dictionary
    const executionHint = 'map';
    // We don't care about the accuracy of the counts, just the content of the terms, so this reduces
    // the amount of information that needs to be transmitted to the coordinating node
    const shardSize = 10;
    const body = {
        size: 0,
        timeout,
        terminate_after,
        query: {
            bool: {
                filter: boolFilter,
            },
        },
        aggs: {
            suggestions: {
                terms: {
                    field: isFieldObject(field) ? field.name : field,
                    include: `${getEscapedQuery(query)}.*`,
                    execution_hint: executionHint,
                    shard_size: shardSize,
                },
            },
        },
    };
    if (isFieldObject(field) && field.subType && field.subType.nested) {
        return {
            ...body,
            aggs: {
                nestedSuggestions: {
                    nested: {
                        path: field.subType.nested.path,
                    },
                    aggs: body.aggs,
                },
            },
        };
    }
    return body;
}
