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
exports.NumberInputOption = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
/**
 * Do not use this component anymore.
 * Please, use NumberInputOption in 'required_number_input.tsx'.
 * It is required for compatibility with TS 3.7.0
 * This should be removed in the future
 */
function NumberInputOption({ disabled, error, isInvalid, label, max, min, paramName, step, value = '', setValue, 'data-test-subj': dataTestSubj, }) {
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, error: error, isInvalid: isInvalid, fullWidth: true, compressed: true },
        react_1.default.createElement(eui_1.EuiFieldNumber, { "data-test-subj": dataTestSubj, disabled: disabled, compressed: true, fullWidth: true, isInvalid: isInvalid, step: step, max: max, min: min, value: value, onChange: (ev) => setValue(paramName, isNaN(ev.target.valueAsNumber) ? '' : ev.target.valueAsNumber) })));
}
exports.NumberInputOption = NumberInputOption;
