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
exports.ExtendedBoundsParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
function areBoundsValid({ min, max }) {
    if (min === '' || max === '') {
        return false;
    }
    return max >= min;
}
function ExtendedBoundsParamEditor({ value = {}, setValue, setValidity, showValidation, setTouched, }) {
    const minLabel = i18n_1.i18n.translate('visDefaultEditor.controls.extendedBounds.minLabel', {
        defaultMessage: 'Min',
    });
    const maxLabel = i18n_1.i18n.translate('visDefaultEditor.controls.extendedBounds.maxLabel', {
        defaultMessage: 'Max',
    });
    const isValid = areBoundsValid(value);
    let error;
    if (!isValid) {
        error = i18n_1.i18n.translate('visDefaultEditor.controls.extendedBounds.errorMessage', {
            defaultMessage: 'Min should be less than or equal to Max.',
        });
    }
    utils_1.useValidation(setValidity, isValid);
    const handleChange = (ev, name) => {
        setValue({
            ...value,
            [name]: ev.target.value === '' ? '' : parseFloat(ev.target.value),
        });
    };
    return (react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, isInvalid: showValidation ? !isValid : false, error: error },
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s", responsive: false },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiFieldNumber, { value: lodash_1.isUndefined(value.min) ? '' : value.min, onChange: (ev) => handleChange(ev, 'min'), onBlur: setTouched, fullWidth: true, isInvalid: showValidation ? !isValid : false, "aria-label": minLabel, prepend: minLabel, compressed: true })),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiFieldNumber, { value: lodash_1.isUndefined(value.max) ? '' : value.max, onChange: (ev) => handleChange(ev, 'max'), onBlur: setTouched, fullWidth: true, isInvalid: showValidation ? !isValid : false, "aria-label": maxLabel, prepend: maxLabel, compressed: true })))));
}
exports.ExtendedBoundsParamEditor = ExtendedBoundsParamEditor;
