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
exports.OptInBanner = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const opt_in_message_1 = require("./opt_in_message");
class OptInBanner extends React.PureComponent {
    render() {
        const { onChangeOptInClick } = this.props;
        const title = (React.createElement(react_1.FormattedMessage, { id: "telemetry.welcomeBanner.title", defaultMessage: "Help us improve the Elastic Stack" }));
        return (React.createElement(eui_1.EuiCallOut, { iconType: "questionInCircle", title: title },
            React.createElement(opt_in_message_1.OptInMessage, null),
            React.createElement(eui_1.EuiSpacer, { size: "s" }),
            React.createElement(eui_1.EuiFlexGroup, { gutterSize: "s", alignItems: "center" },
                React.createElement(eui_1.EuiFlexItem, { grow: false },
                    React.createElement(eui_1.EuiButton, { size: "s", "data-test-subj": "enable", onClick: () => onChangeOptInClick(true) },
                        React.createElement(react_1.FormattedMessage, { id: "telemetry.welcomeBanner.enableButtonLabel", defaultMessage: "Enable" }))),
                React.createElement(eui_1.EuiFlexItem, { grow: false },
                    React.createElement(eui_1.EuiButton, { size: "s", "data-test-subj": "disable", onClick: () => onChangeOptInClick(false) },
                        React.createElement(react_1.FormattedMessage, { id: "telemetry.welcomeBanner.disableButtonLabel", defaultMessage: "Disable" }))))));
    }
}
exports.OptInBanner = OptInBanner;
