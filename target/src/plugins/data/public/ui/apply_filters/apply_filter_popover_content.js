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
exports.ApplyFiltersPopoverContent = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importStar(require("react"));
const common_1 = require("../../../common");
const filter_bar_1 = require("../filter_bar");
const query_1 = require("../../query");
class ApplyFiltersPopoverContent extends react_2.Component {
    constructor(props) {
        super(props);
        this.isFilterSelected = (i) => {
            return this.state.isFilterSelected[i];
        };
        this.toggleFilterSelected = (i) => {
            const isFilterSelected = [...this.state.isFilterSelected];
            isFilterSelected[i] = !isFilterSelected[i];
            this.setState({ isFilterSelected });
        };
        this.onSubmit = () => {
            const selectedFilters = this.props.filters.filter((filter, i) => this.state.isFilterSelected[i]);
            this.props.onSubmit(selectedFilters);
        };
        this.state = {
            isFilterSelected: props.filters.map(() => true),
        };
    }
    getLabel(filter) {
        const valueLabel = common_1.getDisplayValueFromFilter(filter, this.props.indexPatterns);
        return react_2.default.createElement(filter_bar_1.FilterLabel, { filter: filter, valueLabel: valueLabel });
    }
    render() {
        if (this.props.filters.length === 0) {
            return '';
        }
        const mappedFilters = query_1.mapAndFlattenFilters(this.props.filters);
        const form = (react_2.default.createElement(eui_1.EuiForm, null, mappedFilters.map((filter, i) => (react_2.default.createElement(eui_1.EuiFormRow, { key: i },
            react_2.default.createElement(eui_1.EuiSwitch, { label: this.getLabel(filter), checked: this.isFilterSelected(i), onChange: () => this.toggleFilterSelected(i) }))))));
        return (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(eui_1.EuiModalHeader, null,
                react_2.default.createElement(eui_1.EuiModalHeaderTitle, null,
                    react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.applyFilters.popupHeader", defaultMessage: "Select filters to apply" }))),
            react_2.default.createElement(eui_1.EuiModalBody, null, form),
            react_2.default.createElement(eui_1.EuiModalFooter, null,
                react_2.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.props.onCancel },
                    react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.applyFiltersPopup.cancelButtonLabel", defaultMessage: "Cancel" })),
                react_2.default.createElement(eui_1.EuiButton, { onClick: this.onSubmit, "data-test-subj": "applyFiltersPopoverButton", fill: true },
                    react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.applyFiltersPopup.saveButtonLabel", defaultMessage: "Apply" })))));
    }
}
exports.ApplyFiltersPopoverContent = ApplyFiltersPopoverContent;
ApplyFiltersPopoverContent.defaultProps = {
    filters: [],
};
