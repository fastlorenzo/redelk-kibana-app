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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const node_types_1 = require("../node_types");
const ast = tslib_1.__importStar(require("../ast"));
const filters_1 = require("../../filters");
const get_fields_1 = require("./utils/get_fields");
const utils_1 = require("../../utils");
const get_full_field_name_node_1 = require("./utils/get_full_field_name_node");
function buildNodeParams(fieldName, params) {
    const paramsToMap = lodash_1.default.pick(params, 'gt', 'lt', 'gte', 'lte', 'format');
    const fieldNameArg = typeof fieldName === 'string'
        ? ast.fromLiteralExpression(fieldName)
        : node_types_1.nodeTypes.literal.buildNode(fieldName);
    const args = lodash_1.default.map(paramsToMap, (value, key) => {
        return node_types_1.nodeTypes.namedArg.buildNode(key, value);
    });
    return {
        arguments: [fieldNameArg, ...args],
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
    const [fieldNameArg, ...args] = node.arguments;
    const fullFieldNameArg = get_full_field_name_node_1.getFullFieldNameNode(fieldNameArg, indexPattern, context?.nested ? context.nested.path : undefined);
    const fields = indexPattern ? get_fields_1.getFields(fullFieldNameArg, indexPattern) : [];
    const namedArgs = extractArguments(args);
    const queryParams = lodash_1.default.mapValues(namedArgs, (arg) => {
        return ast.toElasticsearchQuery(arg);
    });
    // If no fields are found in the index pattern we send through the given field name as-is. We do this to preserve
    // the behaviour of lucene on dashboards where there are panels based on different index patterns that have different
    // fields. If a user queries on a field that exists in one pattern but not the other, the index pattern without the
    // field should return no results. It's debatable whether this is desirable, but it's been that way forever, so we'll
    // keep things familiar for now.
    if (fields && fields.length === 0) {
        fields.push({
            name: ast.toElasticsearchQuery(fullFieldNameArg),
            scripted: false,
            type: '',
        });
    }
    const queries = fields.map((field) => {
        const wrapWithNestedQuery = (query) => {
            // Wildcards can easily include nested and non-nested fields. There isn't a good way to let
            // users handle this themselves so we automatically add nested queries in this scenario.
            if (!(fullFieldNameArg.type === 'wildcard') ||
                !lodash_1.default.get(field, 'subType.nested') ||
                context.nested) {
                return query;
            }
            else {
                return {
                    nested: {
                        path: field.subType.nested.path,
                        query,
                        score_mode: 'none',
                    },
                };
            }
        };
        if (field.scripted) {
            return {
                script: filters_1.getRangeScript(field, queryParams),
            };
        }
        else if (field.type === 'date') {
            const timeZoneParam = config.dateFormatTZ
                ? { time_zone: utils_1.getTimeZoneFromSettings(config.dateFormatTZ) }
                : {};
            return wrapWithNestedQuery({
                range: {
                    [field.name]: {
                        ...queryParams,
                        ...timeZoneParam,
                    },
                },
            });
        }
        return wrapWithNestedQuery({
            range: {
                [field.name]: queryParams,
            },
        });
    });
    return {
        bool: {
            should: queries,
            minimum_should_match: 1,
        },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function extractArguments(args) {
    if ((args.gt && args.gte) || (args.lt && args.lte)) {
        throw new Error('range ends cannot be both inclusive and exclusive');
    }
    const unnamedArgOrder = ['gte', 'lte', 'format'];
    return args.reduce((acc, arg, index) => {
        if (arg.type === 'namedArg') {
            acc[arg.name] = arg.value;
        }
        else {
            acc[unnamedArgOrder[index]] = arg;
        }
        return acc;
    }, {});
}
