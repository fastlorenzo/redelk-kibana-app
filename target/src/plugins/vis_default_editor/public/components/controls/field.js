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
exports.FieldParamEditor = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const react_use_1 = require("react-use");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const utils_1 = require("./utils");
const label = i18n_1.i18n.translate('visDefaultEditor.controls.field.fieldLabel', {
    defaultMessage: 'Field',
});
function FieldParamEditor({ agg, aggParam, customError, customLabel, indexedFields = [], showValidation, value, setTouched, setValidity, setValue, }) {
    const [isDirty, setIsDirty] = react_1.useState(false);
    const selectedOptions = value
        ? [{ label: value.displayName || value.name, target: value }]
        : [];
    const onChange = (options) => {
        const selectedOption = lodash_1.get(options, '0.target');
        if (!(aggParam.required && !selectedOption)) {
            setValue(selectedOption);
        }
        if (aggParam.onChange) {
            aggParam.onChange(agg);
        }
    };
    const errors = customError ? [customError] : [];
    if (!indexedFields.length) {
        errors.push(i18n_1.i18n.translate('visDefaultEditor.controls.field.noCompatibleFieldsDescription', {
            defaultMessage: 'The index pattern {indexPatternTitle} does not contain any of the following compatible field types: {fieldTypes}',
            values: {
                indexPatternTitle: agg.getIndexPattern && agg.getIndexPattern().title,
                fieldTypes: getFieldTypesString(agg),
            },
        }));
    }
    const isValid = !!value && !errors.length && !isDirty;
    // we show an error message right away if there is no compatible fields
    const showErrorMessage = (showValidation || !indexedFields.length) && !isValid;
    utils_1.useValidation(setValidity, isValid);
    react_use_1.useMount(() => {
        // set field if only one available
        if (indexedFields.length !== 1) {
            return;
        }
        const indexedField = indexedFields[0];
        if (!('options' in indexedField)) {
            setValue(indexedField.target);
        }
        else if (indexedField.options.length === 1) {
            setValue(indexedField.options[0].target);
        }
    });
    const onSearchChange = react_1.useCallback((searchValue) => setIsDirty(Boolean(searchValue)), []);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: customLabel || label, isInvalid: showErrorMessage, fullWidth: true, error: errors, compressed: true },
        react_1.default.createElement(eui_1.EuiComboBox, { compressed: true, placeholder: i18n_1.i18n.translate('visDefaultEditor.controls.field.selectFieldPlaceholder', {
                defaultMessage: 'Select a field',
            }), options: indexedFields, isDisabled: !indexedFields.length, selectedOptions: selectedOptions, singleSelection: { asPlainText: true }, isClearable: false, isInvalid: showErrorMessage, onChange: onChange, onBlur: setTouched, onSearchChange: onSearchChange, "data-test-subj": "visDefaultEditorField", fullWidth: true })));
}
exports.FieldParamEditor = FieldParamEditor;
function getFieldTypesString(agg) {
    const param = lodash_1.get(agg, 'type.params', []).find((p) => p.name === 'field') ||
        {};
    return utils_1.formatListAsProse(utils_1.parseCommaSeparatedList(param.filterFieldTypes), { inclusive: false });
}
