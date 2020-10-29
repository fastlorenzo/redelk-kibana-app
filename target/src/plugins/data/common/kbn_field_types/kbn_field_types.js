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
exports.getFilterableKbnTypeNames = exports.castEsToKbnFieldTypeName = exports.getKbnTypeNames = exports.getKbnFieldType = void 0;
const kbn_field_types_factory_1 = require("./kbn_field_types_factory");
const types_1 = require("./types");
/** @private */
const registeredKbnTypes = kbn_field_types_factory_1.createKbnFieldTypes();
/**
 *  Get a type object by name
 *
 *  @param  {string} typeName
 *  @return {KbnFieldType}
 */
exports.getKbnFieldType = (typeName) => registeredKbnTypes.find((t) => t.name === typeName);
/**
 *  Get the esTypes known by all kbnFieldTypes
 *
 *  @return {Array<string>}
 */
exports.getKbnTypeNames = () => registeredKbnTypes.filter((type) => type.name).map((type) => type.name);
/**
 *  Get the KbnFieldType name for an esType string
 *
 *  @param {string} esType
 *  @return {string}
 */
exports.castEsToKbnFieldTypeName = (esType) => {
    const type = registeredKbnTypes.find((t) => t.esTypes.includes(esType));
    return type && type.name ? type.name : types_1.KBN_FIELD_TYPES.UNKNOWN;
};
/**
 *  Get filterable KbnFieldTypes
 *
 *  @return {Array<string>}
 */
exports.getFilterableKbnTypeNames = () => registeredKbnTypes.filter((type) => type.filterable).map((type) => type.name);
