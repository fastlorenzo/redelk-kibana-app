"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewTableRowIconNoMapping = void 0;
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
function DocViewTableRowIconNoMapping() {
    const ariaLabel = i18n_1.i18n.translate('discover.docViews.table.noCachedMappingForThisFieldAriaLabel', {
        defaultMessage: 'Warning',
    });
    const tooltipContent = i18n_1.i18n.translate('discover.docViews.table.noCachedMappingForThisFieldTooltip', {
        defaultMessage: 'No cached mapping for this field. Refresh field list from the Management > Index Patterns page',
    });
    return (react_1.default.createElement(eui_1.EuiIconTip, { "aria-label": ariaLabel, color: "warning", content: tooltipContent, iconProps: {
            className: 'kbnDocViewer__warning',
            'data-test-subj': 'noMappingWarning',
        }, size: "s", type: "alert" }));
}
exports.DocViewTableRowIconNoMapping = DocViewTableRowIconNoMapping;
