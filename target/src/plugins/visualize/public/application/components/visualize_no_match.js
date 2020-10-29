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
exports.VisualizeNoMatch = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../kibana_react/public");
const visualize_constants_1 = require("../visualize_constants");
let bannerId;
exports.VisualizeNoMatch = () => {
    const { services } = public_1.useKibana();
    react_1.useEffect(() => {
        services.restorePreviousUrl();
        const { navigated } = services.kibanaLegacy.navigateToLegacyKibanaUrl(services.history.location.pathname);
        if (!navigated) {
            const bannerMessage = i18n_1.i18n.translate('visualize.noMatchRoute.bannerTitleText', {
                defaultMessage: 'Page not found',
            });
            bannerId = services.overlays.banners.replace(bannerId, public_1.toMountPoint(react_1.default.createElement(eui_1.EuiCallOut, { color: "warning", iconType: "iInCircle", title: bannerMessage },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visualize.noMatchRoute.bannerText", defaultMessage: "Visualize application doesn't recognize this route: {route}.", values: {
                            route: (react_1.default.createElement(eui_1.EuiLink, { href: window.location.href }, services.history.location.pathname)),
                        } })))));
            // hide the message after the user has had a chance to acknowledge it -- so it doesn't permanently stick around
            setTimeout(() => {
                services.overlays.banners.remove(bannerId);
            }, 15000);
            services.history.replace(visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH);
        }
    }, [services]);
    return null;
};
