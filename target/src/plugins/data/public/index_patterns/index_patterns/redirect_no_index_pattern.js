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
exports.onRedirectNoIndexPattern = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../../../kibana_react/public");
let bannerId;
exports.onRedirectNoIndexPattern = (capabilities, navigateToApp, overlays) => () => {
    const canManageIndexPatterns = capabilities.management.kibana.indexPatterns;
    const redirectTarget = canManageIndexPatterns ? '/management/kibana/indexPatterns' : '/home';
    let timeoutId;
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    const bannerMessage = i18n_1.i18n.translate('data.indexPatterns.ensureDefaultIndexPattern.bannerLabel', {
        defaultMessage: "In order to visualize and explore data in Kibana, you'll need to create an index pattern to retrieve data from Elasticsearch.",
    });
    // Avoid being hostile to new users who don't have an index pattern setup yet
    // give them a friendly info message instead of a terse error message
    bannerId = overlays.banners.replace(bannerId, public_1.toMountPoint(react_1.default.createElement(eui_1.EuiCallOut, { color: "warning", iconType: "iInCircle", title: bannerMessage })));
    // hide the message after the user has had a chance to acknowledge it -- so it doesn't permanently stick around
    timeoutId = setTimeout(() => {
        overlays.banners.remove(bannerId);
        timeoutId = undefined;
    }, 15000);
    if (redirectTarget === '/home') {
        navigateToApp('home');
    }
    else {
        navigateToApp('management', {
            path: `/kibana/indexPatterns?bannerMessage=${bannerMessage}`,
        });
    }
    // return never-resolving promise to stop resolving and wait for the url change
    return new Promise(() => { });
};
