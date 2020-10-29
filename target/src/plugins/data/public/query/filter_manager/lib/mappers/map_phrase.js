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
exports.mapPhrase = exports.isMapPhraseFilter = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../../../../../common");
const getScriptedPhraseValue = (filter) => lodash_1.get(filter, ['script', 'script', 'params', 'value']);
const getFormattedValueFn = (value) => {
    return (formatter) => {
        return formatter ? formatter.convert(value) : value;
    };
};
const getParams = (filter) => {
    const scriptedPhraseValue = getScriptedPhraseValue(filter);
    const isScriptedFilter = Boolean(scriptedPhraseValue);
    const key = isScriptedFilter ? filter.meta.field || '' : common_1.getPhraseFilterField(filter);
    const query = scriptedPhraseValue || common_1.getPhraseFilterValue(filter);
    const params = { query };
    return {
        key,
        params,
        type: common_1.FILTERS.PHRASE,
        value: getFormattedValueFn(query),
    };
};
exports.isMapPhraseFilter = (filter) => common_1.isPhraseFilter(filter) || common_1.isScriptedPhraseFilter(filter);
exports.mapPhrase = (filter) => {
    if (!exports.isMapPhraseFilter(filter)) {
        throw filter;
    }
    return getParams(filter);
};
