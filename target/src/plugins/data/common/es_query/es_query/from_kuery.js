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
exports.buildQueryFromKuery = void 0;
const kuery_1 = require("../kuery");
function buildQueryFromKuery(indexPattern, queries = [], allowLeadingWildcards = false, dateFormatTZ) {
    const queryASTs = queries.map((query) => {
        return kuery_1.fromKueryExpression(query.query, { allowLeadingWildcards });
    });
    return buildQuery(indexPattern, queryASTs, { dateFormatTZ });
}
exports.buildQueryFromKuery = buildQueryFromKuery;
function buildQuery(indexPattern, queryASTs, config = {}) {
    const compoundQueryAST = kuery_1.nodeTypes.function.buildNode('and', queryASTs);
    const kueryQuery = kuery_1.toElasticsearchQuery(compoundQueryAST, indexPattern, config);
    return Object.assign({
        must: [],
        filter: [],
        should: [],
        must_not: [],
    }, kueryQuery.bool);
}
