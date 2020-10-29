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
exports.OptedInNoticeBanner = void 0;
const tslib_1 = require("tslib");
/* eslint @elastic/eui/href-or-on-click:0 */
const React = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const constants_1 = require("../../common/constants");
class OptedInNoticeBanner extends React.PureComponent {
    render() {
        const { onSeenBanner } = this.props;
        const bannerTitle = i18n_1.i18n.translate('telemetry.telemetryOptedInNoticeTitle', {
            defaultMessage: 'Help us improve the Elastic Stack',
        });
        return (React.createElement(eui_1.EuiCallOut, { title: bannerTitle },
            React.createElement(react_1.FormattedMessage, { id: "telemetry.telemetryOptedInNoticeDescription", defaultMessage: "To learn about how usage data helps us manage and improve our products and services, see our {privacyStatementLink}. To stop collection, {disableLink}.", values: {
                    privacyStatementLink: (React.createElement(eui_1.EuiLink, { onClick: onSeenBanner, href: constants_1.PRIVACY_STATEMENT_URL, target: "_blank", rel: "noopener" },
                        React.createElement(react_1.FormattedMessage, { id: "telemetry.telemetryOptedInPrivacyStatement", defaultMessage: "Privacy Statement" }))),
                    disableLink: (React.createElement(eui_1.EuiLink, { href: constants_1.PATH_TO_ADVANCED_SETTINGS, onClick: onSeenBanner },
                        React.createElement(react_1.FormattedMessage, { id: "telemetry.telemetryOptedInDisableUsage", defaultMessage: "disable usage data here" }))),
                } }),
            React.createElement(eui_1.EuiSpacer, { size: "s" }),
            React.createElement(eui_1.EuiButton, { size: "s", onClick: onSeenBanner },
                React.createElement(react_1.FormattedMessage, { id: "telemetry.telemetryOptedInDismissMessage", defaultMessage: "Dismiss" }))));
    }
}
exports.OptedInNoticeBanner = OptedInNoticeBanner;
