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
exports.FilterEditor = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const react_2 = tslib_1.__importStar(require("react"));
const generic_combo_box_1 = require("./generic_combo_box");
const filter_editor_utils_1 = require("./lib/filter_editor_utils");
const phrase_value_input_1 = require("./phrase_value_input");
const phrases_values_input_1 = require("./phrases_values_input");
const range_value_input_1 = require("./range_value_input");
const common_1 = require("../../../../common");
class FilterEditorUI extends react_2.Component {
    constructor(props) {
        super(props);
        this.toggleCustomEditor = () => {
            const isCustomEditorOpen = !this.state.isCustomEditorOpen;
            this.setState({ isCustomEditorOpen });
        };
        this.onIndexPatternChange = ([selectedIndexPattern]) => {
            const selectedField = undefined;
            const selectedOperator = undefined;
            const params = undefined;
            this.setState({ selectedIndexPattern, selectedField, selectedOperator, params });
        };
        this.onFieldChange = ([selectedField]) => {
            const selectedOperator = undefined;
            const params = undefined;
            this.setState({ selectedField, selectedOperator, params });
        };
        this.onOperatorChange = ([selectedOperator]) => {
            // Only reset params when the operator type changes
            const params = lodash_1.get(this.state.selectedOperator, 'type') === lodash_1.get(selectedOperator, 'type')
                ? this.state.params
                : undefined;
            this.setState({ selectedOperator, params });
        };
        this.onCustomLabelSwitchChange = (event) => {
            const useCustomLabel = event.target.checked;
            const customLabel = event.target.checked ? '' : null;
            this.setState({ useCustomLabel, customLabel });
        };
        this.onCustomLabelChange = (event) => {
            const customLabel = event.target.value;
            this.setState({ customLabel });
        };
        this.onParamsChange = (params) => {
            this.setState({ params });
        };
        this.onQueryDslChange = (queryDsl) => {
            this.setState({ queryDsl });
        };
        this.onSubmit = () => {
            const { selectedIndexPattern: indexPattern, selectedField: field, selectedOperator: operator, params, useCustomLabel, customLabel, isCustomEditorOpen, queryDsl, } = this.state;
            const { $state } = this.props.filter;
            if (!$state || !$state.store) {
                return; // typescript validation
            }
            const alias = useCustomLabel ? customLabel : null;
            if (isCustomEditorOpen) {
                const { index, disabled, negate } = this.props.filter.meta;
                const newIndex = index || this.props.indexPatterns[0].id;
                const body = JSON.parse(queryDsl);
                const filter = common_1.buildCustomFilter(newIndex, body, disabled, negate, alias, $state.store);
                this.props.onSubmit(filter);
            }
            else if (indexPattern && field && operator) {
                const filter = common_1.buildFilter(indexPattern, field, operator.type, operator.negate, this.props.filter.meta.disabled, params ?? '', alias, $state.store);
                this.props.onSubmit(filter);
            }
        };
        this.state = {
            selectedIndexPattern: this.getIndexPatternFromFilter(),
            selectedField: this.getFieldFromFilter(),
            selectedOperator: this.getSelectedOperator(),
            params: common_1.getFilterParams(props.filter),
            useCustomLabel: props.filter.meta.alias !== null,
            customLabel: props.filter.meta.alias,
            queryDsl: JSON.stringify(common_1.cleanFilter(props.filter), null, 2),
            isCustomEditorOpen: this.isUnknownFilterType(),
        };
    }
    render() {
        return (react_2.default.createElement("div", null,
            react_2.default.createElement(eui_1.EuiPopoverTitle, null,
                react_2.default.createElement(eui_1.EuiFlexGroup, { alignItems: "baseline", responsive: false },
                    react_2.default.createElement(eui_1.EuiFlexItem, null,
                        react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.filterEditor.editFilterPopupTitle", defaultMessage: "Edit filter" })),
                    react_2.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "filterEditor__hiddenItem" }),
                    react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_2.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", onClick: this.toggleCustomEditor }, this.state.isCustomEditorOpen ? (react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.filterEditor.editFilterValuesButtonLabel", defaultMessage: "Edit filter values" })) : (react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.filterEditor.editQueryDslButtonLabel", defaultMessage: "Edit as Query DSL" })))))),
            react_2.default.createElement("div", { className: "globalFilterItem__editorForm" },
                react_2.default.createElement(eui_1.EuiForm, null,
                    this.renderIndexPatternInput(),
                    this.state.isCustomEditorOpen ? this.renderCustomEditor() : this.renderRegularEditor(),
                    react_2.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_2.default.createElement(eui_1.EuiSwitch, { id: "filterEditorCustomLabelSwitch", label: this.props.intl.formatMessage({
                            id: 'data.filter.filterEditor.createCustomLabelSwitchLabel',
                            defaultMessage: 'Create custom label?',
                        }), checked: this.state.useCustomLabel, onChange: this.onCustomLabelSwitchChange }),
                    this.state.useCustomLabel && (react_2.default.createElement("div", null,
                        react_2.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                        react_2.default.createElement(eui_1.EuiFormRow, { label: this.props.intl.formatMessage({
                                id: 'data.filter.filterEditor.createCustomLabelInputLabel',
                                defaultMessage: 'Custom label',
                            }) },
                            react_2.default.createElement(eui_1.EuiFieldText, { value: `${this.state.customLabel}`, onChange: this.onCustomLabelChange })))),
                    react_2.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_2.default.createElement(eui_1.EuiFlexGroup, { direction: "rowReverse", alignItems: "center", responsive: false },
                        react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_2.default.createElement(eui_1.EuiButton, { fill: true, onClick: this.onSubmit, isDisabled: !this.isFilterValid(), "data-test-subj": "saveFilter" },
                                react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.filterEditor.saveButtonLabel", defaultMessage: "Save" }))),
                        react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_2.default.createElement(eui_1.EuiButtonEmpty, { flush: "right", onClick: this.props.onCancel, "data-test-subj": "cancelSaveFilter" },
                                react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.filterEditor.cancelButtonLabel", defaultMessage: "Cancel" }))),
                        react_2.default.createElement(eui_1.EuiFlexItem, null))))));
    }
    renderIndexPatternInput() {
        if (this.props.indexPatterns.length <= 1 &&
            this.props.indexPatterns.find((indexPattern) => indexPattern === this.getIndexPatternFromFilter())) {
            /**
             * Don't render the index pattern selector if there's just one \ zero index patterns
             * and if the index pattern the filter was LOADED with is in the indexPatterns list.
             **/
            return '';
        }
        const { selectedIndexPattern } = this.state;
        return (react_2.default.createElement(eui_1.EuiFlexGroup, null,
            react_2.default.createElement(eui_1.EuiFlexItem, null,
                react_2.default.createElement(eui_1.EuiFormRow, { label: this.props.intl.formatMessage({
                        id: 'data.filter.filterEditor.indexPatternSelectLabel',
                        defaultMessage: 'Index Pattern',
                    }) },
                    react_2.default.createElement(IndexPatternComboBox, { placeholder: this.props.intl.formatMessage({
                            id: 'data.filter.filterBar.indexPatternSelectPlaceholder',
                            defaultMessage: 'Select an index pattern',
                        }), options: this.props.indexPatterns, selectedOptions: selectedIndexPattern ? [selectedIndexPattern] : [], getLabel: (indexPattern) => indexPattern.title, onChange: this.onIndexPatternChange, singleSelection: { asPlainText: true }, isClearable: false, "data-test-subj": "filterIndexPatternsSelect" })))));
    }
    renderRegularEditor() {
        return (react_2.default.createElement("div", null,
            react_2.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: "s" },
                react_2.default.createElement(eui_1.EuiFlexItem, { grow: 2 }, this.renderFieldInput()),
                react_2.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { flexBasis: 160 } }, this.renderOperatorInput())),
            react_2.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_2.default.createElement("div", { "data-test-subj": "filterParams" }, this.renderParamsEditor())));
    }
    renderFieldInput() {
        const { selectedIndexPattern, selectedField } = this.state;
        const fields = selectedIndexPattern ? filter_editor_utils_1.getFilterableFields(selectedIndexPattern) : [];
        return (react_2.default.createElement(eui_1.EuiFormRow, { label: this.props.intl.formatMessage({
                id: 'data.filter.filterEditor.fieldSelectLabel',
                defaultMessage: 'Field',
            }) },
            react_2.default.createElement(FieldComboBox, { id: "fieldInput", isDisabled: !selectedIndexPattern, placeholder: this.props.intl.formatMessage({
                    id: 'data.filter.filterEditor.fieldSelectPlaceholder',
                    defaultMessage: 'Select a field first',
                }), options: fields, selectedOptions: selectedField ? [selectedField] : [], getLabel: (field) => field.name, onChange: this.onFieldChange, singleSelection: { asPlainText: true }, isClearable: false, className: "globalFilterEditor__fieldInput", "data-test-subj": "filterFieldSuggestionList" })));
    }
    renderOperatorInput() {
        const { selectedField, selectedOperator } = this.state;
        const operators = selectedField ? filter_editor_utils_1.getOperatorOptions(selectedField) : [];
        return (react_2.default.createElement(eui_1.EuiFormRow, { label: this.props.intl.formatMessage({
                id: 'data.filter.filterEditor.operatorSelectLabel',
                defaultMessage: 'Operator',
            }) },
            react_2.default.createElement(OperatorComboBox, { isDisabled: !selectedField, placeholder: selectedField
                    ? this.props.intl.formatMessage({
                        id: 'data.filter.filterEditor.operatorSelectPlaceholderSelect',
                        defaultMessage: 'Select',
                    })
                    : this.props.intl.formatMessage({
                        id: 'data.filter.filterEditor.operatorSelectPlaceholderWaiting',
                        defaultMessage: 'Waiting',
                    }), options: operators, selectedOptions: selectedOperator ? [selectedOperator] : [], getLabel: ({ message }) => message, onChange: this.onOperatorChange, singleSelection: { asPlainText: true }, isClearable: false, "data-test-subj": "filterOperatorList" })));
    }
    renderCustomEditor() {
        return (react_2.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('data.filter.filterEditor.queryDslLabel', {
                defaultMessage: 'Elasticsearch Query DSL',
            }) },
            react_2.default.createElement(eui_1.EuiCodeEditor, { value: this.state.queryDsl, onChange: this.onQueryDslChange, mode: "json", width: "100%", height: "250px" })));
    }
    renderParamsEditor() {
        const indexPattern = this.state.selectedIndexPattern;
        if (!indexPattern || !this.state.selectedOperator) {
            return '';
        }
        switch (this.state.selectedOperator.type) {
            case 'exists':
                return '';
            case 'phrase':
                return (react_2.default.createElement(phrase_value_input_1.PhraseValueInput, { indexPattern: indexPattern, field: this.state.selectedField, value: this.state.params, onChange: this.onParamsChange, "data-test-subj": "phraseValueInput" }));
            case 'phrases':
                return (react_2.default.createElement(phrases_values_input_1.PhrasesValuesInput, { indexPattern: indexPattern, field: this.state.selectedField, values: this.state.params, onChange: this.onParamsChange }));
            case 'range':
                return (react_2.default.createElement(range_value_input_1.RangeValueInput, { field: this.state.selectedField, value: this.state.params, onChange: this.onParamsChange }));
        }
    }
    isUnknownFilterType() {
        const { type } = this.props.filter.meta;
        return !!type && !['phrase', 'phrases', 'range', 'exists'].includes(type);
    }
    getIndexPatternFromFilter() {
        return common_1.getIndexPatternFromFilter(this.props.filter, this.props.indexPatterns);
    }
    getFieldFromFilter() {
        const indexPattern = this.getIndexPatternFromFilter();
        return indexPattern && filter_editor_utils_1.getFieldFromFilter(this.props.filter, indexPattern);
    }
    getSelectedOperator() {
        return filter_editor_utils_1.getOperatorFromFilter(this.props.filter);
    }
    isFilterValid() {
        const { isCustomEditorOpen, queryDsl, selectedIndexPattern: indexPattern, selectedField: field, selectedOperator: operator, params, } = this.state;
        if (isCustomEditorOpen) {
            try {
                return Boolean(JSON.parse(queryDsl));
            }
            catch (e) {
                return false;
            }
        }
        return filter_editor_utils_1.isFilterValid(indexPattern, field, operator, params);
    }
}
function IndexPatternComboBox(props) {
    return generic_combo_box_1.GenericComboBox(props);
}
function FieldComboBox(props) {
    return generic_combo_box_1.GenericComboBox(props);
}
function OperatorComboBox(props) {
    return generic_combo_box_1.GenericComboBox(props);
}
exports.FilterEditor = react_1.injectI18n(FilterEditorUI);
