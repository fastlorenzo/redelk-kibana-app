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
exports.CustomizePanelModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
class CustomizePanelModal extends react_1.Component {
    constructor(props) {
        super(props);
        this.updateTitle = (title) => {
            // An empty string will mean "use the default value", which is represented by setting
            // title to undefined (where as an empty string is actually used to indicate "hide title").
            this.setState({ title: title === '' ? undefined : title });
        };
        this.reset = () => {
            this.setState({ title: undefined });
        };
        this.onHideTitleToggle = () => {
            this.setState((prevState) => ({
                hideTitle: !prevState.hideTitle,
            }));
        };
        this.save = () => {
            if (this.state.hideTitle) {
                this.props.updateTitle('');
            }
            else {
                const newTitle = this.state.title === '' ? undefined : this.state.title;
                this.props.updateTitle(newTitle);
            }
        };
        this.state = {
            hideTitle: props.embeddable.getOutput().title === '',
            title: props.embeddable.getInput().title,
        };
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, { "data-test-subj": "customizePanelTitle" }, "Customize panel")),
            react_1.default.createElement(eui_1.EuiModalBody, null,
                react_1.default.createElement(eui_1.EuiFormRow, null,
                    react_1.default.createElement(eui_1.EuiSwitch, { checked: !this.state.hideTitle, "data-test-subj": "customizePanelHideTitle", id: "hideTitle", label: react_1.default.createElement(react_2.FormattedMessage, { defaultMessage: "Show panel title", id: "embeddableApi.customizePanel.modal.showTitle" }), onChange: this.onHideTitleToggle })),
                react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleFormRowLabel', {
                        defaultMessage: 'Panel title',
                    }) },
                    react_1.default.createElement(eui_1.EuiFieldText, { id: "panelTitleInput", "data-test-subj": "customEmbeddablePanelTitleInput", name: "min", type: "text", disabled: this.state.hideTitle, placeholder: this.props.embeddable.getOutput().defaultTitle, value: this.state.title || '', onChange: (e) => this.updateTitle(e.target.value), "aria-label": i18n_1.i18n.translate('embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleInputAriaLabel', {
                            defaultMessage: 'Enter a custom title for your panel',
                        }), append: react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "resetCustomEmbeddablePanelTitle", onClick: this.reset, disabled: this.state.hideTitle },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomDashboardButtonLabel", defaultMessage: "Reset" })) }))),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: () => this.props.updateTitle(this.props.embeddable.getOutput().title) },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "embeddableApi.customizePanel.modal.cancel", defaultMessage: "Cancel" })),
                react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "saveNewTitleButton", onClick: this.save, fill: true },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "embeddableApi.customizePanel.modal.saveButtonTitle", defaultMessage: "Save" })))));
    }
}
exports.CustomizePanelModal = CustomizePanelModal;
