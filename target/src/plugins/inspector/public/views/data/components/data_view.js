"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataViewComponent = void 0;
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
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const data_table_1 = require("./data_table");
class DataViewComponent extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this._isMounted = false;
        this.onUpdateData = (type) => {
            if (type === 'tabular') {
                this.setState({
                    tabularData: null,
                    tabularOptions: {},
                    tabularPromise: this.props.adapters.data.getTabular(),
                });
            }
        };
    }
    static getDerivedStateFromProps(nextProps, state) {
        if (state && nextProps.adapters === state.adapters) {
            return null;
        }
        return {
            adapters: nextProps.adapters,
            tabularData: null,
            tabularOptions: {},
            tabularPromise: nextProps.adapters.data.getTabular(),
        };
    }
    async finishLoadingData() {
        const { tabularPromise } = this.state;
        if (tabularPromise) {
            const tabularData = await tabularPromise;
            if (this._isMounted) {
                this.setState({
                    tabularData: tabularData.data,
                    tabularOptions: tabularData.options,
                    tabularPromise: null,
                });
            }
        }
    }
    componentDidMount() {
        this._isMounted = true;
        this.props.adapters.data.on('change', this.onUpdateData);
        this.finishLoadingData();
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.props.adapters.data.removeListener('change', this.onUpdateData);
    }
    componentDidUpdate() {
        this.finishLoadingData();
    }
    static renderNoData() {
        return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { title: react_1.default.createElement("h2", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.noDataAvailableTitle", defaultMessage: "No data available" })), body: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.noDataAvailableDescription", defaultMessage: "The element did not provide any data." }))) }));
    }
    static renderLoading() {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "center", alignItems: "center", style: { height: '100%' } },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiPanel, { className: "eui-textCenter" },
                    react_1.default.createElement(eui_1.EuiLoadingChart, { size: "m" }),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.data.gatheringDataLabel", defaultMessage: "Gathering data" })))))));
    }
    render() {
        if (this.state.tabularPromise) {
            return DataViewComponent.renderLoading();
        }
        else if (!this.state.tabularData) {
            return DataViewComponent.renderNoData();
        }
        return (react_1.default.createElement(data_table_1.DataTableFormat, { data: this.state.tabularData, isFormatted: this.state.tabularOptions.returnsFormattedValues, exportTitle: this.props.title, uiSettings: this.props.uiSettings }));
    }
}
exports.DataViewComponent = DataViewComponent;
DataViewComponent.propTypes = {
    uiSettings: prop_types_1.default.object.isRequired,
    adapters: prop_types_1.default.object.isRequired,
    title: prop_types_1.default.string.isRequired,
};
