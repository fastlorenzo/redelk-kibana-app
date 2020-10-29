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
exports.convertEsError = exports.isNoMatchingIndicesError = exports.createNoMatchingIndicesError = exports.isEsIndexNotFoundError = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = require("lodash");
const ERR_ES_INDEX_NOT_FOUND = 'index_not_found_exception';
const ERR_NO_MATCHING_INDICES = 'no_matching_indices';
/**
 *  Determines if an error is an elasticsearch error that's
 *  describing a failure caused by missing index/indices
 *  @param  {Any}  err
 *  @return {Boolean}
 */
function isEsIndexNotFoundError(err) {
    return lodash_1.get(err, ['body', 'error', 'type']) === ERR_ES_INDEX_NOT_FOUND;
}
exports.isEsIndexNotFoundError = isEsIndexNotFoundError;
/**
 *  Creates an error that informs that no indices match the given pattern.
 *
 *  @param  {String} pattern the pattern which indexes were supposed to match
 *  @return {Boom}
 */
function createNoMatchingIndicesError(pattern) {
    const err = boom_1.default.notFound(`No indices match pattern "${pattern}"`);
    err.output.payload.code = ERR_NO_MATCHING_INDICES;
    return err;
}
exports.createNoMatchingIndicesError = createNoMatchingIndicesError;
/**
 *  Determines if an error is produced by `createNoMatchingIndicesError()`
 *
 *  @param  {Any} err
 *  @return {Boolean}
 */
function isNoMatchingIndicesError(err) {
    return lodash_1.get(err, ['output', 'payload', 'code']) === ERR_NO_MATCHING_INDICES;
}
exports.isNoMatchingIndicesError = isNoMatchingIndicesError;
/**
 *  Wrap "index_not_found_exception" errors in custom Boom errors
 *  automatically
 *  @param  {Array<String>|String} indices
 *  @return {Boom}
 */
function convertEsError(indices, error) {
    if (isEsIndexNotFoundError(error)) {
        return createNoMatchingIndicesError(indices);
    }
    if (error.isBoom) {
        return error;
    }
    const statusCode = error.statusCode;
    const message = error.body ? error.body.error : undefined;
    return boom_1.default.boomify(error, { statusCode, message });
}
exports.convertEsError = convertEsError;
