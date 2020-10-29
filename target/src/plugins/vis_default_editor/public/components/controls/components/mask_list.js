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
exports.MaskList = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const input_list_1 = require("./input_list");
const public_1 = require("../../../../../data/public");
const EMPTY_STRING = '';
const defaultConfig = {
    defaultValue: {
        mask: { model: '0.0.0.0/1', value: '0.0.0.0/1', isInvalid: false },
    },
    validateClass: public_1.search.aggs.CidrMask,
    getModelValue: (item = {}) => ({
        mask: {
            model: item.mask || EMPTY_STRING,
            value: item.mask || EMPTY_STRING,
            isInvalid: false,
        },
    }),
    getRemoveBtnAriaLabel: (item) => item.mask.value
        ? i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.removeCidrMaskButtonAriaLabel', {
            defaultMessage: 'Remove the CIDR mask value of {mask}',
            values: { mask: item.mask.value },
        })
        : i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.removeEmptyCidrMaskButtonAriaLabel', {
            defaultMessage: 'Remove the CIDR mask default value',
        }),
    onChangeFn: ({ mask }) => {
        if (mask.model) {
            return { mask: mask.model };
        }
        return {};
    },
    hasInvalidValuesFn: ({ mask }) => mask.isInvalid,
    modelNames: 'mask',
};
function MaskList({ showValidation, onBlur, ...rest }) {
    const renderInputRow = react_1.useCallback(({ mask }, index, onChangeValue) => (react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement(eui_1.EuiFieldText, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.cidrMaskAriaLabel', {
                defaultMessage: 'CIDR mask: {mask}',
                values: { mask: mask.value || '*' },
            }), compressed: true, fullWidth: true, isInvalid: showValidation ? mask.isInvalid : false, placeholder: "*", onChange: (ev) => {
                onChangeValue(index, ev.target.value, 'mask');
            }, value: mask.value, onBlur: onBlur }))), [onBlur, showValidation]);
    const maskListConfig = {
        ...defaultConfig,
        renderInputRow,
    };
    return react_1.default.createElement(input_list_1.InputList, Object.assign({ config: maskListConfig }, rest));
}
exports.MaskList = MaskList;
