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
exports.replaceUrlHashQuery = void 0;
const url_1 = require("url");
const query_string_1 = require("query-string");
const parse_1 = require("./parse");
const common_1 = require("../../../common");
function replaceUrlHashQuery(rawUrl, queryReplacer) {
    const url = parse_1.parseUrl(rawUrl);
    const hash = parse_1.parseUrlHash(rawUrl);
    const newQuery = queryReplacer(hash?.query || {});
    const searchQueryString = query_string_1.stringify(common_1.url.encodeQuery(newQuery), {
        sort: false,
        encode: false,
    });
    if ((!hash || !hash.search) && !searchQueryString)
        return rawUrl; // nothing to change. return original url
    return url_1.format({
        ...url,
        hash: url_1.format({
            pathname: hash?.pathname || '',
            search: searchQueryString,
        }),
    });
}
exports.replaceUrlHashQuery = replaceUrlHashQuery;
