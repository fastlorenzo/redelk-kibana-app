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
exports.RequestDetails = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const details_1 = require("./details");
const DETAILS = [
    {
        name: 'Statistics',
        label: i18n_1.i18n.translate('inspector.requests.statisticsTabLabel', {
            defaultMessage: 'Statistics',
        }),
        component: details_1.RequestDetailsStats,
    },
    {
        name: 'Request',
        label: i18n_1.i18n.translate('inspector.requests.requestTabLabel', {
            defaultMessage: 'Request',
        }),
        component: details_1.RequestDetailsRequest,
    },
    {
        name: 'Response',
        label: i18n_1.i18n.translate('inspector.requests.responseTabLabel', {
            defaultMessage: 'Response',
        }),
        component: details_1.RequestDetailsResponse,
    },
];
class RequestDetails extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            availableDetails: [],
            selectedDetail: null,
        };
        this.selectDetailsTab = (detail) => {
            if (detail !== this.state.selectedDetail) {
                this.setState({
                    selectedDetail: detail,
                });
            }
        };
        this.renderDetailTab = (detail) => {
            return (react_1.default.createElement(eui_1.EuiTab, { key: detail.name, isSelected: detail === this.state.selectedDetail, onClick: () => this.selectDetailsTab(detail), "data-test-subj": `inspectorRequestDetail${detail.name}` }, detail.label));
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const selectedDetail = prevState && prevState.selectedDetail;
        const availableDetails = DETAILS.filter((detail) => !detail.component.shouldShow || detail.component.shouldShow(nextProps.request));
        // If the previously selected detail is still available we want to stay
        // on this tab and not set another selectedDetail.
        if (selectedDetail && availableDetails.includes(selectedDetail)) {
            return { availableDetails };
        }
        return {
            availableDetails,
            selectedDetail: availableDetails[0],
        };
    }
    static getSelectedDetailComponent(detail) {
        return detail ? detail.component : null;
    }
    render() {
        const { selectedDetail, availableDetails } = this.state;
        const DetailComponent = RequestDetails.getSelectedDetailComponent(selectedDetail);
        if (!availableDetails.length || !DetailComponent) {
            return null;
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiTabs, { size: "s" }, this.state.availableDetails.map(this.renderDetailTab)),
            react_1.default.createElement(DetailComponent, { request: this.props.request })));
    }
}
exports.RequestDetails = RequestDetails;
RequestDetails.propTypes = {
    request: prop_types_1.default.object.isRequired,
};
