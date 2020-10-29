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
exports.UserBannerService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_markdown_1 = tslib_1.__importDefault(require("react-markdown"));
const operators_1 = require("rxjs/operators");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
/**
 * Sets up the custom banner that can be specified in advanced settings.
 * @internal
 */
class UserBannerService {
    start({ banners, i18n, uiSettings }) {
        let id;
        let timeout;
        const dismiss = () => {
            banners.remove(id);
            clearTimeout(timeout);
        };
        const updateBanner = () => {
            const content = uiSettings.get('notifications:banner');
            const lifetime = uiSettings.get('notifications:lifetime:banner');
            if (typeof content !== 'string' || content.length === 0 || typeof lifetime !== 'number') {
                dismiss();
                return;
            }
            id = banners.replace(id, (el) => {
                react_dom_1.default.render(react_1.default.createElement(i18n.Context, null,
                    react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.overlays.banner.attentionTitle", defaultMessage: "Attention" }), iconType: "help" },
                        react_1.default.createElement(react_markdown_1.default, { renderers: { root: react_1.Fragment } }, content.trim()),
                        react_1.default.createElement(eui_1.EuiButton, { type: "primary", size: "s", onClick: () => banners.remove(id) },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.overlays.banner.closeButtonLabel", defaultMessage: "Close" })))), el);
                timeout = setTimeout(dismiss, lifetime);
                return () => react_dom_1.default.unmountComponentAtNode(el);
            }, 100);
        };
        updateBanner();
        this.settingsSubscription = uiSettings
            .getUpdate$()
            .pipe(operators_1.filter(({ key }) => key === 'notifications:banner' || key === 'notifications:lifetime:banner'))
            .subscribe(() => updateBanner());
    }
    stop() {
        if (this.settingsSubscription) {
            this.settingsSubscription.unsubscribe();
            this.settingsSubscription = undefined;
        }
    }
}
exports.UserBannerService = UserBannerService;
