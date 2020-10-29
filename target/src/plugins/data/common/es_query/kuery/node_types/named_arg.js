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
exports.toElasticsearchQuery = exports.buildNode = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const ast = tslib_1.__importStar(require("../ast"));
const node_types_1 = require("../node_types");
function buildNode(name, value) {
    const argumentNode = lodash_1.default.get(value, 'type') === 'literal' ? value : node_types_1.nodeTypes.literal.buildNode(value);
    return {
        type: 'namedArg',
        name,
        value: argumentNode,
    };
}
exports.buildNode = buildNode;
function toElasticsearchQuery(node) {
    return ast.toElasticsearchQuery(node.value);
}
exports.toElasticsearchQuery = toElasticsearchQuery;
