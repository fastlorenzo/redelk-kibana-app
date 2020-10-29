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
exports.createKbnFieldTypes = void 0;
const kbn_field_type_1 = require("./kbn_field_type");
const types_1 = require("./types");
exports.createKbnFieldTypes = () => [
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.STRING,
        sortable: true,
        filterable: true,
        esTypes: [
            types_1.ES_FIELD_TYPES.STRING,
            types_1.ES_FIELD_TYPES.TEXT,
            types_1.ES_FIELD_TYPES.KEYWORD,
            types_1.ES_FIELD_TYPES._TYPE,
            types_1.ES_FIELD_TYPES._ID,
        ],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.NUMBER,
        sortable: true,
        filterable: true,
        esTypes: [
            types_1.ES_FIELD_TYPES.FLOAT,
            types_1.ES_FIELD_TYPES.HALF_FLOAT,
            types_1.ES_FIELD_TYPES.SCALED_FLOAT,
            types_1.ES_FIELD_TYPES.DOUBLE,
            types_1.ES_FIELD_TYPES.INTEGER,
            types_1.ES_FIELD_TYPES.LONG,
            types_1.ES_FIELD_TYPES.SHORT,
            types_1.ES_FIELD_TYPES.BYTE,
            types_1.ES_FIELD_TYPES.TOKEN_COUNT,
        ],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.DATE,
        sortable: true,
        filterable: true,
        esTypes: [types_1.ES_FIELD_TYPES.DATE, types_1.ES_FIELD_TYPES.DATE_NANOS],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.IP,
        sortable: true,
        filterable: true,
        esTypes: [types_1.ES_FIELD_TYPES.IP],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.BOOLEAN,
        sortable: true,
        filterable: true,
        esTypes: [types_1.ES_FIELD_TYPES.BOOLEAN],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.OBJECT,
        esTypes: [types_1.ES_FIELD_TYPES.OBJECT],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.NESTED,
        esTypes: [types_1.ES_FIELD_TYPES.NESTED],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.GEO_POINT,
        esTypes: [types_1.ES_FIELD_TYPES.GEO_POINT],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.GEO_SHAPE,
        esTypes: [types_1.ES_FIELD_TYPES.GEO_SHAPE],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.ATTACHMENT,
        esTypes: [types_1.ES_FIELD_TYPES.ATTACHMENT],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.MURMUR3,
        esTypes: [types_1.ES_FIELD_TYPES.MURMUR3],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES._SOURCE,
        esTypes: [types_1.ES_FIELD_TYPES._SOURCE],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.HISTOGRAM,
        filterable: true,
        esTypes: [types_1.ES_FIELD_TYPES.HISTOGRAM],
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.CONFLICT,
    }),
    new kbn_field_type_1.KbnFieldType({
        name: types_1.KBN_FIELD_TYPES.UNKNOWN,
    }),
];
