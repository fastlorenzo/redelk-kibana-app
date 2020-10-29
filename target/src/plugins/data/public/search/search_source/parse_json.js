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
exports.parseSearchSourceJSON = void 0;
const public_1 = require("../../../../kibana_utils/public");
exports.parseSearchSourceJSON = (searchSourceJSON) => {
    // if we have a searchSource, set its values based on the searchSourceJson field
    let searchSourceValues;
    try {
        searchSourceValues = JSON.parse(searchSourceJSON);
    }
    catch (e) {
        throw new public_1.InvalidJSONProperty(`Invalid JSON in search source. ${e.message} JSON: ${searchSourceJSON}`);
    }
    // This detects a scenario where documents with invalid JSON properties have been imported into the saved object index.
    // (This happened in issue #20308)
    if (!searchSourceValues || typeof searchSourceValues !== 'object') {
        throw new public_1.InvalidJSONProperty('Invalid JSON in search source.');
    }
    return searchSourceValues;
};
