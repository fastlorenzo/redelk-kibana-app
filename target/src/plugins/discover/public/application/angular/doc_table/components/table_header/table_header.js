"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableHeader = void 0;
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
// @ts-ignore
const table_header_column_1 = require("./table_header_column");
const helpers_1 = require("./helpers");
const get_default_sort_1 = require("../../lib/get_default_sort");
function TableHeader({ columns, defaultSortOrder, hideTimeColumn, indexPattern, isShortDots, onChangeSortOrder, onMoveColumn, onRemoveColumn, sortOrder, }) {
    const displayedColumns = helpers_1.getDisplayedColumns(columns, indexPattern, hideTimeColumn, isShortDots);
    return (react_1.default.createElement("tr", { "data-test-subj": "docTableHeader", className: "kbnDocTableHeader" },
        react_1.default.createElement("th", { style: { width: '24px' } }),
        displayedColumns.map((col) => {
            return (react_1.default.createElement(table_header_column_1.TableHeaderColumn, Object.assign({ key: col.name }, col, { sortOrder: sortOrder.length ? sortOrder : get_default_sort_1.getDefaultSort(indexPattern, defaultSortOrder), onMoveColumn: onMoveColumn, onRemoveColumn: onRemoveColumn, onChangeSortOrder: onChangeSortOrder })));
        })));
}
exports.TableHeader = TableHeader;
