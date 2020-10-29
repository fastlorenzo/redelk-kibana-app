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
exports.SidebarTitle = exports.LinkedSearch = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../kibana_react/public");
function LinkedSearch({ savedSearch, eventEmitter }) {
    const [showPopover, setShowPopover] = react_1.useState(false);
    const { services: { application }, } = public_1.useKibana();
    const closePopover = react_1.useCallback(() => setShowPopover(false), []);
    const onClickButtonLink = react_1.useCallback(() => setShowPopover((v) => !v), []);
    const onClickUnlikFromSavedSearch = react_1.useCallback(() => {
        setShowPopover(false);
        eventEmitter.emit('unlinkFromSavedSearch');
    }, [eventEmitter]);
    const onClickViewInDiscover = react_1.useCallback(() => {
        application.navigateToApp('discover', {
            path: `#/view/${savedSearch.id}`,
        });
    }, [application, savedSearch.id]);
    const linkButtonAriaLabel = i18n_1.i18n.translate('visDefaultEditor.sidebar.savedSearch.linkButtonAriaLabel', {
        defaultMessage: 'Link to saved search. Click to learn more or break link.',
    });
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center", className: "visEditorSidebar__titleContainer visEditorSidebar__linkedSearch", gutterSize: "xs", responsive: false },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiIcon, { type: "search" })),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "eui-textTruncate" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs", className: "eui-textTruncate" },
                react_1.default.createElement("h2", { title: i18n_1.i18n.translate('visDefaultEditor.sidebar.savedSearch.titleAriaLabel', {
                        defaultMessage: 'Saved search: {title}',
                        values: {
                            title: savedSearch.title,
                        },
                    }) }, savedSearch.title))),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiPopover, { anchorPosition: "downRight", button: react_1.default.createElement(eui_1.EuiToolTip, { content: linkButtonAriaLabel },
                    react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": linkButtonAriaLabel, "data-test-subj": "showUnlinkSavedSearchPopover", iconType: "link", onClick: onClickButtonLink })), isOpen: showPopover, closePopover: closePopover, panelPaddingSize: "s" },
                react_1.default.createElement(eui_1.EuiPopoverTitle, null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.savedSearch.popoverTitle", defaultMessage: "Linked to saved search" })),
                react_1.default.createElement("div", { style: { width: 260 } },
                    react_1.default.createElement(eui_1.EuiText, { size: "s" },
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "viewSavedSearch", flush: "left", onClick: onClickViewInDiscover, size: "xs" },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.savedSearch.goToDiscoverButtonText", defaultMessage: "View this search in Discover" }))),
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.savedSearch.popoverHelpText", defaultMessage: "Subsequent modifications to this saved search are reflected in the visualization. To disable automatic updates, remove the link." })),
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(eui_1.EuiButton, { color: "danger", "data-test-subj": "unlinkSavedSearch", fullWidth: true, onClick: onClickUnlikFromSavedSearch, size: "s" },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.sidebar.savedSearch.unlinkSavedSearchButtonText", defaultMessage: "Remove link to saved search" })))))))));
}
exports.LinkedSearch = LinkedSearch;
function SidebarTitle({ savedSearch, vis, isLinkedSearch, eventEmitter }) {
    return isLinkedSearch && savedSearch ? (react_1.default.createElement(LinkedSearch, { savedSearch: savedSearch, eventEmitter: eventEmitter })) : vis.type.options.showIndexSelection ? (react_1.default.createElement(eui_1.EuiTitle, { size: "xs", className: "visEditorSidebar__titleContainer eui-textTruncate" },
        react_1.default.createElement("h2", { title: i18n_1.i18n.translate('visDefaultEditor.sidebar.indexPatternAriaLabel', {
                defaultMessage: 'Index pattern: {title}',
                values: {
                    title: vis.data.indexPattern.title,
                },
            }) }, vis.data.indexPattern.title))) : (react_1.default.createElement("div", { className: "visEditorSidebar__indexPatternPlaceholder" }));
}
exports.SidebarTitle = SidebarTitle;
