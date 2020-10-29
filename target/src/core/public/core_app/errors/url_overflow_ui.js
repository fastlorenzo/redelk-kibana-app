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
exports.UrlOverflowUi = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const url_overflow_1 = require("./url_overflow");
exports.UrlOverflowUi = ({ basePath }) => {
    return (react_1.default.createElement(eui_1.EuiText, { textAlign: "left" },
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.optionsToFixErrorDescription", defaultMessage: "Things to try:" })),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.optionsToFixError.enableOptionText", defaultMessage: "Enable the {storeInSessionStorageConfig} option in {kibanaSettingsLink}.", values: {
                        storeInSessionStorageConfig: react_1.default.createElement("code", null, "state:storeInSessionStorage"),
                        kibanaSettingsLink: (react_1.default.createElement("a", { href: basePath.prepend('/app/management/kibana/settings') },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.optionsToFixError.enableOptionText.advancedSettingsLinkText", defaultMessage: "Advanced Settings" }))),
                    } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.optionsToFixError.removeStuffFromDashboardText", defaultMessage: "Simplify the object you are editing by removing content or filters." })),
            url_overflow_1.IS_IE && (react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.errorUrlOverflow.optionsToFixError.doNotUseIEText", defaultMessage: "Upgrade to a modern browser. Every other supported browser we know of doesn't have this limit." }))))));
};
