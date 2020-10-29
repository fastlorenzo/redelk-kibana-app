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
exports.DefaultEditorControls = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const react_use_1 = require("react-use");
const state_1 = require("./state");
function DefaultEditorControls({ applyChanges, isDirty, isInvalid, isTouched, dispatch, vis, }) {
    const { enableAutoApply } = vis.type.editorConfig;
    const [autoApplyEnabled, setAutoApplyEnabled] = react_1.useState(false);
    const toggleAutoApply = react_1.useCallback((e) => setAutoApplyEnabled(e.target.checked), []);
    const onClickDiscard = react_1.useCallback(() => dispatch(state_1.discardChanges(vis)), [dispatch, vis]);
    react_use_1.useDebounce(() => {
        if (autoApplyEnabled && isDirty) {
            applyChanges();
        }
    }, 300, [isDirty, autoApplyEnabled, applyChanges]);
    return (react_1.default.createElement("div", { className: "visEditorSidebar__controls" },
        !autoApplyEnabled && (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", gutterSize: "none", responsive: false },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "visualizeEditorResetButton", disabled: !isDirty, iconType: "cross", onClick: onClickDiscard, size: "s" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.discardChangesButtonLabel", defaultMessage: "Discard" }))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, isInvalid && isTouched ? (react_1.default.createElement(eui_1.EuiToolTip, { content: i18n_1.i18n.translate('visDefaultEditor.sidebar.errorButtonTooltip', {
                    defaultMessage: 'Errors in the highlighted fields need to be resolved.',
                }) },
                react_1.default.createElement(eui_1.EuiButton, { color: "danger", iconType: "alert", size: "s", disabled: true },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.updateChartButtonLabel", defaultMessage: "Update" })))) : (react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "visualizeEditorRenderButton", disabled: !isDirty, fill: true, iconType: "play", onClick: applyChanges, size: "s" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.updateChartButtonLabel", defaultMessage: "Update" })))))),
        enableAutoApply && (react_1.default.createElement(eui_1.EuiToolTip, { title: autoApplyEnabled
                ? i18n_1.i18n.translate('visDefaultEditor.sidebar.autoApplyChangesOnLabel', {
                    defaultMessage: 'Auto apply is on',
                })
                : i18n_1.i18n.translate('visDefaultEditor.sidebar.autoApplyChangesOffLabel', {
                    defaultMessage: 'Auto apply is off',
                }), content: i18n_1.i18n.translate('visDefaultEditor.sidebar.autoApplyChangesTooltip', {
                defaultMessage: 'Auto updates the visualization on every change.',
            }) },
            react_1.default.createElement(eui_1.EuiButtonToggle, { label: i18n_1.i18n.translate('visDefaultEditor.sidebar.autoApplyChangesAriaLabel', {
                    defaultMessage: 'Auto apply editor changes',
                }), className: "visEditorSidebar__autoApplyButton", "data-test-subj": "visualizeEditorAutoButton", fill: autoApplyEnabled, iconType: "refresh", isSelected: autoApplyEnabled, onChange: toggleAutoApply, size: "s", isIconOnly: true })))));
}
exports.DefaultEditorControls = DefaultEditorControls;
