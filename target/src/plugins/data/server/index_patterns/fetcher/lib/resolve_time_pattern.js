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
exports.resolveTimePattern = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const time_pattern_to_wildcard_1 = require("./time_pattern_to_wildcard");
const es_api_1 = require("./es_api");
/**
 *  Convert a time pattern into a list of indexes it could
 *  have matched and ones it did match.
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {String} timePattern
 *  @return {Promise<Object>} object that lists the indices that match based
 *                            on a wildcard version of the time pattern (all)
 *                            and the indices that actually match the time
 *                            pattern (matches);
 */
async function resolveTimePattern(callCluster, timePattern) {
    const aliases = await es_api_1.callIndexAliasApi(callCluster, time_pattern_to_wildcard_1.timePatternToWildcard(timePattern));
    const allIndexDetails = lodash_1.chain(aliases)
        .reduce((acc, index, indexName) => acc.concat(indexName, Object.keys(index.aliases || {})), [])
        .sortBy((indexName) => indexName)
        .sortedUniq()
        .map((indexName) => {
        const parsed = moment_1.default(indexName, timePattern, true);
        if (!parsed.isValid()) {
            return {
                valid: false,
                indexName,
                order: indexName,
                isMatch: false,
            };
        }
        return {
            valid: true,
            indexName,
            order: parsed,
            isMatch: indexName === parsed.format(timePattern),
        };
    })
        .orderBy(['valid', 'order'], ['desc', 'desc'])
        .value();
    return {
        all: allIndexDetails.map((details) => details.indexName),
        matches: allIndexDetails
            .filter((details) => details.isMatch)
            .map((details) => details.indexName),
    };
}
exports.resolveTimePattern = resolveTimePattern;
