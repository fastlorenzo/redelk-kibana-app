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
exports.FilterOptions = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = require("react");
const react_3 = tslib_1.__importDefault(require("react"));
class FilterOptionsUI extends react_2.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isPopoverOpen: false,
        };
        this.togglePopover = () => {
            this.setState((prevState) => ({
                isPopoverOpen: !prevState.isPopoverOpen,
            }));
        };
        this.closePopover = () => {
            this.setState({ isPopoverOpen: false });
        };
    }
    render() {
        const panelTree = {
            id: 0,
            items: [
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.enableAllFiltersButtonLabel',
                        defaultMessage: 'Enable all',
                    }),
                    icon: 'eye',
                    onClick: () => {
                        this.closePopover();
                        this.props.onEnableAll();
                    },
                    'data-test-subj': 'enableAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.disableAllFiltersButtonLabel',
                        defaultMessage: 'Disable all',
                    }),
                    icon: 'eyeClosed',
                    onClick: () => {
                        this.closePopover();
                        this.props.onDisableAll();
                    },
                    'data-test-subj': 'disableAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.pinAllFiltersButtonLabel',
                        defaultMessage: 'Pin all',
                    }),
                    icon: 'pin',
                    onClick: () => {
                        this.closePopover();
                        this.props.onPinAll();
                    },
                    'data-test-subj': 'pinAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.unpinAllFiltersButtonLabel',
                        defaultMessage: 'Unpin all',
                    }),
                    icon: 'pin',
                    onClick: () => {
                        this.closePopover();
                        this.props.onUnpinAll();
                    },
                    'data-test-subj': 'unpinAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.invertNegatedFiltersButtonLabel',
                        defaultMessage: 'Invert inclusion',
                    }),
                    icon: 'invert',
                    onClick: () => {
                        this.closePopover();
                        this.props.onToggleAllNegated();
                    },
                    'data-test-subj': 'invertInclusionAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.invertDisabledFiltersButtonLabel',
                        defaultMessage: 'Invert enabled/disabled',
                    }),
                    icon: 'eye',
                    onClick: () => {
                        this.closePopover();
                        this.props.onToggleAllDisabled();
                    },
                    'data-test-subj': 'invertEnableDisableAllFilters',
                },
                {
                    name: this.props.intl.formatMessage({
                        id: 'data.filter.options.deleteAllFiltersButtonLabel',
                        defaultMessage: 'Remove all',
                    }),
                    icon: 'trash',
                    onClick: () => {
                        this.closePopover();
                        this.props.onRemoveAll();
                    },
                    'data-test-subj': 'removeAllFilters',
                },
            ],
        };
        return (react_3.default.createElement(eui_1.EuiPopover, { id: "popoverForAllFilters", className: "globalFilterGroup__allFiltersPopover", isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, button: react_3.default.createElement(eui_1.EuiButtonIcon, { onClick: this.togglePopover, iconType: "filter", "aria-label": this.props.intl.formatMessage({
                    id: 'data.filter.options.changeAllFiltersButtonLabel',
                    defaultMessage: 'Change all filters',
                }), title: this.props.intl.formatMessage({
                    id: 'data.filter.options.changeAllFiltersButtonLabel',
                    defaultMessage: 'Change all filters',
                }), "data-test-subj": "showFilterActions" }), anchorPosition: "rightUp", panelPaddingSize: "none", withTitle: true, repositionOnScroll: true },
            react_3.default.createElement(eui_1.EuiPopoverTitle, null,
                react_3.default.createElement(react_1.FormattedMessage, { id: "data.filter.searchBar.changeAllFiltersTitle", defaultMessage: "Change all filters" })),
            react_3.default.createElement(eui_1.EuiContextMenu, { initialPanelId: 0, panels: [panelTree] })));
    }
}
exports.FilterOptions = react_1.injectI18n(FilterOptionsUI);
