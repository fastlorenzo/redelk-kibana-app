"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewTableRow = void 0;
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
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importDefault(require("react"));
const table_row_btn_filter_add_1 = require("./table_row_btn_filter_add");
const table_row_btn_filter_remove_1 = require("./table_row_btn_filter_remove");
const table_row_btn_toggle_column_1 = require("./table_row_btn_toggle_column");
const table_row_btn_collapse_1 = require("./table_row_btn_collapse");
const table_row_btn_filter_exists_1 = require("./table_row_btn_filter_exists");
const table_row_icon_no_mapping_1 = require("./table_row_icon_no_mapping");
const table_row_icon_underscore_1 = require("./table_row_icon_underscore");
const field_name_1 = require("../field_name/field_name");
function DocViewTableRow({ field, fieldMapping, fieldType, displayNoMappingWarning, displayUnderscoreWarning, isCollapsible, isCollapsed, isColumnActive, onFilter, onToggleCollapse, onToggleColumn, value, valueRaw, }) {
    const valueClassName = classnames_1.default({
        kbnDocViewer__value: true,
        'truncate-by-height': isCollapsible && isCollapsed,
    });
    return (react_1.default.createElement("tr", { key: field, "data-test-subj": `tableDocViewRow-${field}` },
        typeof onFilter === 'function' && (react_1.default.createElement("td", { className: "kbnDocViewer__buttons" },
            react_1.default.createElement(table_row_btn_filter_add_1.DocViewTableRowBtnFilterAdd, { disabled: !fieldMapping || !fieldMapping.filterable, onClick: () => onFilter(fieldMapping, valueRaw, '+') }),
            react_1.default.createElement(table_row_btn_filter_remove_1.DocViewTableRowBtnFilterRemove, { disabled: !fieldMapping || !fieldMapping.filterable, onClick: () => onFilter(fieldMapping, valueRaw, '-') }),
            typeof onToggleColumn === 'function' && (react_1.default.createElement(table_row_btn_toggle_column_1.DocViewTableRowBtnToggleColumn, { active: isColumnActive, onClick: onToggleColumn })),
            react_1.default.createElement(table_row_btn_filter_exists_1.DocViewTableRowBtnFilterExists, { disabled: !fieldMapping || !fieldMapping.filterable, onClick: () => onFilter('_exists_', field, '+'), scripted: fieldMapping && fieldMapping.scripted }))),
        react_1.default.createElement("td", { className: "kbnDocViewer__field" },
            react_1.default.createElement(field_name_1.FieldName, { fieldName: field, fieldType: fieldType, fieldIconProps: { fill: 'none', color: 'gray' }, scripted: Boolean(fieldMapping?.scripted) })),
        react_1.default.createElement("td", null,
            isCollapsible && (react_1.default.createElement(table_row_btn_collapse_1.DocViewTableRowBtnCollapse, { onClick: onToggleCollapse, isCollapsed: isCollapsed })),
            displayUnderscoreWarning && react_1.default.createElement(table_row_icon_underscore_1.DocViewTableRowIconUnderscore, null),
            displayNoMappingWarning && react_1.default.createElement(table_row_icon_no_mapping_1.DocViewTableRowIconNoMapping, null),
            react_1.default.createElement("div", { className: valueClassName, "data-test-subj": `tableDocViewRow-${field}-value`, 
                /*
                 * Justification for dangerouslySetInnerHTML:
                 * We just use values encoded by our field formatters
                 */
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML: { __html: value } }))));
}
exports.DocViewTableRow = DocViewTableRow;
