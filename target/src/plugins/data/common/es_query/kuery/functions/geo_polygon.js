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
const node_types_1 = require("../node_types");
const ast = tslib_1.__importStar(require("../ast"));
function buildNodeParams(fieldName, points) {
    const fieldNameArg = node_types_1.nodeTypes.literal.buildNode(fieldName);
    const args = points.map((point) => {
        const latLon = `${point.lat}, ${point.lon}`;
        return node_types_1.nodeTypes.literal.buildNode(latLon);
    });
    return {
        arguments: [fieldNameArg, ...args],
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
    const [fieldNameArg, ...points] = node.arguments;
    const fullFieldNameArg = {
        ...fieldNameArg,
        value: context?.nested ? `${context.nested.path}.${fieldNameArg.value}` : fieldNameArg.value,
    };
    const fieldName = node_types_1.nodeTypes.literal.toElasticsearchQuery(fullFieldNameArg);
    const fieldList = indexPattern?.fields ?? [];
    const field = fieldList.find((fld) => fld.name === fieldName);
    const queryParams = {
        points: points.map((point) => {
            return ast.toElasticsearchQuery(point, indexPattern, config, context);
        }),
    };
    if (field?.scripted) {
        throw new Error(`Geo polygon query does not support scripted fields`);
    }
    return {
        geo_polygon: {
            [fieldName]: queryParams,
            ignore_unmapped: true,
        },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
