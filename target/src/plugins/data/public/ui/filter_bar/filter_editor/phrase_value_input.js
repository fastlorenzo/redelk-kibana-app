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
exports.PhraseValueInput = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const react_2 = tslib_1.__importDefault(require("react"));
const generic_combo_box_1 = require("./generic_combo_box");
const phrase_suggestor_1 = require("./phrase_suggestor");
const value_input_type_1 = require("./value_input_type");
const public_1 = require("../../../../../kibana_react/public");
class PhraseValueInputUI extends phrase_suggestor_1.PhraseSuggestorUI {
    render() {
        return (react_2.default.createElement(eui_1.EuiFormRow, { label: this.props.intl.formatMessage({
                id: 'data.filter.filterEditor.valueInputLabel',
                defaultMessage: 'Value',
            }) }, this.isSuggestingValues() ? (this.renderWithSuggestions()) : (react_2.default.createElement(value_input_type_1.ValueInputType, { placeholder: this.props.intl.formatMessage({
                id: 'data.filter.filterEditor.valueInputPlaceholder',
                defaultMessage: 'Enter a value',
            }), value: this.props.value, onChange: this.props.onChange, type: this.props.field ? this.props.field.type : 'string' }))));
    }
    renderWithSuggestions() {
        const { suggestions } = this.state;
        const { value, intl, onChange } = this.props;
        // there are cases when the value is a number, this would cause an exception
        const valueAsStr = String(value);
        const options = value ? lodash_1.uniq([valueAsStr, ...suggestions]) : suggestions;
        return (react_2.default.createElement(StringComboBox, { placeholder: intl.formatMessage({
                id: 'data.filter.filterEditor.valueSelectPlaceholder',
                defaultMessage: 'Select a value',
            }), options: options, getLabel: (option) => option, selectedOptions: value ? [valueAsStr] : [], onChange: ([newValue = '']) => onChange(newValue), onSearchChange: this.onSearchChange, singleSelection: { asPlainText: true }, onCreateOption: onChange, isClearable: false, "data-test-subj": "filterParamsComboBox phraseParamsComboxBox" }));
    }
}
function StringComboBox(props) {
    return generic_combo_box_1.GenericComboBox(props);
}
exports.PhraseValueInput = react_1.injectI18n(public_1.withKibana(PhraseValueInputUI));
