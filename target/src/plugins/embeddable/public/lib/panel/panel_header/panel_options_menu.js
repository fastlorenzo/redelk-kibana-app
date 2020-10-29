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
exports.PanelOptionsMenu = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
class PanelOptionsMenu extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.closePopover = () => {
            if (this.mounted) {
                this.setState({
                    isPopoverOpen: false,
                });
            }
        };
        this.toggleContextMenu = () => {
            if (!this.mounted)
                return;
            const after = () => {
                if (!this.state.isPopoverOpen)
                    return;
                this.setState({ actionContextMenuPanel: undefined });
                this.props
                    .getActionContextMenuPanel()
                    .then((actionContextMenuPanel) => {
                    if (!this.mounted)
                        return;
                    this.setState({ actionContextMenuPanel });
                })
                    .catch((error) => console.error(error)); // eslint-disable-line no-console
            };
            this.setState(({ isPopoverOpen }) => ({ isPopoverOpen: !isPopoverOpen }), after);
        };
        this.state = {
            actionContextMenuPanel: undefined,
            isPopoverOpen: false,
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.closeContextMenu) {
            return {
                ...state,
                isPopoverOpen: false,
            };
        }
        else {
            return state;
        }
    }
    async componentDidMount() {
        this.mounted = true;
        this.setState({ actionContextMenuPanel: undefined });
        const actionContextMenuPanel = await this.props.getActionContextMenuPanel();
        if (this.mounted) {
            this.setState({ actionContextMenuPanel });
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        const { isViewMode, title } = this.props;
        const enhancedAriaLabel = i18n_1.i18n.translate('embeddableApi.panel.optionsMenu.panelOptionsButtonEnhancedAriaLabel', {
            defaultMessage: 'Panel options for {title}',
            values: { title },
        });
        const ariaLabelWithoutTitle = i18n_1.i18n.translate('embeddableApi.panel.optionsMenu.panelOptionsButtonAriaLabel', {
            defaultMessage: 'Panel options',
        });
        const button = (react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: isViewMode ? 'boxesHorizontal' : 'gear', color: "text", className: "embPanel__optionsMenuButton", "aria-label": title ? enhancedAriaLabel : ariaLabelWithoutTitle, "data-test-subj": "embeddablePanelToggleMenuIcon", onClick: this.toggleContextMenu }));
        return (react_1.default.createElement(eui_1.EuiPopover, { className: "embPanel__optionsMenuPopover", button: button, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, panelPaddingSize: "none", anchorPosition: "downRight", "data-test-subj": this.state.isPopoverOpen
                ? 'embeddablePanelContextMenuOpen'
                : 'embeddablePanelContextMenuClosed', withTitle: true },
            react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: "mainMenu", panels: this.state.actionContextMenuPanel ? [this.state.actionContextMenuPanel] : [] })));
    }
}
exports.PanelOptionsMenu = PanelOptionsMenu;
