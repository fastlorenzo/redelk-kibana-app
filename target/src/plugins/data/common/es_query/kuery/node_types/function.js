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
exports.toElasticsearchQuery = exports.buildNodeWithArgumentNodes = exports.buildNode = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const functions_1 = require("../functions");
function buildNode(functionName, ...args) {
    const kueryFunction = functions_1.functions[functionName];
    if (lodash_1.default.isUndefined(kueryFunction)) {
        throw new Error(`Unknown function "${functionName}"`);
    }
    return {
        type: 'function',
        function: functionName,
        // This requires better typing of the different typings and their return types.
        // @ts-ignore
        ...kueryFunction.buildNodeParams(...args),
    };
}
exports.buildNode = buildNode;
// Mainly only useful in the grammar where we'll already have real argument nodes in hand
function buildNodeWithArgumentNodes(functionName, args) {
    if (lodash_1.default.isUndefined(functions_1.functions[functionName])) {
        throw new Error(`Unknown function "${functionName}"`);
    }
    return {
        type: 'function',
        function: functionName,
        arguments: args,
    };
}
exports.buildNodeWithArgumentNodes = buildNodeWithArgumentNodes;
function toElasticsearchQuery(node, indexPattern, config, context) {
    const kueryFunction = functions_1.functions[node.function];
    return kueryFunction.toElasticsearchQuery(node, indexPattern, config, context);
}
exports.toElasticsearchQuery = toElasticsearchQuery;
