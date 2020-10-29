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
exports.PhrasesValuesInput = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const react_2 = tslib_1.__importDefault(require("react"));
const generic_combo_box_1 = require("./generic_combo_box");
const phrase_suggestor_1 = require("./phrase_suggestor");
const public_1 = require("../../../../../kibana_react/public");
class PhrasesValuesInputUI extends phrase_suggestor_1.PhraseSuggestorUI {
    render() {
        const { suggestions } = this.state;
        const { values, intl, onChange } = this.props;
        const options = values ? lodash_1.uniq([...values, ...suggestions]) : suggestions;
        return (react_2.default.createElement(eui_1.EuiFormRow, { label: intl.formatMessage({
                id: 'data.filter.filterEditor.valuesSelectLabel',
                defaultMessage: 'Values',
            }) },
            react_2.default.createElement(StringComboBox, { placeholder: intl.formatMessage({
                    id: 'data.filter.filterEditor.valuesSelectPlaceholder',
                    defaultMessage: 'Select values',
                }), options: options, getLabel: (option) => option, selectedOptions: values || [], onSearchChange: this.onSearchChange, onCreateOption: (option) => onChange([...(values || []), option]), onChange: onChange, isClearable: false, "data-test-subj": "filterParamsComboBox phrasesParamsComboxBox" })));
    }
}
function StringComboBox(props) {
    return generic_combo_box_1.GenericComboBox(props);
}
exports.PhrasesValuesInput = react_1.injectI18n(public_1.withKibana(PhrasesValuesInputUI));
