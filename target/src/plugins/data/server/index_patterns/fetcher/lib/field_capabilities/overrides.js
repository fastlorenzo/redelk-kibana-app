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
exports.mergeOverrides = void 0;
const lodash_1 = require("lodash");
const OVERRIDES = {
    _source: { type: '_source' },
    _index: { type: 'string' },
    _type: { type: 'string' },
    _id: { type: 'string' },
    _timestamp: {
        type: 'date',
        searchable: true,
        aggregatable: true,
    },
    _score: {
        type: 'number',
        searchable: false,
        aggregatable: false,
    },
};
/**
 *  Merge overrides for specific metaFields
 *
 *  @param  {FieldDescriptor} field
 *  @return {FieldDescriptor}
 */
function mergeOverrides(field) {
    if (OVERRIDES.hasOwnProperty(field.name)) {
        return lodash_1.merge(field, OVERRIDES[field.name]);
    }
    else {
        return field;
    }
}
exports.mergeOverrides = mergeOverrides;
