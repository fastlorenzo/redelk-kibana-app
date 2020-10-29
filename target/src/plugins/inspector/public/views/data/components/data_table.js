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
exports.DataTableFormat = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const download_options_1 = require("./download_options");
const public_1 = require("../../../../../share/public");
class DataTableFormat extends react_1.Component {
    constructor() {
        super(...arguments);
        this.csvSeparator = this.props.uiSettings.get(public_1.CSV_SEPARATOR_SETTING, ',');
        this.quoteValues = this.props.uiSettings.get(public_1.CSV_QUOTE_VALUES_SETTING, true);
        this.state = {};
    }
    static renderCell(dataColumn, value, isFormatted = false) {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: "s", alignItems: "center" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, isFormatted ? value.formatted : value),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: "none", alignItems: "center" },
                    dataColumn.filter && (react_1.default.createElement(eui_1.EuiToolTip, { position: "bottom", content: react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.filterForValueButtonTooltip", defaultMessage: "Filter for value" }) },
                        react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "plusInCircle", color: "text", "aria-label": i18n_1.i18n.translate('inspector.data.filterForValueButtonAriaLabel', {
                                defaultMessage: 'Filter for value',
                            }), "data-test-subj": "filterForInspectorCellValue", className: "insDataTableFormat__filter", onClick: () => dataColumn.filter(value) }))),
                    dataColumn.filterOut && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiToolTip, { position: "bottom", content: react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.filterOutValueButtonTooltip", defaultMessage: "Filter out value" }) },
                            react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "minusInCircle", color: "text", "aria-label": i18n_1.i18n.translate('inspector.data.filterOutValueButtonAriaLabel', {
                                    defaultMessage: 'Filter out value',
                                }), "data-test-subj": "filterOutInspectorCellValue", className: "insDataTableFormat__filter", onClick: () => dataColumn.filterOut(value) }))))))));
    }
    static getDerivedStateFromProps({ data, isFormatted }) {
        if (!data) {
            return {
                columns: null,
                rows: null,
            };
        }
        const columns = data.columns.map((dataColumn) => ({
            name: dataColumn.name,
            field: dataColumn.field,
            sortable: isFormatted ? (row) => row[dataColumn.field].raw : true,
            render: (value) => DataTableFormat.renderCell(dataColumn, value, isFormatted),
        }));
        return { columns, rows: data.rows };
    }
    render() {
        const { columns, rows } = this.state;
        const pagination = {
            pageSizeOptions: [10, 20, 50],
            initialPageSize: 20,
        };
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: true }),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(download_options_1.DataDownloadOptions, { isFormatted: this.props.isFormatted, title: this.props.exportTitle, csvSeparator: this.csvSeparator, quoteValues: this.quoteValues, columns: columns, rows: rows }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiInMemoryTable, { className: "insDataTableFormat__table", "data-test-subj": "inspectorTable", columns: columns, items: rows, sorting: true, pagination: pagination })));
    }
}
exports.DataTableFormat = DataTableFormat;
DataTableFormat.propTypes = {
    data: prop_types_1.default.object.isRequired,
    exportTitle: prop_types_1.default.string.isRequired,
    uiSettings: prop_types_1.default.object.isRequired,
    isFormatted: prop_types_1.default.bool,
};
