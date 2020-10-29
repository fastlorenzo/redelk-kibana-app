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
exports.LongQueryNotification = exports.getLongQueryNotification = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../../kibana_react/public");
function getLongQueryNotification(props) {
    return public_1.toMountPoint(react_2.default.createElement(LongQueryNotification, { application: props.application }));
}
exports.getLongQueryNotification = getLongQueryNotification;
function LongQueryNotification(props) {
    return (react_2.default.createElement("div", null,
        react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.longQueryMessage", defaultMessage: "With an upgraded license, you can ensure requests have enough time to complete." }),
        react_2.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_2.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", gutterSize: "s" },
            react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_2.default.createElement(eui_1.EuiButton, { size: "s", onClick: async () => {
                        await props.application.navigateToApp('management/stack/license_management');
                    } },
                    react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.licenseOptions", defaultMessage: "Go to license options" }))))));
}
exports.LongQueryNotification = LongQueryNotification;
