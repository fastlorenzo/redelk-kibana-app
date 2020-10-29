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
exports.FieldFormat = void 0;
const lodash_1 = require("lodash");
const custom_1 = require("./converters/custom");
const content_types_1 = require("./content_types");
const DEFAULT_CONTEXT_TYPE = content_types_1.TEXT_CONTEXT_TYPE;
class FieldFormat {
    constructor(_params = {}, getConfig) {
        /**
         * @property {Function} - ref to child class
         * @private
         */
        this.type = this.constructor;
        this._params = _params;
        if (getConfig) {
            this.getConfig = getConfig;
        }
    }
    /**
     * Convert a raw value to a formatted string
     * @param  {any} value
     * @param  {string} [contentType=text] - optional content type, the only two contentTypes
     *                                currently supported are "html" and "text", which helps
     *                                formatters adjust to different contexts
     * @return {string} - the formatted string, which is assumed to be html, safe for
     *                    injecting into the DOM or a DOM attribute
     * @public
     */
    convert(value, contentType = DEFAULT_CONTEXT_TYPE, options) {
        const converter = this.getConverterFor(contentType);
        if (converter) {
            return converter.call(this, value, options);
        }
        return value;
    }
    /**
     * Get a convert function that is bound to a specific contentType
     * @param  {string} [contentType=text]
     * @return {function} - a bound converter function
     * @public
     */
    getConverterFor(contentType = DEFAULT_CONTEXT_TYPE) {
        if (!this.convertObject) {
            this.convertObject = this.setupContentType();
        }
        return this.convertObject[contentType];
    }
    /**
     * Get parameter defaults
     * @return {object} - parameter defaults
     * @public
     */
    getParamDefaults() {
        return {};
    }
    /**
     * Get the value of a param. This value may be a default value.
     *
     * @param  {string} name - the param name to fetch
     * @return {any}
     * @public
     */
    param(name) {
        const val = lodash_1.get(this._params, name);
        if (val || val === false || val === 0) {
            // truthy, false, or 0 are fine
            // '', NaN, null, undefined, etc are not
            return val;
        }
        return lodash_1.get(this.getParamDefaults(), name);
    }
    /**
     * Get all of the params in a single object
     * @return {object}
     * @public
     */
    params() {
        return lodash_1.cloneDeep(lodash_1.defaults({}, this._params, this.getParamDefaults()));
    }
    /**
     * Serialize this format to a simple POJO, with only the params
     * that are not default
     *
     * @return {object}
     * @public
     */
    toJSON() {
        const id = lodash_1.get(this.type, 'id');
        const defaultsParams = this.getParamDefaults() || {};
        const params = lodash_1.transform(this._params, (uniqParams, val, param) => {
            if (param && val !== lodash_1.get(defaultsParams, param)) {
                uniqParams[param] = val;
            }
        }, {});
        return {
            id,
            params: lodash_1.size(params) ? params : undefined,
        };
    }
    static from(convertFn) {
        return custom_1.createCustomFieldFormat(convertFn);
    }
    setupContentType() {
        return {
            text: content_types_1.textContentTypeSetup(this, this.textConvert),
            html: content_types_1.htmlContentTypeSetup(this, this.htmlConvert),
        };
    }
    static isInstanceOfFieldFormat(fieldFormat) {
        return Boolean(fieldFormat && fieldFormat.convert);
    }
}
exports.FieldFormat = FieldFormat;
