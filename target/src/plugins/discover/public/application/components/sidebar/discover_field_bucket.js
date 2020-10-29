"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverFieldBucket = void 0;
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
const i18n_1 = require("@kbn/i18n");
const string_progress_bar_1 = require("./string_progress_bar");
require("./discover_field_bucket.scss");
function DiscoverFieldBucket({ field, bucket, onAddFilter }) {
    const emptyTxt = i18n_1.i18n.translate('discover.fieldChooser.detailViews.emptyStringText', {
        defaultMessage: 'Empty string',
    });
    const addLabel = i18n_1.i18n.translate('discover.fieldChooser.detailViews.filterValueButtonAriaLabel', {
        defaultMessage: 'Filter for {field}: "{value}"',
        values: { value: bucket.value, field: field.name },
    });
    const removeLabel = i18n_1.i18n.translate('discover.fieldChooser.detailViews.filterOutValueButtonAriaLabel', {
        defaultMessage: 'Filter out {field}: "{value}"',
        values: { value: bucket.value, field: field.name },
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", responsive: false, gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { className: "dscFieldDetails__barContainer", grow: 1 },
                react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", gutterSize: "xs", responsive: false },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: 1, className: "eui-textTruncate" },
                        react_1.default.createElement(eui_1.EuiText, { title: bucket.display === ''
                                ? emptyTxt
                                : `${bucket.display}: ${bucket.count} (${bucket.percent}%)`, size: "xs", className: "eui-textTruncate" }, bucket.display === '' ? emptyTxt : bucket.display)),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "eui-textTruncate" },
                        react_1.default.createElement(eui_1.EuiText, { color: "secondary", size: "xs", className: "eui-textTruncate" },
                            bucket.percent,
                            "%"))),
                react_1.default.createElement(string_progress_bar_1.StringFieldProgressBar, { value: bucket.value, percent: bucket.percent, count: bucket.count })),
            field.filterable && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiButtonIcon, { iconSize: "s", iconType: "plusInCircle", onClick: () => onAddFilter(field, bucket.value, '+'), "aria-label": addLabel, "data-test-subj": `plus-${field.name}-${bucket.value}`, style: {
                            minHeight: 'auto',
                            minWidth: 'auto',
                            paddingRight: 2,
                            paddingLeft: 2,
                            paddingTop: 0,
                            paddingBottom: 0,
                        } }),
                    react_1.default.createElement(eui_1.EuiButtonIcon, { iconSize: "s", iconType: "minusInCircle", onClick: () => onAddFilter(field, bucket.value, '-'), "aria-label": removeLabel, "data-test-subj": `minus-${field.name}-${bucket.value}`, style: {
                            minHeight: 'auto',
                            minWidth: 'auto',
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingRight: 2,
                            paddingLeft: 2,
                        } }))))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
}
exports.DiscoverFieldBucket = DiscoverFieldBucket;
