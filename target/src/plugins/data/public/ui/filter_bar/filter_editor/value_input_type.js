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
exports.ValueInputType = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const react_2 = tslib_1.__importStar(require("react"));
const filter_editor_utils_1 = require("./lib/filter_editor_utils");
class ValueInputTypeUI extends react_2.Component {
    constructor() {
        super(...arguments);
        this.onBoolChange = (event) => {
            const boolValue = event.target.value === 'true';
            this.props.onChange(boolValue);
        };
        this.onChange = (event) => {
            const params = event.target.value;
            this.props.onChange(params);
        };
        this.onBlur = (event) => {
            if (this.props.onBlur) {
                const params = event.target.value;
                this.props.onBlur(params);
            }
        };
    }
    render() {
        const value = this.props.value;
        let inputElement;
        switch (this.props.type) {
            case 'string':
                inputElement = (react_2.default.createElement(eui_1.EuiFieldText, { placeholder: this.props.placeholder, value: value, onChange: this.onChange, controlOnly: this.props.controlOnly, className: this.props.className }));
                break;
            case 'number':
                inputElement = (react_2.default.createElement(eui_1.EuiFieldNumber, { placeholder: this.props.placeholder, value: typeof value === 'string' ? parseFloat(value) : value, onChange: this.onChange, controlOnly: this.props.controlOnly, className: this.props.className }));
                break;
            case 'date':
                inputElement = (react_2.default.createElement(eui_1.EuiFieldText, { placeholder: this.props.placeholder, value: value, onChange: this.onChange, onBlur: this.onBlur, isInvalid: !lodash_1.isEmpty(value) && !filter_editor_utils_1.validateParams(value, this.props.type), controlOnly: this.props.controlOnly, className: this.props.className }));
                break;
            case 'ip':
                inputElement = (react_2.default.createElement(eui_1.EuiFieldText, { placeholder: this.props.placeholder, value: value, onChange: this.onChange, isInvalid: !lodash_1.isEmpty(value) && !filter_editor_utils_1.validateParams(value, this.props.type), controlOnly: this.props.controlOnly, className: this.props.className }));
                break;
            case 'boolean':
                inputElement = (react_2.default.createElement(eui_1.EuiSelect, { options: [
                        { value: undefined, text: this.props.placeholder },
                        {
                            value: 'true',
                            text: this.props.intl.formatMessage({
                                id: 'data.filter.filterEditor.trueOptionLabel',
                                defaultMessage: 'true',
                            }),
                        },
                        {
                            value: 'false',
                            text: this.props.intl.formatMessage({
                                id: 'data.filter.filterEditor.falseOptionLabel',
                                defaultMessage: 'false',
                            }),
                        },
                    ], value: value, onChange: this.onBoolChange, className: this.props.className }));
                break;
            default:
                break;
        }
        return inputElement;
    }
}
exports.ValueInputType = react_1.injectI18n(ValueInputTypeUI);
