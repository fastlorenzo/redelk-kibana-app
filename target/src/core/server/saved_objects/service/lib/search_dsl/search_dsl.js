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
exports.getSearchDsl = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const query_params_1 = require("./query_params");
const sorting_params_1 = require("./sorting_params");
function getSearchDsl(mappings, registry, options) {
    const { type, search, defaultSearchOperator, searchFields, sortField, sortOrder, namespaces, hasReference, kueryNode, } = options;
    if (!type) {
        throw boom_1.default.notAcceptable('type must be specified');
    }
    if (sortOrder && !sortField) {
        throw boom_1.default.notAcceptable('sortOrder requires a sortField');
    }
    return {
        ...query_params_1.getQueryParams({
            mappings,
            registry,
            namespaces,
            type,
            search,
            searchFields,
            defaultSearchOperator,
            hasReference,
            kueryNode,
        }),
        ...sorting_params_1.getSortingParams(mappings, type, sortField, sortOrder),
    };
}
exports.getSearchDsl = getSearchDsl;
