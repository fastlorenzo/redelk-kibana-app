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
exports.FromToList = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../data/public");
const input_list_1 = require("./input_list");
const EMPTY_STRING = '';
const defaultConfig = {
    defaultValue: {
        from: { value: '0.0.0.0', model: '0.0.0.0', isInvalid: false },
        to: { value: '255.255.255.255', model: '255.255.255.255', isInvalid: false },
    },
    validateClass: public_1.search.aggs.Ipv4Address,
    getModelValue: (item = {}) => ({
        from: {
            value: item.from || EMPTY_STRING,
            model: item.from || EMPTY_STRING,
            isInvalid: false,
        },
        to: { value: item.to || EMPTY_STRING, model: item.to || EMPTY_STRING, isInvalid: false },
    }),
    getRemoveBtnAriaLabel: (item) => i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.removeRangeAriaLabel', {
        defaultMessage: 'Remove the range of {from} to {to}',
        values: { from: item.from.value || '*', to: item.to.value || '*' },
    }),
    onChangeFn: ({ from, to }) => {
        const result = {};
        if (from.model) {
            result.from = from.model;
        }
        if (to.model) {
            result.to = to.model;
        }
        return result;
    },
    hasInvalidValuesFn: ({ from, to }) => from.isInvalid || to.isInvalid,
    modelNames: ['from', 'to'],
};
function FromToList({ showValidation, onBlur, ...rest }) {
    const renderInputRow = react_1.useCallback((item, index, onChangeValue) => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiFieldText, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.ipRangeFromAriaLabel', {
                    defaultMessage: 'IP range from: {value}',
                    values: { value: item.from.value || '*' },
                }), compressed: true, isInvalid: showValidation ? item.from.isInvalid : false, placeholder: "*", onChange: (ev) => {
                    onChangeValue(index, ev.target.value, 'from');
                }, value: item.from.value, onBlur: onBlur })),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiIcon, { type: "sortRight", color: "subdued" })),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiFieldText, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.ipRangeToAriaLabel', {
                    defaultMessage: 'IP range to: {value}',
                    values: { value: item.to.value || '*' },
                }), compressed: true, isInvalid: showValidation ? item.to.isInvalid : false, placeholder: "*", onChange: (ev) => {
                    onChangeValue(index, ev.target.value, 'to');
                }, value: item.to.value, onBlur: onBlur })))), [onBlur, showValidation]);
    const fromToListConfig = {
        ...defaultConfig,
        renderInputRow,
    };
    return react_1.default.createElement(input_list_1.InputList, Object.assign({ config: fromToListConfig }, rest));
}
exports.FromToList = FromToList;
