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
exports.setupUrlOverflowDetection = exports.URL_WARNING_LENGTH = exports.URL_MAX_LENGTH = exports.IS_IE = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const utils_1 = require("../../utils");
const IE_REGEX = /(; ?MSIE |Edge\/\d|Trident\/[\d+\.]+;.*rv:*11\.\d+)/;
exports.IS_IE = IE_REGEX.test(window.navigator.userAgent);
/**
 * The max URL length allowed by the current browser. Should be used to display warnings to users when query parameters
 * cause URL to exceed this limit.
 * @public
 */
exports.URL_MAX_LENGTH = exports.IS_IE ? 2000 : 25000;
exports.URL_WARNING_LENGTH = exports.IS_IE ? 1000 : 24000;
const ERROR_ROUTE = '/app/error';
exports.setupUrlOverflowDetection = ({ basePath, history, toasts, uiSettings }) => history.listen((location) => {
    // Bail if storeInSessionStorage is set or we're already on the error page
    if (uiSettings.get('state:storeInSessionStorage') ||
        history.location.pathname.startsWith(ERROR_ROUTE)) {
        return;
    }
    const absUrl = history.createHref(location);
    const absUrlLength = absUrl.length;
    if (absUrlLength > exports.URL_MAX_LENGTH) {
        const href = history.createHref({
            pathname: ERROR_ROUTE,
            search: `errorType=urlOverflow`,
        });
        // Force the browser to reload so that any potentially unstable state is unloaded
        window.location.assign(href);
        // window.location.href = href;
        // window.location.reload();
    }
    else if (absUrlLength >= exports.URL_WARNING_LENGTH) {
        toasts.addWarning({
            title: i18n_1.i18n.translate('core.ui.errorUrlOverflow.bigUrlWarningNotificationTitle', {
                defaultMessage: 'The URL is big and Kibana might stop working',
            }),
            text: utils_1.mountReactNode(react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.bigUrlWarningNotificationMessage", defaultMessage: "Either enable the {storeInSessionStorageParam} option\n                    in {advancedSettingsLink} or simplify the onscreen visuals.", values: {
                    storeInSessionStorageParam: react_1.default.createElement("code", null, "state:storeInSessionStorage"),
                    advancedSettingsLink: (react_1.default.createElement("a", { href: basePath.prepend('/app/management/kibana/settings') },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.bigUrlWarningNotificationMessage.advancedSettingsLinkText", defaultMessage: "advanced settings" }))),
                } })),
        });
    }
});
