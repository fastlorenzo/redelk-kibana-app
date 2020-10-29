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
exports.RangeOption = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
function RangeOption({ label, max, min, showInput, showLabels, showValue = true, step, paramName, value, setValue, }) {
    const [stateValue, setStateValue] = react_1.useState(value);
    const [isValidState, setIsValidState] = react_1.useState(true);
    const error = i18n_1.i18n.translate('charts.controls.rangeErrorMessage', {
        defaultMessage: 'Values must be on or between {min} and {max}',
        values: { min, max },
    });
    const onChangeHandler = (event, isValid) => {
        const { valueAsNumber } = event.target; // since we don't show ticks on EuiRange, the target will definitely be HTMLInputElement type, so we can cast it directly.
        setStateValue(valueAsNumber);
        setIsValidState(isValid);
        if (isValid) {
            setValue(paramName, valueAsNumber);
        }
    };
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, fullWidth: true, isInvalid: !isValidState, error: error, compressed: true },
        react_1.default.createElement(eui_1.EuiRange, { compressed: true, fullWidth: true, max: max, min: min, showInput: showInput, showLabels: showLabels, showValue: showValue, step: step, value: stateValue, onChange: onChangeHandler })));
}
exports.RangeOption = RangeOption;
