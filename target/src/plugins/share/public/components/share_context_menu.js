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
exports.ShareContextMenu = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const url_panel_content_1 = require("./url_panel_content");
class ShareContextMenu extends react_1.Component {
    constructor() {
        super(...arguments);
        this.getPanels = () => {
            const panels = [];
            const menuItems = [];
            const permalinkPanel = {
                id: panels.length + 1,
                title: i18n_1.i18n.translate('share.contextMenu.permalinkPanelTitle', {
                    defaultMessage: 'Permalink',
                }),
                content: (react_1.default.createElement(url_panel_content_1.UrlPanelContent, { allowShortUrl: this.props.allowShortUrl, objectId: this.props.objectId, objectType: this.props.objectType, basePath: this.props.basePath, post: this.props.post, shareableUrl: this.props.shareableUrl })),
            };
            menuItems.push({
                name: i18n_1.i18n.translate('share.contextMenu.permalinksLabel', {
                    defaultMessage: 'Permalinks',
                }),
                icon: 'link',
                panel: permalinkPanel.id,
                sortOrder: 0,
            });
            panels.push(permalinkPanel);
            if (this.props.allowEmbed) {
                const embedPanel = {
                    id: panels.length + 1,
                    title: i18n_1.i18n.translate('share.contextMenu.embedCodePanelTitle', {
                        defaultMessage: 'Embed Code',
                    }),
                    content: (react_1.default.createElement(url_panel_content_1.UrlPanelContent, { allowShortUrl: this.props.allowShortUrl, isEmbedded: true, objectId: this.props.objectId, objectType: this.props.objectType, basePath: this.props.basePath, post: this.props.post, shareableUrl: this.props.shareableUrl, urlParamExtensions: this.props.embedUrlParamExtensions })),
                };
                panels.push(embedPanel);
                menuItems.push({
                    name: i18n_1.i18n.translate('share.contextMenu.embedCodeLabel', {
                        defaultMessage: 'Embed code',
                    }),
                    icon: 'console',
                    panel: embedPanel.id,
                    sortOrder: 0,
                });
            }
            this.props.shareMenuItems.forEach(({ shareMenuItem, panel }) => {
                const panelId = panels.length + 1;
                panels.push({
                    ...panel,
                    id: panelId,
                });
                menuItems.push({
                    ...shareMenuItem,
                    panel: panelId,
                });
            });
            if (menuItems.length > 1) {
                const topLevelMenuPanel = {
                    id: panels.length + 1,
                    title: i18n_1.i18n.translate('share.contextMenuTitle', {
                        defaultMessage: 'Share this {objectType}',
                        values: {
                            objectType: this.props.objectType,
                        },
                    }),
                    items: menuItems
                        // Sorts ascending on sort order first and then ascending on name
                        .sort((a, b) => {
                        const aSortOrder = a.sortOrder || 0;
                        const bSortOrder = b.sortOrder || 0;
                        if (aSortOrder > bSortOrder) {
                            return 1;
                        }
                        if (aSortOrder < bSortOrder) {
                            return -1;
                        }
                        if (a.name.toLowerCase().localeCompare(b.name.toLowerCase()) > 0) {
                            return 1;
                        }
                        return -1;
                    })
                        .map((menuItem) => {
                        menuItem['data-test-subj'] = `sharePanel-${menuItem.name.replace(' ', '')}`;
                        delete menuItem.sortOrder;
                        return menuItem;
                    }),
                };
                panels.push(topLevelMenuPanel);
            }
            const lastPanelIndex = panels.length - 1;
            const initialPanelId = panels[lastPanelIndex].id;
            return { panels, initialPanelId };
        };
    }
    render() {
        const { panels, initialPanelId } = this.getPanels();
        return (react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: initialPanelId, panels: panels, "data-test-subj": "shareContextMenu" })));
    }
}
exports.ShareContextMenu = ShareContextMenu;
