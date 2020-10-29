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
exports.expandShorthand = void 0;
const lodash_1 = require("lodash");
// import from ./common/types to prevent circular dependency of kibana_utils <-> data plugin
const types_1 = require("../../../data/common/types");
/** @public */
exports.expandShorthand = (sh) => {
    return lodash_1.mapValues(sh, (val) => {
        const fieldMap = lodash_1.isString(val) ? { type: val } : val;
        const json = {
            type: types_1.ES_FIELD_TYPES.TEXT,
            _serialize(v) {
                if (v)
                    return JSON.stringify(v);
            },
            _deserialize(v) {
                if (v)
                    return JSON.parse(v);
            },
        };
        return fieldMap.type === 'json' ? json : fieldMap;
    });
};
