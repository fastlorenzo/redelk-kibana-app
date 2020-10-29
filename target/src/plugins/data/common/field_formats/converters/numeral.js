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
exports.NumeralFormat = void 0;
const tslib_1 = require("tslib");
// @ts-ignore
const numeral_1 = tslib_1.__importDefault(require("@elastic/numeral"));
// @ts-ignore
const languages_1 = tslib_1.__importDefault(require("@elastic/numeral/languages"));
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const constants_1 = require("../../constants");
const numeralInst = numeral_1.default();
languages_1.default.forEach((numeralLanguage) => {
    numeral_1.default.language(numeralLanguage.id, numeralLanguage.lang);
});
class NumeralFormat extends field_format_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.getParamDefaults = () => ({
            pattern: this.getConfig(`format:${this.id}:defaultPattern`),
        });
        this.textConvert = (val) => {
            return this.getConvertedValue(val);
        };
    }
    getConvertedValue(val) {
        if (val === -Infinity)
            return '-∞';
        if (val === +Infinity)
            return '+∞';
        if (typeof val !== 'number') {
            val = parseFloat(val);
        }
        if (isNaN(val))
            return '';
        const previousLocale = numeral_1.default.language();
        const defaultLocale = (this.getConfig && this.getConfig(constants_1.UI_SETTINGS.FORMAT_NUMBER_DEFAULT_LOCALE)) || 'en';
        numeral_1.default.language(defaultLocale);
        const formatted = numeralInst.set(val).format(this.param('pattern'));
        numeral_1.default.language(previousLocale);
        return formatted;
    }
}
exports.NumeralFormat = NumeralFormat;
NumeralFormat.fieldType = types_1.KBN_FIELD_TYPES.NUMBER;
