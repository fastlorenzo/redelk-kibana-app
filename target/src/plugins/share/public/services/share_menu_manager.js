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
exports.ShareMenuManager = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const share_context_menu_1 = require("../components/share_context_menu");
class ShareMenuManager {
    constructor() {
        this.isOpen = false;
        this.container = document.createElement('div');
        this.onClose = () => {
            react_dom_1.default.unmountComponentAtNode(this.container);
            this.isOpen = false;
        };
    }
    start(core, shareRegistry) {
        return {
            /**
             * Collects share menu items from registered providers and mounts the share context menu under
             * the given `anchorElement`. If the context menu is already opened, a call to this method closes it.
             * @param options
             */
            toggleShareContextMenu: (options) => {
                const menuItems = shareRegistry.getShareMenuItems({ ...options, onClose: this.onClose });
                this.toggleShareContextMenu({
                    ...options,
                    menuItems,
                    post: core.http.post,
                    basePath: core.http.basePath.get(),
                });
            },
        };
    }
    toggleShareContextMenu({ anchorElement, allowEmbed, allowShortUrl, objectId, objectType, sharingData, menuItems, shareableUrl, post, basePath, embedUrlParamExtensions, }) {
        if (this.isOpen) {
            this.onClose();
            return;
        }
        this.isOpen = true;
        document.body.appendChild(this.container);
        const element = (react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(eui_1.EuiWrappingPopover, { id: "sharePopover", button: anchorElement, isOpen: true, closePopover: this.onClose, panelPaddingSize: "none", withTitle: true, anchorPosition: "downLeft" },
                react_1.default.createElement(share_context_menu_1.ShareContextMenu, { allowEmbed: allowEmbed, allowShortUrl: allowShortUrl, objectId: objectId, objectType: objectType, shareMenuItems: menuItems, sharingData: sharingData, shareableUrl: shareableUrl, onClose: this.onClose, post: post, basePath: basePath, embedUrlParamExtensions: embedUrlParamExtensions }))));
        react_dom_1.default.render(element, this.container);
    }
}
exports.ShareMenuManager = ShareMenuManager;
