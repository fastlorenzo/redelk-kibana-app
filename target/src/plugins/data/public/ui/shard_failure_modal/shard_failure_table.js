"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShardFailureTable = void 0;
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
const react_1 = tslib_1.__importStar(require("react"));
// @ts-ignore
const eui_1 = require("@elastic/eui");
// @ts-ignore
const services_1 = require("@elastic/eui/lib/services");
const i18n_1 = require("@kbn/i18n");
const shard_failure_description_1 = require("./shard_failure_description");
const shard_failure_description_header_1 = require("./shard_failure_description_header");
function ShardFailureTable({ failures }) {
    const itemList = failures.map((failure, idx) => ({ ...{ id: String(idx) }, ...failure }));
    const initalMap = {};
    const [expandMap, setExpandMap] = react_1.useState(initalMap);
    const columns = [
        {
            align: services_1.RIGHT_ALIGNMENT,
            width: '40px',
            isExpander: true,
            render: (item) => {
                const failureSummeryText = shard_failure_description_header_1.getFailureSummaryText(item);
                const collapseLabel = i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tableRowCollapse', {
                    defaultMessage: 'Collapse {rowDescription}',
                    description: 'Collapse a row of a table with failures',
                    values: { rowDescription: failureSummeryText },
                });
                const expandLabel = i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tableRowExpand', {
                    defaultMessage: 'Expand {rowDescription}',
                    description: 'Expand a row of a table with failures',
                    values: { rowDescription: failureSummeryText },
                });
                return (react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => {
                        // toggle displaying the expanded view of the given list item
                        const map = Object.assign({}, expandMap);
                        if (map[item.id]) {
                            delete map[item.id];
                        }
                        else {
                            map[item.id] = react_1.default.createElement(shard_failure_description_1.ShardFailureDescription, Object.assign({}, item));
                        }
                        setExpandMap(map);
                    }, "aria-label": expandMap[item.id] ? collapseLabel : expandLabel, iconType: expandMap[item.id] ? 'arrowUp' : 'arrowDown' }));
            },
        },
        {
            field: 'shard',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tableColShard', {
                defaultMessage: 'Shard',
            }),
            sortable: true,
            truncateText: true,
            width: '80px',
        },
        {
            field: 'index',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tableColIndex', {
                defaultMessage: 'Index',
            }),
            sortable: true,
            truncateText: true,
        },
        {
            field: 'node',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tableColNode', {
                defaultMessage: 'Node',
            }),
            sortable: true,
            truncateText: true,
        },
        {
            field: 'reason.type',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tableColReason', {
                defaultMessage: 'Reason',
            }),
            truncateText: true,
        },
    ];
    return (react_1.default.createElement(eui_1.EuiInMemoryTable, { itemId: "id", items: itemList, columns: columns, pagination: true, sorting: {
            sort: {
                field: 'index',
                direction: 'desc',
            },
        }, itemIdToExpandedRowMap: expandMap }));
}
exports.ShardFailureTable = ShardFailureTable;
