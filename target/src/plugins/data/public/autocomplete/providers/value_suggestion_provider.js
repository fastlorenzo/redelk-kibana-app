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
exports.setupValueSuggestionProvider = exports.getEmptyValueSuggestions = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../../../common");
function resolver(title, field, query, boolFilter) {
    // Only cache results for a minute
    const ttl = Math.floor(Date.now() / 1000 / 60);
    return [ttl, query, title, field.name, JSON.stringify(boolFilter)].join('|');
}
exports.getEmptyValueSuggestions = (() => Promise.resolve([]));
exports.setupValueSuggestionProvider = (core) => {
    const requestSuggestions = lodash_1.memoize((index, field, query, boolFilter = [], signal) => core.http.fetch(`/api/kibana/suggestions/values/${index}`, {
        method: 'POST',
        body: JSON.stringify({ query, field: field.name, boolFilter }),
        signal,
    }), resolver);
    return async ({ indexPattern, field, query, boolFilter, signal, }) => {
        const shouldSuggestValues = core.uiSettings.get(common_1.UI_SETTINGS.FILTERS_EDITOR_SUGGEST_VALUES);
        const { title } = indexPattern;
        if (field.type === 'boolean') {
            return [true, false];
        }
        else if (!shouldSuggestValues || !field.aggregatable || field.type !== 'string') {
            return [];
        }
        return await requestSuggestions(title, field, query, boolFilter, signal);
    };
};
