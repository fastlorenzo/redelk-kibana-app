"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultEditorAggSelect = void 0;
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
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../kibana_react/public");
const agg_params_state_1 = require("./agg_params_state");
function DefaultEditorAggSelect({ aggError, id, indexPattern, value, setValue, aggTypeOptions, showValidation, isSubAggregation, onChangeAggType, }) {
    const [isDirty, setIsDirty] = react_1.useState(false);
    const { services } = public_1.useKibana();
    const selectedOptions = value
        ? [{ label: value.title, target: value }]
        : [];
    const label = isSubAggregation ? (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.aggSelect.subAggregationLabel", defaultMessage: "Sub aggregation" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.aggSelect.aggregationLabel", defaultMessage: "Aggregation" }));
    let aggHelpLink;
    if (lodash_1.has(value, 'name')) {
        aggHelpLink = services.docLinks.links.aggs[value.name];
    }
    const helpLink = value && aggHelpLink && (react_1.default.createElement(eui_1.EuiLink, { href: aggHelpLink, target: "_blank", rel: "noopener" },
        react_1.default.createElement(eui_1.EuiText, { size: "xs" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.aggSelect.helpLinkLabel", defaultMessage: "{aggTitle} help", values: { aggTitle: value ? value.title : '' } }))));
    const errors = aggError ? [aggError] : [];
    if (!aggTypeOptions.length) {
        errors.push(i18n_1.i18n.translate('visDefaultEditor.aggSelect.noCompatibleAggsDescription', {
            defaultMessage: 'The index pattern {indexPatternTitle} does not have any aggregatable fields.',
            values: {
                indexPatternTitle: indexPattern && indexPattern.title,
            },
        }));
    }
    const isValid = !!value && !errors.length && !isDirty;
    const onChange = react_1.useCallback((options) => {
        const selectedOption = lodash_1.get(options, '0.target');
        if (selectedOption) {
            setValue(selectedOption);
        }
    }, [setValue]);
    const onSearchChange = react_1.useCallback((searchValue) => setIsDirty(Boolean(searchValue)), []);
    const setTouched = react_1.useCallback(() => onChangeAggType({ type: agg_params_state_1.AGG_TYPE_ACTION_KEYS.TOUCHED, payload: true }), [onChangeAggType]);
    const setValidity = react_1.useCallback((valid) => onChangeAggType({ type: agg_params_state_1.AGG_TYPE_ACTION_KEYS.VALID, payload: valid }), [onChangeAggType]);
    react_1.useEffect(() => {
        setValidity(isValid);
    }, [isValid, setValidity]);
    react_1.useEffect(() => {
        if (errors.length) {
            setTouched();
        }
    }, [errors.length, setTouched]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, labelAppend: helpLink, error: errors, isInvalid: showValidation ? !isValid : false, fullWidth: true, compressed: true },
        react_1.default.createElement(eui_1.EuiComboBox, { placeholder: i18n_1.i18n.translate('visDefaultEditor.aggSelect.selectAggPlaceholder', {
                defaultMessage: 'Select an aggregation',
            }), id: `visDefaultEditorAggSelect${id}`, isDisabled: !aggTypeOptions.length, options: aggTypeOptions, selectedOptions: selectedOptions, singleSelection: { asPlainText: true }, onBlur: setTouched, onChange: onChange, onSearchChange: onSearchChange, "data-test-subj": "defaultEditorAggSelect", isClearable: false, isInvalid: showValidation ? !isValid : false, fullWidth: true, compressed: true })));
}
exports.DefaultEditorAggSelect = DefaultEditorAggSelect;
