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
exports.OptInMessage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const constants_1 = require("../../common/constants");
class OptInMessage extends React.PureComponent {
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(react_1.FormattedMessage, { id: "telemetry.telemetryBannerDescription", defaultMessage: "Want to help us improve the Elastic Stack? Data usage collection is currently disabled. Enabling data usage collection helps us manage and improve our products and services. See our {privacyStatementLink} for more details.", values: {
                    privacyStatementLink: (React.createElement(eui_1.EuiLink, { href: constants_1.PRIVACY_STATEMENT_URL, target: "_blank", rel: "noopener" },
                        React.createElement(react_1.FormattedMessage, { id: "telemetry.welcomeBanner.telemetryConfigDetailsDescription.telemetryPrivacyStatementLinkText", defaultMessage: "Privacy Statement" }))),
                } })));
    }
}
exports.OptInMessage = OptInMessage;
