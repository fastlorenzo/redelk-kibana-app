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
exports.toElasticsearchQuery = exports.doesKueryExpressionHaveLuceneSyntaxError = exports.fromKueryExpression = exports.fromLiteralExpression = void 0;
const index_1 = require("../node_types/index");
const kuery_syntax_error_1 = require("../kuery_syntax_error");
// @ts-ignore
const kuery_1 = require("./_generated_/kuery");
const fromExpression = (expression, parseOptions = {}, parse = kuery_1.parse) => {
    if (typeof expression === 'undefined') {
        throw new Error('expression must be a string, got undefined instead');
    }
    return parse(expression, { ...parseOptions, helpers: { nodeTypes: index_1.nodeTypes } });
};
exports.fromLiteralExpression = (expression, parseOptions = {}) => {
    return fromExpression(expression, {
        ...parseOptions,
        startRule: 'Literal',
    }, kuery_1.parse);
};
exports.fromKueryExpression = (expression, parseOptions = {}) => {
    try {
        return fromExpression(expression, parseOptions, kuery_1.parse);
    }
    catch (error) {
        if (error.name === 'SyntaxError') {
            throw new kuery_syntax_error_1.KQLSyntaxError(error, expression);
        }
        else {
            throw error;
        }
    }
};
exports.doesKueryExpressionHaveLuceneSyntaxError = (expression) => {
    try {
        fromExpression(expression, { errorOnLuceneSyntax: true }, kuery_1.parse);
        return false;
    }
    catch (e) {
        return e.message.startsWith('Lucene');
    }
};
/**
 * @params {String} indexPattern
 * @params {Object} config - contains the dateFormatTZ
 *
 * IndexPattern isn't required, but if you pass one in, we can be more intelligent
 * about how we craft the queries (e.g. scripted fields)
 */
exports.toElasticsearchQuery = (node, indexPattern, config, context) => {
    if (!node || !node.type || !index_1.nodeTypes[node.type]) {
        return exports.toElasticsearchQuery(index_1.nodeTypes.function.buildNode('and', []), indexPattern);
    }
    const nodeType = index_1.nodeTypes[node.type];
    return nodeType.toElasticsearchQuery(node, indexPattern, config, context);
};
