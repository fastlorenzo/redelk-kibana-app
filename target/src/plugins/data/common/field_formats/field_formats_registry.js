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
exports.FieldFormatsRegistry = void 0;
// eslint-disable-next-line max-classes-per-file
const lodash_1 = require("lodash");
const types_1 = require("./types");
const base_formatters_1 = require("./constants/base_formatters");
const field_format_1 = require("./field_format");
const __1 = require("../");
class FieldFormatsRegistry {
    constructor() {
        this.fieldFormats = new Map();
        this.defaultMap = {};
        this.metaParamsOptions = {};
        // overriden on the public contract
        this.deserialize = () => {
            return new (field_format_1.FieldFormat.from(lodash_1.identity))();
        };
        /**
         * Get the id of the default type for this field type
         * using the format:defaultTypeMap config map
         *
         * @param  {KBN_FIELD_TYPES} fieldType - the field type
         * @param  {ES_FIELD_TYPES[]} esTypes - Array of ES data types
         * @return {FieldType}
         */
        this.getDefaultConfig = (fieldType, esTypes) => {
            const type = this.getDefaultTypeName(fieldType, esTypes);
            return ((this.defaultMap && this.defaultMap[type]) || { id: types_1.FIELD_FORMAT_IDS.STRING, params: {} });
        };
        /**
         * Get a derived FieldFormat class by its id.
         *
         * @param  {FieldFormatId} formatId - the format id
         * @return {FieldFormatInstanceType | undefined}
         */
        this.getType = (formatId) => {
            const fieldFormat = this.fieldFormats.get(formatId);
            if (fieldFormat) {
                const decoratedFieldFormat = this.fieldFormatMetaParamsDecorator(fieldFormat);
                if (decoratedFieldFormat) {
                    return decoratedFieldFormat;
                }
            }
            return undefined;
        };
        this.getTypeWithoutMetaParams = (formatId) => {
            return this.fieldFormats.get(formatId);
        };
        /**
         * Get the default FieldFormat type (class) for
         * a field type, using the format:defaultTypeMap.
         * used by the field editor
         *
         * @param  {KBN_FIELD_TYPES} fieldType
         * @param  {ES_FIELD_TYPES[]} esTypes - Array of ES data types
         * @return {FieldFormatInstanceType | undefined}
         */
        this.getDefaultType = (fieldType, esTypes) => {
            const config = this.getDefaultConfig(fieldType, esTypes);
            return this.getType(config.id);
        };
        /**
         * Get the name of the default type for ES types like date_nanos
         * using the format:defaultTypeMap config map
         *
         * @param  {ES_FIELD_TYPES[]} esTypes - Array of ES data types
         * @return {ES_FIELD_TYPES | undefined}
         */
        this.getTypeNameByEsTypes = (esTypes) => {
            if (!Array.isArray(esTypes)) {
                return undefined;
            }
            return esTypes.find((type) => this.defaultMap[type] && this.defaultMap[type].es);
        };
        /**
         * Get the default FieldFormat type name for
         * a field type, using the format:defaultTypeMap.
         *
         * @param  {KBN_FIELD_TYPES} fieldType
         * @param  {ES_FIELD_TYPES[]} esTypes
         * @return {ES_FIELD_TYPES | KBN_FIELD_TYPES}
         */
        this.getDefaultTypeName = (fieldType, esTypes) => {
            const esType = this.getTypeNameByEsTypes(esTypes);
            return esType || fieldType;
        };
        /**
         * Get the singleton instance of the FieldFormat type by its id.
         *
         * @param  {FieldFormatId} formatId
         * @return {FieldFormat}
         */
        this.getInstance = lodash_1.memoize((formatId, params = {}) => {
            const ConcreteFieldFormat = this.getType(formatId);
            if (!ConcreteFieldFormat) {
                throw new Error(`Field Format '${formatId}' not found!`);
            }
            return new ConcreteFieldFormat(params, this.getConfig);
        }, (formatId, params) => JSON.stringify({
            formatId,
            ...params,
        }));
        /**
         * Get the default fieldFormat instance for a field format.
         * It's a memoized function that builds and reads a cache
         *
         * @param  {KBN_FIELD_TYPES} fieldType
         * @param  {ES_FIELD_TYPES[]} esTypes
         * @return {FieldFormat}
         */
        this.getDefaultInstance = lodash_1.memoize(this.getDefaultInstancePlain, this.getDefaultInstanceCacheResolver);
        /**
         * FieldFormat decorator - provide a one way to add meta-params for all field formatters
         *
         * @private
         * @param  {FieldFormatInstanceType} fieldFormat - field format type
         * @return {FieldFormatInstanceType | undefined}
         */
        this.fieldFormatMetaParamsDecorator = (fieldFormat) => {
            var _a;
            const getMetaParams = (customParams) => this.buildMetaParams(customParams);
            if (fieldFormat) {
                return _a = class DecoratedFieldFormat extends fieldFormat {
                        constructor(params = {}, getConfig) {
                            super(getMetaParams(params), getConfig);
                        }
                    },
                    _a.id = fieldFormat.id,
                    _a.fieldType = fieldFormat.fieldType,
                    _a;
            }
            return undefined;
        };
        /**
         * Build Meta Params
         *
         * @param  {Record<string, any>} custom params
         * @return {Record<string, any>}
         */
        this.buildMetaParams = (customParams) => ({
            ...this.metaParamsOptions,
            ...customParams,
        });
    }
    init(getConfig, metaParamsOptions = {}, defaultFieldConverters = base_formatters_1.baseFormatters) {
        const defaultTypeMap = getConfig(__1.UI_SETTINGS.FORMAT_DEFAULT_TYPE_MAP);
        this.register(defaultFieldConverters);
        this.parseDefaultTypeMap(defaultTypeMap);
        this.getConfig = getConfig;
        this.metaParamsOptions = metaParamsOptions;
    }
    /**
     * Get the default fieldFormat instance for a field format.
     *
     * @param  {KBN_FIELD_TYPES} fieldType
     * @param  {ES_FIELD_TYPES[]} esTypes
     * @return {FieldFormat}
     */
    getDefaultInstancePlain(fieldType, esTypes, params = {}) {
        const conf = this.getDefaultConfig(fieldType, esTypes);
        const instanceParams = {
            ...conf.params,
            ...params,
        };
        return this.getInstance(conf.id, instanceParams);
    }
    /**
     * Returns a cache key built by the given variables for caching in memoized
     * Where esType contains fieldType, fieldType is returned
     * -> kibana types have a higher priority in that case
     * -> would lead to failing tests that match e.g. date format with/without esTypes
     * https://lodash.com/docs#memoize
     *
     * @param  {KBN_FIELD_TYPES} fieldType
     * @param  {ES_FIELD_TYPES[]} esTypes
     * @return {String}
     */
    getDefaultInstanceCacheResolver(fieldType, esTypes) {
        // @ts-ignore
        return Array.isArray(esTypes) && esTypes.indexOf(fieldType) === -1
            ? [fieldType, ...esTypes].join('-')
            : fieldType;
    }
    /**
     * Get filtered list of field formats by format type
     *
     * @param  {KBN_FIELD_TYPES} fieldType
     * @return {FieldFormatInstanceType[]}
     */
    getByFieldType(fieldType) {
        return [...this.fieldFormats.values()]
            .filter((format) => format && format.fieldType.indexOf(fieldType) !== -1)
            .map((format) => this.fieldFormatMetaParamsDecorator(format));
    }
    parseDefaultTypeMap(value) {
        this.defaultMap = value;
        lodash_1.forOwn(this, (fn) => {
            if (lodash_1.isFunction(fn) && fn.cache) {
                // clear all memoize caches
                // @ts-ignore
                fn.cache = new lodash_1.memoize.Cache();
            }
        });
    }
    register(fieldFormats) {
        fieldFormats.forEach((fieldFormat) => this.fieldFormats.set(fieldFormat.id, fieldFormat));
    }
}
exports.FieldFormatsRegistry = FieldFormatsRegistry;
