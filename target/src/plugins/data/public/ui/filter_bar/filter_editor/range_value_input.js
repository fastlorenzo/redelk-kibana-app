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
exports.RangeValueInput = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const react_2 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../../../../kibana_react/public");
const value_input_type_1 = require("./value_input_type");
function RangeValueInputUI(props) {
    const kibana = public_1.useKibana();
    const type = props.field ? props.field.type : 'string';
    const tzConfig = kibana.services.uiSettings.get('dateFormat:tz');
    const formatDateChange = (value) => {
        if (typeof value !== 'string' && typeof value !== 'number')
            return value;
        const momentParsedValue = moment_1.default(value).tz(tzConfig);
        if (momentParsedValue.isValid())
            return momentParsedValue?.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        return value;
    };
    const onFromChange = (value) => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new Error('Range params must be a string or number');
        }
        props.onChange({ from: value, to: lodash_1.get(props, 'value.to') });
    };
    const onToChange = (value) => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new Error('Range params must be a string or number');
        }
        props.onChange({ from: lodash_1.get(props, 'value.from'), to: value });
    };
    return (react_2.default.createElement("div", null,
        react_2.default.createElement(eui_1.EuiFormControlLayoutDelimited, { "aria-label": props.intl.formatMessage({
                id: 'data.filter.filterEditor.rangeInputLabel',
                defaultMessage: 'Range',
            }), startControl: react_2.default.createElement(value_input_type_1.ValueInputType, { controlOnly: true, type: type, value: props.value ? props.value.from : undefined, onChange: onFromChange, onBlur: (value) => {
                    onFromChange(formatDateChange(value));
                }, placeholder: props.intl.formatMessage({
                    id: 'data.filter.filterEditor.rangeStartInputPlaceholder',
                    defaultMessage: 'Start of the range',
                }) }), endControl: react_2.default.createElement(value_input_type_1.ValueInputType, { controlOnly: true, type: type, value: props.value ? props.value.to : undefined, onChange: onToChange, onBlur: (value) => {
                    onToChange(formatDateChange(value));
                }, placeholder: props.intl.formatMessage({
                    id: 'data.filter.filterEditor.rangeEndInputPlaceholder',
                    defaultMessage: 'End of the range',
                }) }) })));
}
exports.RangeValueInput = react_1.injectI18n(RangeValueInputUI);
