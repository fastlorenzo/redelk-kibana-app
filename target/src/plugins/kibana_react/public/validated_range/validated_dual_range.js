"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatedDualRange = void 0;
const tslib_1 = require("tslib");
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
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const is_range_valid_1 = require("./is_range_valid");
class ValidatedDualRange extends react_1.Component {
    constructor() {
        super(...arguments);
        // @ts-ignore state populated by getDerivedStateFromProps
        this.state = {};
        this._onChange = (value) => {
            const { isValid, errorMessage } = is_range_valid_1.isRangeValid(value, this.props.min, this.props.max, this.props.allowEmptyRange);
            this.setState({
                value,
                isValid,
                errorMessage,
            });
            if (this.props.onChange && isValid) {
                this.props.onChange([value[0], value[1]]);
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.prevValue) {
            const { isValid, errorMessage } = is_range_valid_1.isRangeValid(nextProps.value, nextProps.min, nextProps.max, nextProps.allowEmptyRange);
            return {
                value: nextProps.value,
                prevValue: nextProps.value,
                isValid,
                errorMessage,
            };
        }
        return null;
    }
    render() {
        const { compressed, fullWidth, label, formRowDisplay, value, // eslint-disable-line no-unused-vars
        onChange, // eslint-disable-line no-unused-vars
        allowEmptyRange, // eslint-disable-line no-unused-vars
        ...rest // TODO: Consider alternatives for spread operator in component
         } = this.props;
        return (react_1.default.createElement(eui_1.EuiFormRow, { compressed: compressed, fullWidth: fullWidth, isInvalid: !this.state.isValid, error: this.state.errorMessage ? [this.state.errorMessage] : [], label: label, display: formRowDisplay },
            react_1.default.createElement(eui_1.EuiDualRange, Object.assign({ compressed: compressed, fullWidth: fullWidth, value: this.state.value, onChange: this._onChange, minInputProps: {
                    'aria-label': i18n_1.i18n.translate('kibana-react.dualRangeControl.minInputAriaLabel', {
                        defaultMessage: 'Range minimum',
                    }),
                }, maxInputProps: {
                    'aria-label': i18n_1.i18n.translate('kibana-react.dualRangeControl.maxInputAriaLabel', {
                        defaultMessage: 'Range maximum',
                    }),
                } }, rest))));
    }
}
exports.ValidatedDualRange = ValidatedDualRange;
ValidatedDualRange.defaultProps = {
    allowEmptyRange: true,
    fullWidth: false,
    compressed: false,
};
