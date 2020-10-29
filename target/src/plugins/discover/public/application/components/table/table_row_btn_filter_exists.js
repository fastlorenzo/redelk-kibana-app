"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewTableRowBtnFilterExists = void 0;
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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
function DocViewTableRowBtnFilterExists({ onClick, disabled = false, scripted = false, }) {
    const tooltipContent = disabled ? (scripted ? (react_1.default.createElement(react_2.FormattedMessage, { id: "discover.docViews.table.unableToFilterForPresenceOfScriptedFieldsTooltip", defaultMessage: "Unable to filter for presence of scripted fields" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "discover.docViews.table.unableToFilterForPresenceOfMetaFieldsTooltip", defaultMessage: "Unable to filter for presence of meta fields" }))) : (react_1.default.createElement(react_2.FormattedMessage, { id: "discover.docViews.table.filterForFieldPresentButtonTooltip", defaultMessage: "Filter for field present" }));
    return (react_1.default.createElement(eui_1.EuiToolTip, { content: tooltipContent },
        react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": i18n_1.i18n.translate('discover.docViews.table.filterForFieldPresentButtonAriaLabel', {
                defaultMessage: 'Filter for field present',
            }), onClick: onClick, className: "kbnDocViewer__actionButton", "data-test-subj": "addExistsFilterButton", disabled: disabled, iconType: 'indexOpen', iconSize: 's' })));
}
exports.DocViewTableRowBtnFilterExists = DocViewTableRowBtnFilterExists;
