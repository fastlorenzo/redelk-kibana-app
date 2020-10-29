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
exports.toElasticsearchQuery = exports.buildNodeParams = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const literal = tslib_1.__importStar(require("../node_types/literal"));
function buildNodeParams(fieldName) {
    return {
        arguments: [literal.buildNode(fieldName)],
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
    const { arguments: [fieldNameArg], } = node;
    const fullFieldNameArg = {
        ...fieldNameArg,
        value: context?.nested ? `${context.nested.path}.${fieldNameArg.value}` : fieldNameArg.value,
    };
    const fieldName = literal.toElasticsearchQuery(fullFieldNameArg);
    const field = lodash_1.get(indexPattern, 'fields', []).find((fld) => fld.name === fieldName);
    if (field && field.scripted) {
        throw new Error(`Exists query does not support scripted fields`);
    }
    return {
        exists: { field: fieldName },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
