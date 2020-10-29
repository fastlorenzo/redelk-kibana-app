"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverFieldDetails = void 0;
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const discover_field_bucket_1 = require("./discover_field_bucket");
const get_warnings_1 = require("./lib/get_warnings");
const kibana_services_1 = require("../../../kibana_services");
function DiscoverFieldDetails({ field, indexPattern, details, onAddFilter, }) {
    const warnings = get_warnings_1.getWarnings(field);
    return (react_1.default.createElement("div", { className: "dscFieldDetails" },
        !details.error && (react_1.default.createElement(eui_1.EuiText, { size: "xs" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.detailViews.topValuesInRecordsDescription", defaultMessage: "Top 5 values in" }),
            ' ',
            !indexPattern.metaFields.includes(field.name) && !field.scripted ? (react_1.default.createElement(eui_1.EuiLink, { onClick: () => onAddFilter('_exists_', field.name, '+') }, details.exists)) : (react_1.default.createElement("span", null, details.exists)),
            ' ',
            "/ ",
            details.total,
            ' ',
            react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.detailViews.recordsText", defaultMessage: "records" }))),
        details.error && react_1.default.createElement(eui_1.EuiText, { size: "xs" }, details.error),
        !details.error && (react_1.default.createElement("div", { style: { marginTop: '4px' } }, details.buckets.map((bucket, idx) => (react_1.default.createElement(discover_field_bucket_1.DiscoverFieldBucket, { key: `bucket${idx}`, bucket: bucket, field: field, onAddFilter: onAddFilter }))))),
        details.visualizeUrl && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiLink, { onClick: () => {
                    kibana_services_1.getServices().core.application.navigateToApp(details.visualizeUrl.app, {
                        path: details.visualizeUrl.path,
                    });
                }, className: "kuiButton kuiButton--secondary kuiButton--small kuiVerticalRhythmSmall", "data-test-subj": `fieldVisualize-${field.name}` },
                react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.detailViews.visualizeLinkText", defaultMessage: "Visualize" }),
                warnings.length > 0 && (react_1.default.createElement(eui_1.EuiIconTip, { type: "alert", color: "warning", content: warnings.join(' ') })))))));
}
exports.DiscoverFieldDetails = DiscoverFieldDetails;
