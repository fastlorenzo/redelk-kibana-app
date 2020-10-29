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
exports.RenderingService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_2 = require("@kbn/i18n/react");
const app_containers_1 = require("./app_containers");
/**
 * Renders all Core UI in a single React tree.
 *
 * @internalRemarks Currently this only renders Chrome UI. Notifications and
 * Overlays UI should be moved here as well.
 *
 * @returns a DOM element for the legacy platform to render into.
 *
 * @internal
 */
class RenderingService {
    start({ application, chrome, injectedMetadata, overlays, targetDomElement, }) {
        const chromeUi = chrome.getHeaderComponent();
        const appUi = application.getComponent();
        const bannerUi = overlays.banners.getComponent();
        const legacyMode = injectedMetadata.getLegacyMode();
        const legacyRef = legacyMode ? react_1.default.createRef() : null;
        react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement("div", { className: "content", "data-test-subj": "kibanaChrome" },
                chromeUi,
                !legacyMode && (react_1.default.createElement(app_containers_1.AppWrapper, { "chromeVisible$": chrome.getIsVisible$() },
                    react_1.default.createElement("div", { className: "app-wrapper-panel" },
                        react_1.default.createElement("div", { id: "globalBannerList" }, bannerUi),
                        react_1.default.createElement(app_containers_1.AppContainer, { "classes$": chrome.getApplicationClasses$() }, appUi)))),
                legacyMode && react_1.default.createElement("div", { ref: legacyRef }))), targetDomElement);
        return {
            // When in legacy mode, return legacy div, otherwise undefined.
            legacyTargetDomElement: legacyRef ? legacyRef.current : undefined,
        };
    }
}
exports.RenderingService = RenderingService;
