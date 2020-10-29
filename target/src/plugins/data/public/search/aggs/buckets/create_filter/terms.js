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
exports.createFilterTerms = void 0;
const common_1 = require("../../../../../common");
exports.createFilterTerms = (aggConfig, key, params) => {
    const field = aggConfig.params.field;
    const indexPattern = field.indexPattern;
    if (key === '__other__') {
        const terms = params.terms;
        const phraseFilter = common_1.buildPhrasesFilter(field, terms, indexPattern);
        phraseFilter.meta.negate = true;
        const filters = [phraseFilter];
        if (terms.some((term) => term === '__missing__')) {
            filters.push(common_1.buildExistsFilter(field, indexPattern));
        }
        return filters;
    }
    else if (key === '__missing__') {
        const existsFilter = common_1.buildExistsFilter(field, indexPattern);
        existsFilter.meta.negate = true;
        return existsFilter;
    }
    return common_1.buildPhraseFilter(field, key, indexPattern);
};
