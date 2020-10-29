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
exports.DataDownloadOptions = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const export_csv_1 = require("../lib/export_csv");
class DataDownloadOptions extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isPopoverOpen: false,
        };
        this.onTogglePopover = () => {
            this.setState((state) => ({
                isPopoverOpen: !state.isPopoverOpen,
            }));
        };
        this.closePopover = () => {
            this.setState({
                isPopoverOpen: false,
            });
        };
        this.exportCsv = (customParams = {}) => {
            let filename = this.props.title;
            if (!filename || filename.length === 0) {
                filename = i18n_1.i18n.translate('inspector.data.downloadOptionsUnsavedFilename', {
                    defaultMessage: 'unsaved',
                });
            }
            export_csv_1.exportAsCsv({
                filename: `${filename}.csv`,
                columns: this.props.columns,
                rows: this.props.rows,
                csvSeparator: this.props.csvSeparator,
                quoteValues: this.props.quoteValues,
                ...customParams,
            });
        };
        this.exportFormattedCsv = () => {
            this.exportCsv({
                valueFormatter: (item) => item.formatted,
            });
        };
        this.exportFormattedAsRawCsv = () => {
            this.exportCsv({
                valueFormatter: (item) => item.raw,
            });
        };
    }
    renderUnformattedDownload() {
        return (react_1.default.createElement(eui_1.EuiButton, { size: "s", onClick: this.exportCsv },
            react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.downloadCSVButtonLabel", defaultMessage: "Download CSV" })));
    }
    renderFormattedDownloads() {
        const button = (react_1.default.createElement(eui_1.EuiButton, { iconType: "arrowDown", iconSide: "right", size: "s", onClick: this.onTogglePopover },
            react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.downloadCSVToggleButtonLabel", defaultMessage: "Download CSV" })));
        const items = [
            react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "csv", onClick: this.exportFormattedCsv, toolTipContent: react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.formattedCSVButtonTooltip", defaultMessage: "Download the data in table format" }), toolTipPosition: "left" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.formattedCSVButtonLabel", defaultMessage: "Formatted CSV" })),
            react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "rawCsv", onClick: this.exportFormattedAsRawCsv, toolTipContent: react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.rawCSVButtonTooltip", defaultMessage: "Download the data as provided, for example, dates as timestamps" }), toolTipPosition: "left" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.rawCSVButtonLabel", defaultMessage: "Raw CSV" })),
        ];
        return (react_1.default.createElement(eui_1.EuiPopover, { id: "inspectorDownloadData", button: button, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, panelPaddingSize: "none", repositionOnScroll: true },
            react_1.default.createElement(eui_1.EuiContextMenuPanel, { className: "eui-textNoWrap", items: items })));
    }
    render() {
        return this.props.isFormatted
            ? this.renderFormattedDownloads()
            : this.renderUnformattedDownload();
    }
}
exports.DataDownloadOptions = DataDownloadOptions;
DataDownloadOptions.propTypes = {
    title: prop_types_1.default.string.isRequired,
    csvSeparator: prop_types_1.default.string.isRequired,
    quoteValues: prop_types_1.default.bool.isRequired,
    isFormatted: prop_types_1.default.bool,
    columns: prop_types_1.default.array,
    rows: prop_types_1.default.array,
};
