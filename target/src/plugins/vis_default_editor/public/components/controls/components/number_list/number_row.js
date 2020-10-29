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
exports.NumberRow = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
function NumberRow({ autoFocus, disableDelete, model, isInvalid, labelledbyId, range, onBlur, onDelete, onChange, }) {
    const deleteBtnAriaLabel = i18n_1.i18n.translate('visDefaultEditor.controls.numberList.removeUnitButtonAriaLabel', {
        defaultMessage: 'Remove the rank value of {value}',
        values: { value: model.value },
    });
    const onValueChanged = react_1.useCallback((event) => onChange({
        value: event.target.value,
        id: model.id,
    }), [onChange, model.id]);
    const onDeleteFn = react_1.useCallback(() => onDelete(model.id), [onDelete, model.id]);
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, alignItems: "center", gutterSize: "s" },
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiFieldNumber, { "aria-labelledby": labelledbyId, autoFocus: autoFocus, compressed: true, isInvalid: isInvalid, placeholder: i18n_1.i18n.translate('visDefaultEditor.controls.numberList.enterValuePlaceholder', {
                    defaultMessage: 'Enter a value',
                }), onChange: onValueChanged, value: model.value, fullWidth: true, min: range.min, max: range.max, onBlur: onBlur })),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": deleteBtnAriaLabel, title: deleteBtnAriaLabel, color: "danger", iconType: "trash", onClick: onDeleteFn, disabled: disableDelete }))));
}
exports.NumberRow = NumberRow;
