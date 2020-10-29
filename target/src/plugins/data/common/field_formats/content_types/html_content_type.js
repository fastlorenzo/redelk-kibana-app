"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.HTML_CONTEXT_TYPE = void 0;
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
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
exports.HTML_CONTEXT_TYPE = 'html';
const getConvertFn = (format, convert) => {
    const fallbackHtml = (value, options = {}) => {
        const { field, hit } = options;
        const formatted = lodash_1.escape(format.convert(value, 'text'));
        return !field || !hit || !hit.highlight || !hit.highlight[field.name]
            ? formatted
            : utils_1.getHighlightHtml(formatted, hit.highlight[field.name]);
    };
    return (convert || fallbackHtml);
};
exports.setup = (format, htmlContextTypeConvert) => {
    const convert = getConvertFn(format, htmlContextTypeConvert);
    const recurse = (value, options = {}) => {
        if (value == null) {
            return utils_1.asPrettyString(value);
        }
        if (!value || !lodash_1.isFunction(value.map)) {
            return convert.call(format, value, options);
        }
        const subValues = value.map((v) => recurse(v, options));
        const useMultiLine = subValues.some((sub) => sub.indexOf('\n') > -1);
        return subValues.join(',' + (useMultiLine ? '\n' : ' '));
    };
    const wrap = (value, options) => {
        return `<span ng-non-bindable>${recurse(value, options)}</span>`;
    };
    return wrap;
};
