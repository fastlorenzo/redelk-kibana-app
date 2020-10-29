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
exports.SavedQueryListItem = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importStar(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const i18n_1 = require("@kbn/i18n");
exports.SavedQueryListItem = ({ savedQuery, isSelected, onSelect, onDelete, showWriteOperations, }) => {
    const [showDeletionConfirmationModal, setShowDeletionConfirmationModal] = react_1.useState(false);
    const selectButtonAriaLabelText = isSelected
        ? i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSavedQueryListItemSelectedButtonAriaLabel', {
            defaultMessage: 'Saved query button selected {savedQueryName}. Press to clear any changes.',
            values: { savedQueryName: savedQuery.attributes.title },
        })
        : i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSavedQueryListItemButtonAriaLabel', {
            defaultMessage: 'Saved query button {savedQueryName}',
            values: { savedQueryName: savedQuery.attributes.title },
        });
    const selectButtonDataTestSubj = isSelected
        ? `load-saved-query-${savedQuery.attributes.title}-button saved-query-list-item-selected`
        : `load-saved-query-${savedQuery.attributes.title}-button`;
    const classes = classnames_1.default('kbnSavedQueryListItem', {
        'kbnSavedQueryListItem-selected': isSelected,
    });
    const label = (react_1.default.createElement("span", { className: "kbnSavedQueryListItem__label" },
        react_1.default.createElement("span", { className: "kbnSavedQueryListItem__labelText" }, savedQuery.attributes.title),
        ' ',
        savedQuery.attributes.description && (react_1.default.createElement(eui_1.EuiIconTip, { type: "iInCircle", content: savedQuery.attributes.description, "aria-label": i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSavedQueryListItemDescriptionAriaLabel', {
                defaultMessage: '{savedQueryName} description',
                values: { savedQueryName: savedQuery.attributes.title },
            }) }))));
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiListGroupItem, { className: classes, key: savedQuery.id, "data-test-subj": `saved-query-list-item ${selectButtonDataTestSubj} ${isSelected ? 'saved-query-list-item-selected' : ''}`, isActive: isSelected, onClick: () => {
                onSelect(savedQuery);
            }, "aria-label": selectButtonAriaLabelText, label: label, iconType: isSelected ? 'check' : undefined, extraAction: showWriteOperations
                ? {
                    color: 'danger',
                    onClick: () => setShowDeletionConfirmationModal(true),
                    iconType: 'trash',
                    iconSize: 's',
                    'aria-label': i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverDeleteButtonAriaLabel', {
                        defaultMessage: 'Delete saved query {savedQueryName}',
                        values: { savedQueryName: savedQuery.attributes.title },
                    }),
                    title: i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverDeleteButtonAriaLabel', {
                        defaultMessage: 'Delete saved query {savedQueryName}',
                        values: { savedQueryName: savedQuery.attributes.title },
                    }),
                    'data-test-subj': `delete-saved-query-${savedQuery.attributes.title}-button`,
                }
                : undefined }),
        showDeletionConfirmationModal && (react_1.default.createElement(eui_1.EuiOverlayMask, null,
            react_1.default.createElement(eui_1.EuiConfirmModal, { title: i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverConfirmDeletionTitle', {
                    defaultMessage: 'Delete "{savedQueryName}"?',
                    values: {
                        savedQueryName: savedQuery.attributes.title,
                    },
                }), confirmButtonText: i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverConfirmDeletionConfirmButtonText', {
                    defaultMessage: 'Delete',
                }), cancelButtonText: i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverConfirmDeletionCancelButtonText', {
                    defaultMessage: 'Cancel',
                }), onConfirm: () => {
                    onDelete(savedQuery);
                    setShowDeletionConfirmationModal(false);
                }, buttonColor: "danger", onCancel: () => {
                    setShowDeletionConfirmationModal(false);
                } })))));
};
