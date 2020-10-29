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
exports.RequiredNumberInputOption = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
/**
 * Use only this component instead of NumberInputOption in 'number_input.tsx'.
 * It is required for compatibility with TS 3.7.0
 *
 * @param {number} props.value Should be numeric only
 */
function RequiredNumberInputOption({ disabled, error, isInvalid, label, max, min, paramName, step, value, setValue, setValidity, 'data-test-subj': dataTestSubj, }) {
    const isValid = value !== null;
    react_1.useEffect(() => {
        setValidity(paramName, isValid);
        return () => setValidity(paramName, true);
    }, [isValid, paramName, setValidity]);
    const onChange = react_1.useCallback((ev) => setValue(paramName, isNaN(ev.target.valueAsNumber) ? null : ev.target.valueAsNumber), [setValue, paramName]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, error: error, isInvalid: isInvalid, fullWidth: true, compressed: true },
        react_1.default.createElement(eui_1.EuiFieldNumber, { compressed: true, fullWidth: true, required: true, "data-test-subj": dataTestSubj, disabled: disabled, isInvalid: !isValid, step: step, max: max, min: min, value: value === null ? '' : value, onChange: onChange })));
}
exports.RequiredNumberInputOption = RequiredNumberInputOption;
