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
exports.InspectorViewChooser = void 0;
const tslib_1 = require("tslib");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const eui_1 = require("@elastic/eui");
class InspectorViewChooser extends react_2.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isSelectorOpen: false,
        };
        this.toggleSelector = () => {
            this.setState((prev) => ({
                isSelectorOpen: !prev.isSelectorOpen,
            }));
        };
        this.closeSelector = () => {
            this.setState({
                isSelectorOpen: false,
            });
        };
        this.renderView = (view, index) => {
            return (react_2.default.createElement(eui_1.EuiContextMenuItem, { key: index, onClick: () => {
                    this.props.onViewSelected(view);
                    this.closeSelector();
                }, toolTipContent: view.help, toolTipPosition: "left", "data-test-subj": `inspectorViewChooser${view.title}` }, view.title));
        };
    }
    renderViewButton() {
        return (react_2.default.createElement(eui_1.EuiButtonEmpty, { size: "s", iconType: "arrowDown", iconSide: "right", onClick: this.toggleSelector, "data-test-subj": "inspectorViewChooser" },
            react_2.default.createElement(react_1.FormattedMessage, { id: "inspector.view", defaultMessage: "View: {viewName}", values: { viewName: this.props.selectedView.title } })));
    }
    renderSingleView() {
        return (react_2.default.createElement(eui_1.EuiToolTip, { position: "bottom", content: this.props.selectedView.help },
            react_2.default.createElement(react_1.FormattedMessage, { id: "inspector.view", defaultMessage: "View: {viewName}", values: { viewName: this.props.selectedView.title } })));
    }
    render() {
        const { views } = this.props;
        if (views.length < 2) {
            return this.renderSingleView();
        }
        const triggerButton = this.renderViewButton();
        return (react_2.default.createElement(eui_1.EuiPopover, { id: "inspectorViewChooser", ownFocus: true, button: triggerButton, isOpen: this.state.isSelectorOpen, closePopover: this.closeSelector, panelPaddingSize: "none", anchorPosition: "downRight", repositionOnScroll: true },
            react_2.default.createElement(eui_1.EuiContextMenuPanel, { items: views.map(this.renderView) })));
    }
}
exports.InspectorViewChooser = InspectorViewChooser;
InspectorViewChooser.propTypes = {
    views: prop_types_1.default.array.isRequired,
    onViewSelected: prop_types_1.default.func.isRequired,
    selectedView: prop_types_1.default.object.isRequired,
};
