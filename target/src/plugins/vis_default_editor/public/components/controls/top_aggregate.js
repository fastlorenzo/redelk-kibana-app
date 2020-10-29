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
exports.TopAggregateParamEditor = exports.getCompatibleAggs = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
function getCompatibleAggs(agg) {
    const { options = [] } = agg
        .getAggParams()
        .find(({ name }) => name === 'aggregate');
    return options.filter((option) => option.isCompatible(agg));
}
exports.getCompatibleAggs = getCompatibleAggs;
function TopAggregateParamEditor({ agg, aggParam, value, showValidation, setValue, setValidity, setTouched, }) {
    const isFirstRun = react_1.useRef(true);
    const fieldType = agg.params.field && agg.params.field.type;
    const emptyValue = { text: '', value: 'EMPTY_VALUE', disabled: true, hidden: true };
    const filteredOptions = getCompatibleAggs(agg)
        .map(({ text, value: val }) => ({ text, value: val }))
        .sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
    const options = [emptyValue, ...filteredOptions];
    const disabled = fieldType && !filteredOptions.length;
    const isValid = disabled || !!value;
    const label = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.aggregateWithLabel", defaultMessage: "Aggregate with" }),
        ' ',
        react_1.default.createElement(eui_1.EuiIconTip, { position: "right", type: "questionInCircle", content: i18n_1.i18n.translate('visDefaultEditor.controls.aggregateWithTooltip', {
                defaultMessage: 'Choose a strategy for combining multiple hits or a multi-valued field into a single metric.',
            }) })));
    react_1.useEffect(() => {
        setValidity(isValid);
    }, [isValid, setValidity]);
    react_1.useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (value) {
            if (aggParam.options.find((opt) => opt.value === value.value)) {
                return;
            }
            setValue();
        }
        if (filteredOptions.length === 1) {
            setValue(aggParam.options.find((opt) => opt.value === filteredOptions[0].value));
        }
    }, [aggParam.options, fieldType, filteredOptions, setValue, value]);
    const handleChange = (event) => {
        if (event.target.value === emptyValue.value) {
            setValue();
        }
        else {
            setValue(aggParam.options.find((opt) => opt.value === event.target.value));
        }
    };
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, fullWidth: true, isInvalid: showValidation ? !isValid : false, compressed: true },
        react_1.default.createElement(eui_1.EuiSelect, { options: options, value: value ? value.value : emptyValue.value, onChange: handleChange, fullWidth: true, compressed: true, isInvalid: showValidation ? !isValid : false, disabled: disabled, onBlur: setTouched, "data-test-subj": "visDefaultEditorAggregateWith" })));
}
exports.TopAggregateParamEditor = TopAggregateParamEditor;
