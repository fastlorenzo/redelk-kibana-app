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
exports.ColorFormat = void 0;
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const types_2 = require("../types");
const utils_1 = require("../utils");
const color_default_1 = require("../constants/color_default");
const convertTemplate = lodash_1.template('<span style="<%- style %>"><%- val %></span>');
class ColorFormat extends field_format_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.htmlConvert = (val) => {
            const color = this.findColorRuleForVal(val);
            if (!color)
                return lodash_1.escape(utils_1.asPrettyString(val));
            let style = '';
            if (color.text)
                style += `color: ${color.text};`;
            if (color.background)
                style += `background-color: ${color.background};`;
            return convertTemplate({ val, style });
        };
    }
    getParamDefaults() {
        return {
            fieldType: null,
            colors: [lodash_1.cloneDeep(color_default_1.DEFAULT_CONVERTER_COLOR)],
        };
    }
    findColorRuleForVal(val) {
        switch (this.param('fieldType')) {
            case 'string':
                return lodash_1.findLast(this.param('colors'), (colorParam) => {
                    return new RegExp(colorParam.regex).test(val);
                });
            case 'number':
                return lodash_1.findLast(this.param('colors'), ({ range }) => {
                    if (!range)
                        return;
                    const [start, end] = range.split(':');
                    return val >= Number(start) && val <= Number(end);
                });
            default:
                return null;
        }
    }
}
exports.ColorFormat = ColorFormat;
ColorFormat.id = types_2.FIELD_FORMAT_IDS.COLOR;
ColorFormat.title = i18n_1.i18n.translate('data.fieldFormats.color.title', {
    defaultMessage: 'Color',
});
ColorFormat.fieldType = [types_1.KBN_FIELD_TYPES.NUMBER, types_1.KBN_FIELD_TYPES.STRING];
