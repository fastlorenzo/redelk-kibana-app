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
exports.getFieldCapabilities = void 0;
const lodash_1 = require("lodash");
const es_api_1 = require("../es_api");
const field_caps_response_1 = require("./field_caps_response");
const overrides_1 = require("./overrides");
/**
 *  Get the field capabilities for field in `indices`, excluding
 *  all internal/underscore-prefixed fields that are not in `metaFields`
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array}  [indices=[]]  the list of indexes to check
 *  @param  {Array}  [metaFields=[]] the list of internal fields to include
 *  @return {Promise<Array<FieldDescriptor>>}
 */
async function getFieldCapabilities(callCluster, indices = [], metaFields = []) {
    const esFieldCaps = await es_api_1.callFieldCapsApi(callCluster, indices);
    const fieldsFromFieldCapsByName = lodash_1.keyBy(field_caps_response_1.readFieldCapsResponse(esFieldCaps), 'name');
    const allFieldsUnsorted = Object.keys(fieldsFromFieldCapsByName)
        .filter((name) => !name.startsWith('_'))
        .concat(metaFields)
        .reduce((agg, value) => {
        // This is intentionally using a "hash" and a "push" to be highly optimized with very large indexes
        if (agg.hash[value] != null) {
            return agg;
        }
        else {
            agg.hash[value] = value;
            agg.names.push(value);
            return agg;
        }
    }, { names: [], hash: {} })
        .names.map((name) => lodash_1.defaults({}, fieldsFromFieldCapsByName[name], {
        name,
        type: 'string',
        searchable: false,
        aggregatable: false,
        readFromDocValues: false,
    }))
        .map(overrides_1.mergeOverrides);
    return lodash_1.sortBy(allFieldsUnsorted, 'name');
}
exports.getFieldCapabilities = getFieldCapabilities;
