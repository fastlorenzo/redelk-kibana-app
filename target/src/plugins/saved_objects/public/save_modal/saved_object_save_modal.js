"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedObjectSaveModal = void 0;
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
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
const eui_2 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const generateId = eui_1.htmlIdGenerator();
class SavedObjectSaveModal extends react_2.default.Component {
    constructor() {
        super(...arguments);
        this.warning = react_2.default.createRef();
        this.state = {
            title: this.props.title,
            copyOnSave: Boolean(this.props.initialCopyOnSave),
            isTitleDuplicateConfirmed: false,
            hasTitleDuplicate: false,
            isLoading: false,
            visualizationDescription: this.props.description ? this.props.description : '',
        };
        this.renderViewDescription = () => {
            if (!this.props.showDescription) {
                return;
            }
            return (react_2.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.descriptionLabel", defaultMessage: "Description" }) },
                react_2.default.createElement(eui_1.EuiTextArea, { "data-test-subj": "viewDescription", value: this.state.visualizationDescription, onChange: this.onDescriptionChange })));
        };
        this.onDescriptionChange = (event) => {
            this.setState({
                visualizationDescription: event.target.value,
            });
        };
        this.onTitleDuplicate = () => {
            this.setState({
                isLoading: false,
                isTitleDuplicateConfirmed: true,
                hasTitleDuplicate: true,
            });
            if (this.warning.current) {
                this.warning.current.focus();
            }
        };
        this.saveSavedObject = async () => {
            if (this.state.isLoading) {
                // ignore extra clicks
                return;
            }
            this.setState({
                isLoading: true,
            });
            await this.props.onSave({
                newTitle: this.state.title,
                newCopyOnSave: this.state.copyOnSave,
                isTitleDuplicateConfirmed: this.state.isTitleDuplicateConfirmed,
                onTitleDuplicate: this.onTitleDuplicate,
                newDescription: this.state.visualizationDescription,
            });
        };
        this.onTitleChange = (event) => {
            this.setState({
                title: event.target.value,
                isTitleDuplicateConfirmed: false,
                hasTitleDuplicate: false,
            });
        };
        this.onCopyOnSaveChange = (event) => {
            this.setState({
                copyOnSave: event.target.checked,
            });
        };
        this.onFormSubmit = (event) => {
            event.preventDefault();
            this.saveSavedObject();
        };
        this.renderConfirmButton = () => {
            const { isLoading, title } = this.state;
            let confirmLabel = i18n_1.i18n.translate('savedObjects.saveModal.saveButtonLabel', {
                defaultMessage: 'Save',
            });
            if (this.props.confirmButtonLabel) {
                confirmLabel = this.props.confirmButtonLabel;
            }
            return (react_2.default.createElement(eui_1.EuiButton, { fill: true, "data-test-subj": "confirmSaveSavedObjectButton", isLoading: isLoading, isDisabled: title.length === 0, type: "submit" }, confirmLabel));
        };
        this.renderDuplicateTitleCallout = (duplicateWarningId) => {
            if (!this.state.hasTitleDuplicate) {
                return;
            }
            return (react_2.default.createElement(react_2.default.Fragment, null,
                react_2.default.createElement("div", { ref: this.warning, tabIndex: -1 },
                    react_2.default.createElement(eui_1.EuiCallOut, { title: react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.duplicateTitleLabel", defaultMessage: "A {objectType} with the title '{title}' already exists", values: { objectType: this.props.objectType, title: this.state.title } }), color: "warning", "data-test-subj": "titleDupicateWarnMsg", id: duplicateWarningId },
                        react_2.default.createElement("p", null,
                            react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.duplicateTitleDescription", defaultMessage: "Clicking {confirmSaveLabel} will save the {objectType} with this duplicate title.", values: {
                                    objectType: this.props.objectType,
                                    confirmSaveLabel: (react_2.default.createElement("strong", null, this.props.confirmButtonLabel
                                        ? this.props.confirmButtonLabel
                                        : i18n_1.i18n.translate('savedObjects.saveModal.saveButtonLabel', {
                                            defaultMessage: 'Save',
                                        }))),
                                } })))),
                react_2.default.createElement(eui_1.EuiSpacer, null)));
        };
        this.renderCopyOnSave = () => {
            if (!this.props.showCopyOnSave) {
                return;
            }
            return (react_2.default.createElement(react_2.default.Fragment, null,
                react_2.default.createElement(eui_1.EuiSwitch, { "data-test-subj": "saveAsNewCheckbox", checked: this.state.copyOnSave, onChange: this.onCopyOnSaveChange, label: react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.saveAsNewLabel", defaultMessage: "Save as new {objectType}", values: { objectType: this.props.objectType } }) }),
                react_2.default.createElement(eui_1.EuiSpacer, null)));
        };
    }
    render() {
        const { isTitleDuplicateConfirmed, hasTitleDuplicate, title } = this.state;
        const duplicateWarningId = generateId();
        return (react_2.default.createElement(eui_1.EuiOverlayMask, null,
            react_2.default.createElement("form", { onSubmit: this.onFormSubmit },
                react_2.default.createElement(eui_1.EuiModal, { "data-test-subj": "savedObjectSaveModal", className: "kbnSavedObjectSaveModal", onClose: this.props.onClose },
                    react_2.default.createElement(eui_1.EuiModalHeader, null,
                        react_2.default.createElement(eui_1.EuiModalHeaderTitle, null,
                            react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.saveTitle", defaultMessage: "Save {objectType}", values: { objectType: this.props.objectType } }))),
                    react_2.default.createElement(eui_1.EuiModalBody, null,
                        this.renderDuplicateTitleCallout(duplicateWarningId),
                        react_2.default.createElement(eui_1.EuiForm, null,
                            !this.props.showDescription && this.props.description && (react_2.default.createElement(eui_1.EuiFormRow, null,
                                react_2.default.createElement(eui_2.EuiText, { color: "subdued" }, this.props.description))),
                            this.renderCopyOnSave(),
                            react_2.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.titleLabel", defaultMessage: "Title" }) },
                                react_2.default.createElement(eui_1.EuiFieldText, { fullWidth: true, autoFocus: true, "data-test-subj": "savedObjectTitle", value: title, onChange: this.onTitleChange, isInvalid: (!isTitleDuplicateConfirmed && hasTitleDuplicate) || title.length === 0, "aria-describedby": this.state.hasTitleDuplicate ? duplicateWarningId : undefined })),
                            this.renderViewDescription(),
                            typeof this.props.options === 'function'
                                ? this.props.options(this.state)
                                : this.props.options)),
                    react_2.default.createElement(eui_1.EuiModalFooter, null,
                        react_2.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "saveCancelButton", onClick: this.props.onClose },
                            react_2.default.createElement(react_1.FormattedMessage, { id: "savedObjects.saveModal.cancelButtonLabel", defaultMessage: "Cancel" })),
                        this.renderConfirmButton())))));
    }
}
exports.SavedObjectSaveModal = SavedObjectSaveModal;
