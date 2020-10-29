"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFromLucene = void 0;
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
const decorate_query_1 = require("./decorate_query");
const lucene_string_to_dsl_1 = require("./lucene_string_to_dsl");
function buildQueryFromLucene(queries, queryStringOptions, dateFormatTZ) {
    const combinedQueries = (queries || []).map((query) => {
        const queryDsl = lucene_string_to_dsl_1.luceneStringToDsl(query.query);
        return decorate_query_1.decorateQuery(queryDsl, queryStringOptions, dateFormatTZ);
    });
    return {
        must: combinedQueries,
        filter: [],
        should: [],
        must_not: [],
    };
}
exports.buildQueryFromLucene = buildQueryFromLucene;
