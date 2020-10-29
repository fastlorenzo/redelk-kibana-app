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
exports.KBN_FIELD_TYPES = exports.ES_FIELD_TYPES = void 0;
/** @public **/
var ES_FIELD_TYPES;
(function (ES_FIELD_TYPES) {
    ES_FIELD_TYPES["_ID"] = "_id";
    ES_FIELD_TYPES["_INDEX"] = "_index";
    ES_FIELD_TYPES["_SOURCE"] = "_source";
    ES_FIELD_TYPES["_TYPE"] = "_type";
    ES_FIELD_TYPES["STRING"] = "string";
    ES_FIELD_TYPES["TEXT"] = "text";
    ES_FIELD_TYPES["KEYWORD"] = "keyword";
    ES_FIELD_TYPES["BOOLEAN"] = "boolean";
    ES_FIELD_TYPES["OBJECT"] = "object";
    ES_FIELD_TYPES["DATE"] = "date";
    ES_FIELD_TYPES["DATE_NANOS"] = "date_nanos";
    ES_FIELD_TYPES["GEO_POINT"] = "geo_point";
    ES_FIELD_TYPES["GEO_SHAPE"] = "geo_shape";
    ES_FIELD_TYPES["FLOAT"] = "float";
    ES_FIELD_TYPES["HALF_FLOAT"] = "half_float";
    ES_FIELD_TYPES["SCALED_FLOAT"] = "scaled_float";
    ES_FIELD_TYPES["DOUBLE"] = "double";
    ES_FIELD_TYPES["INTEGER"] = "integer";
    ES_FIELD_TYPES["LONG"] = "long";
    ES_FIELD_TYPES["SHORT"] = "short";
    ES_FIELD_TYPES["NESTED"] = "nested";
    ES_FIELD_TYPES["BYTE"] = "byte";
    ES_FIELD_TYPES["IP"] = "ip";
    ES_FIELD_TYPES["ATTACHMENT"] = "attachment";
    ES_FIELD_TYPES["TOKEN_COUNT"] = "token_count";
    ES_FIELD_TYPES["MURMUR3"] = "murmur3";
    ES_FIELD_TYPES["HISTOGRAM"] = "histogram";
})(ES_FIELD_TYPES = exports.ES_FIELD_TYPES || (exports.ES_FIELD_TYPES = {}));
/** @public **/
var KBN_FIELD_TYPES;
(function (KBN_FIELD_TYPES) {
    KBN_FIELD_TYPES["_SOURCE"] = "_source";
    KBN_FIELD_TYPES["ATTACHMENT"] = "attachment";
    KBN_FIELD_TYPES["BOOLEAN"] = "boolean";
    KBN_FIELD_TYPES["DATE"] = "date";
    KBN_FIELD_TYPES["GEO_POINT"] = "geo_point";
    KBN_FIELD_TYPES["GEO_SHAPE"] = "geo_shape";
    KBN_FIELD_TYPES["IP"] = "ip";
    KBN_FIELD_TYPES["MURMUR3"] = "murmur3";
    KBN_FIELD_TYPES["NUMBER"] = "number";
    KBN_FIELD_TYPES["STRING"] = "string";
    KBN_FIELD_TYPES["UNKNOWN"] = "unknown";
    KBN_FIELD_TYPES["CONFLICT"] = "conflict";
    KBN_FIELD_TYPES["OBJECT"] = "object";
    KBN_FIELD_TYPES["NESTED"] = "nested";
    KBN_FIELD_TYPES["HISTOGRAM"] = "histogram";
})(KBN_FIELD_TYPES = exports.KBN_FIELD_TYPES || (exports.KBN_FIELD_TYPES = {}));
