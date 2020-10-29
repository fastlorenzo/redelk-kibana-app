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
exports.removeQueryParam = void 0;
const query_string_1 = require("query-string");
const common_1 = require("../../common");
function removeQueryParam(history, param, replace = true) {
    const oldLocation = history.location;
    const search = (oldLocation.search || '').replace(/^\?/, '');
    const query = query_string_1.parse(search, { sort: false });
    delete query[param];
    const newSearch = query_string_1.stringify(common_1.url.encodeQuery(query), { sort: false, encode: false });
    const newLocation = {
        ...oldLocation,
        search: newSearch,
    };
    if (replace) {
        history.replace(newLocation);
    }
    else {
        history.push(newLocation);
    }
}
exports.removeQueryParam = removeQueryParam;
