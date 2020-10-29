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
exports.getSortingParams = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const mappings_1 = require("../../../mappings");
const TOP_LEVEL_FIELDS = ['_id', '_score'];
function getSortingParams(mappings, type, sortField, sortOrder) {
    if (!sortField) {
        return {};
    }
    const types = Array.isArray(type) ? type : [type];
    if (TOP_LEVEL_FIELDS.includes(sortField)) {
        return {
            sort: [
                {
                    [sortField]: {
                        order: sortOrder,
                    },
                },
            ],
        };
    }
    if (types.length > 1) {
        const rootField = mappings_1.getProperty(mappings, sortField);
        if (!rootField) {
            throw boom_1.default.badRequest(`Unable to sort multiple types by field ${sortField}, not a root property`);
        }
        return {
            sort: [
                {
                    [sortField]: {
                        order: sortOrder,
                        unmapped_type: rootField.type,
                    },
                },
            ],
        };
    }
    const [typeField] = types;
    const key = `${typeField}.${sortField}`;
    const field = mappings_1.getProperty(mappings, key);
    if (!field) {
        throw boom_1.default.badRequest(`Unknown sort field ${sortField}`);
    }
    return {
        sort: [
            {
                [key]: {
                    order: sortOrder,
                    unmapped_type: field.type,
                },
            },
        ],
    };
}
exports.getSortingParams = getSortingParams;
