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
exports.IndexPatternsApiClient = void 0;
const lib_1 = require("../../../common/index_patterns/lib");
const API_BASE_URL = `/api/index_patterns/`;
class IndexPatternsApiClient {
    constructor(http) {
        this.http = http;
    }
    _request(url, query) {
        return this.http
            .fetch(url, {
            query,
        })
            .catch((resp) => {
            if (resp.body.statusCode === 404 && resp.body.attributes?.code === 'no_matching_indices') {
                throw new lib_1.IndexPatternMissingIndices(resp.body.message);
            }
            throw new Error(resp.body.message || resp.body.error || `${resp.body.statusCode} Response`);
        });
    }
    _getUrl(path) {
        return API_BASE_URL + path.filter(Boolean).map(encodeURIComponent).join('/');
    }
    getFieldsForTimePattern(options = {}) {
        const { pattern, lookBack, metaFields } = options;
        const url = this._getUrl(['_fields_for_time_pattern']);
        return this._request(url, {
            pattern,
            look_back: lookBack,
            meta_fields: metaFields,
        }).then((resp) => resp.fields);
    }
    getFieldsForWildcard(options = {}) {
        const { pattern, metaFields, type, params } = options;
        let url;
        let query;
        if (type) {
            url = this._getUrl([type, '_fields_for_wildcard']);
            query = {
                pattern,
                meta_fields: metaFields,
                params: JSON.stringify(params),
            };
        }
        else {
            url = this._getUrl(['_fields_for_wildcard']);
            query = {
                pattern,
                meta_fields: metaFields,
            };
        }
        return this._request(url, query).then((resp) => resp.fields);
    }
}
exports.IndexPatternsApiClient = IndexPatternsApiClient;
