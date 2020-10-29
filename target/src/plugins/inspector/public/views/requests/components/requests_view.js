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
exports.RequestsViewComponent = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const adapters_1 = require("../../../../common/adapters");
const request_selector_1 = require("./request_selector");
const request_details_1 = require("./request_details");
class RequestsViewComponent extends react_1.Component {
    constructor(props) {
        super(props);
        this._onRequestsChange = () => {
            const requests = this.props.adapters.requests.getRequests();
            const newState = { requests };
            if (!requests.includes(this.state.request)) {
                newState.request = requests.length ? requests[0] : null;
            }
            this.setState(newState);
        };
        this.selectRequest = (request) => {
            if (request !== this.state.request) {
                this.setState({ request });
            }
        };
        props.adapters.requests.on('change', this._onRequestsChange);
        const requests = props.adapters.requests.getRequests();
        this.state = {
            requests,
            request: requests.length ? requests[0] : null,
        };
    }
    componentWillUnmount() {
        this.props.adapters.requests.removeListener('change', this._onRequestsChange);
    }
    static renderEmptyRequests() {
        return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { "data-test-subj": "inspectorNoRequestsMessage", title: react_1.default.createElement("h2", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.noRequestsLoggedTitle", defaultMessage: "No requests logged" })), body: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.noRequestsLoggedDescription.elementHasNotLoggedAnyRequestsText", defaultMessage: "The element hasn't logged any requests (yet)." })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.noRequestsLoggedDescription.whatDoesItUsuallyMeanText", defaultMessage: "This usually means that there was no need to fetch any data or\n                  that the element has not yet started fetching data." }))) }));
    }
    render() {
        if (!this.state.requests || !this.state.requests.length) {
            return RequestsViewComponent.renderEmptyRequests();
        }
        const failedCount = this.state.requests.filter((req) => req.status === adapters_1.RequestStatus.ERROR).length;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                react_1.default.createElement("p", { role: "status", "aria-live": "polite", "aria-atomic": "true" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestWasMadeDescription", defaultMessage: "{requestsCount, plural, one {# request was} other {# requests were} } made{failedRequests}", values: {
                            requestsCount: this.state.requests.length,
                            failedRequests: failedCount > 0 ? (react_1.default.createElement(eui_1.EuiTextColor, { color: "danger" },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestWasMadeDescription.requestHadFailureText", defaultMessage: ", {failedCount} had a failure", values: { failedCount } }))) : (''),
                        } }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(request_selector_1.RequestSelector, { requests: this.state.requests, selectedRequest: this.state.request, onRequestChanged: this.selectRequest }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            this.state.request && this.state.request.description && (react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                react_1.default.createElement("p", null, this.state.request.description))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            this.state.request && react_1.default.createElement(request_details_1.RequestDetails, { request: this.state.request })));
    }
}
exports.RequestsViewComponent = RequestsViewComponent;
RequestsViewComponent.propTypes = {
    adapters: prop_types_1.default.object.isRequired,
    title: prop_types_1.default.string.isRequired,
};
