"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitsCounter = void 0;
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
const i18n_1 = require("@kbn/i18n");
const helpers_1 = require("../../helpers");
function HitsCounter({ hits, showResetButton, onResetQuery }) {
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s", className: "dscResultCount", responsive: false, justifyContent: "center", alignItems: "center" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, null,
                    react_1.default.createElement("strong", { "data-test-subj": "discoverQueryHits" }, helpers_1.formatNumWithCommas(hits)),
                    ' ',
                    react_1.default.createElement(react_2.FormattedMessage, { id: "discover.hitsPluralTitle", defaultMessage: "{hits, plural, one {hit} other {hits}}", values: {
                            hits,
                        } }))),
            showResetButton && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "refresh", "data-test-subj": "resetSavedSearch", onClick: onResetQuery, size: "s", "aria-label": i18n_1.i18n.translate('discover.reloadSavedSearchButton', {
                        defaultMessage: 'Reset search',
                    }) },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "discover.reloadSavedSearchButton", defaultMessage: "Reset search" })))))));
}
exports.HitsCounter = HitsCounter;
