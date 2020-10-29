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
exports.SaveQueryForm = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
function SaveQueryForm({ savedQuery, savedQueryService, onSave, onClose, showFilterOption = true, showTimeFilterOption = true, }) {
    const [title, setTitle] = react_1.useState(savedQuery ? savedQuery.title : '');
    const [enabledSaveButton, setEnabledSaveButton] = react_1.useState(Boolean(savedQuery));
    const [description, setDescription] = react_1.useState(savedQuery ? savedQuery.description : '');
    const [savedQueries, setSavedQueries] = react_1.useState([]);
    const [shouldIncludeFilters, setShouldIncludeFilters] = react_1.useState(savedQuery ? !!savedQuery.filters : true);
    // Defaults to false because saved queries are meant to be as portable as possible and loading
    // a saved query with a time filter will override whatever the current value of the global timepicker
    // is. We expect this option to be used rarely and only when the user knows they want this behavior.
    const [shouldIncludeTimefilter, setIncludeTimefilter] = react_1.useState(savedQuery ? !!savedQuery.timefilter : false);
    const [formErrors, setFormErrors] = react_1.useState([]);
    const titleConflictErrorText = i18n_1.i18n.translate('data.search.searchBar.savedQueryForm.titleConflictText', {
        defaultMessage: 'Name conflicts with an existing saved query',
    });
    const savedQueryDescriptionText = i18n_1.i18n.translate('data.search.searchBar.savedQueryDescriptionText', {
        defaultMessage: 'Save query text and filters that you want to use again.',
    });
    react_1.useEffect(() => {
        const fetchQueries = async () => {
            const allSavedQueries = await savedQueryService.getAllSavedQueries();
            const sortedAllSavedQueries = lodash_1.sortBy(allSavedQueries, 'attributes.title');
            setSavedQueries(sortedAllSavedQueries);
        };
        fetchQueries();
    }, [savedQueryService]);
    const validate = react_1.useCallback(() => {
        const errors = [];
        if (!!savedQueries.find((existingSavedQuery) => !savedQuery && existingSavedQuery.attributes.title === title)) {
            errors.push(titleConflictErrorText);
        }
        if (!lodash_1.isEqual(errors, formErrors)) {
            setFormErrors(errors);
            return false;
        }
        return !formErrors.length;
    }, [savedQueries, savedQuery, title, titleConflictErrorText, formErrors]);
    const onClickSave = react_1.useCallback(() => {
        if (validate()) {
            onSave({
                title,
                description,
                shouldIncludeFilters,
                shouldIncludeTimefilter,
            });
        }
    }, [validate, onSave, title, description, shouldIncludeFilters, shouldIncludeTimefilter]);
    const onInputChange = react_1.useCallback((event) => {
        setEnabledSaveButton(Boolean(event.target.value));
        setFormErrors([]);
        setTitle(event.target.value);
    }, []);
    const autoTrim = react_1.useCallback(() => {
        const trimmedTitle = title.trim();
        if (title.length > trimmedTitle.length) {
            setTitle(trimmedTitle);
        }
    }, [title]);
    const hasErrors = formErrors.length > 0;
    const saveQueryForm = (react_1.default.createElement(eui_1.EuiForm, { isInvalid: hasErrors, error: formErrors, "data-test-subj": "saveQueryForm" },
        react_1.default.createElement(eui_1.EuiFormRow, null,
            react_1.default.createElement(eui_1.EuiText, { color: "subdued" }, savedQueryDescriptionText)),
        react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('data.search.searchBar.savedQueryNameLabelText', {
                defaultMessage: 'Name',
            }), helpText: i18n_1.i18n.translate('data.search.searchBar.savedQueryNameHelpText', {
                defaultMessage: 'Name is required. Name cannot contain leading or trailing whitespace. Name must be unique.',
            }), isInvalid: hasErrors },
            react_1.default.createElement(eui_1.EuiFieldText, { disabled: !!savedQuery, value: title, name: "title", onChange: onInputChange, "data-test-subj": "saveQueryFormTitle", isInvalid: hasErrors, onBlur: autoTrim })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('data.search.searchBar.savedQueryDescriptionLabelText', {
                defaultMessage: 'Description',
            }) },
            react_1.default.createElement(eui_1.EuiFieldText, { value: description, name: "description", onChange: (event) => {
                    setDescription(event.target.value);
                }, "data-test-subj": "saveQueryFormDescription" })),
        showFilterOption && (react_1.default.createElement(eui_1.EuiFormRow, null,
            react_1.default.createElement(eui_1.EuiSwitch, { name: "shouldIncludeFilters", label: i18n_1.i18n.translate('data.search.searchBar.savedQueryIncludeFiltersLabelText', {
                    defaultMessage: 'Include filters',
                }), checked: shouldIncludeFilters, onChange: () => {
                    setShouldIncludeFilters(!shouldIncludeFilters);
                }, "data-test-subj": "saveQueryFormIncludeFiltersOption" }))),
        showTimeFilterOption && (react_1.default.createElement(eui_1.EuiFormRow, null,
            react_1.default.createElement(eui_1.EuiSwitch, { name: "shouldIncludeTimefilter", label: i18n_1.i18n.translate('data.search.searchBar.savedQueryIncludeTimeFilterLabelText', {
                    defaultMessage: 'Include time filter',
                }), checked: shouldIncludeTimefilter, onChange: () => {
                    setIncludeTimefilter(!shouldIncludeTimefilter);
                }, "data-test-subj": "saveQueryFormIncludeTimeFilterOption" })))));
    return (react_1.default.createElement(eui_1.EuiOverlayMask, null,
        react_1.default.createElement(eui_1.EuiModal, { onClose: onClose, initialFocus: "[name=title]" },
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, null, i18n_1.i18n.translate('data.search.searchBar.savedQueryFormTitle', {
                    defaultMessage: 'Save query',
                }))),
            react_1.default.createElement(eui_1.EuiModalBody, null, saveQueryForm),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: onClose, "data-test-subj": "savedQueryFormCancelButton" }, i18n_1.i18n.translate('data.search.searchBar.savedQueryFormCancelButtonText', {
                    defaultMessage: 'Cancel',
                })),
                react_1.default.createElement(eui_1.EuiButton, { onClick: onClickSave, fill: true, "data-test-subj": "savedQueryFormSaveButton", disabled: hasErrors || !enabledSaveButton }, i18n_1.i18n.translate('data.search.searchBar.savedQueryFormSaveButtonText', {
                    defaultMessage: 'Save',
                }))))));
}
exports.SaveQueryForm = SaveQueryForm;
