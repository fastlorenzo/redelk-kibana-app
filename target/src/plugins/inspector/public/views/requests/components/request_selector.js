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
exports.RequestSelector = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@kbn/i18n/react");
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const adapters_1 = require("../../../../common/adapters");
class RequestSelector extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isPopoverOpen: false,
        };
        this.togglePopover = () => {
            this.setState((prevState) => ({
                isPopoverOpen: !prevState.isPopoverOpen,
            }));
        };
        this.closePopover = () => {
            this.setState({
                isPopoverOpen: false,
            });
        };
        this.renderRequestDropdownItem = (request, index) => {
            const hasFailed = request.status === adapters_1.RequestStatus.ERROR;
            const inProgress = request.status === adapters_1.RequestStatus.PENDING;
            return (react_1.default.createElement(eui_1.EuiContextMenuItem, { key: index, icon: request === this.props.selectedRequest ? 'check' : 'empty', onClick: () => {
                    this.props.onRequestChanged(request);
                    this.closePopover();
                }, toolTipContent: request.description, toolTipPosition: "left", "data-test-subj": `inspectorRequestChooser${request.name}` },
                react_1.default.createElement(eui_1.EuiTextColor, { color: hasFailed ? 'danger' : 'default' },
                    request.name,
                    hasFailed && (react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.failedLabel", defaultMessage: " (failed)" })),
                    inProgress && (react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s", "aria-label": i18n_1.i18n.translate('inspector.requests.requestInProgressAriaLabel', {
                            defaultMessage: 'Request in progress',
                        }), className: "insRequestSelector__menuSpinner" })))));
        };
    }
    renderRequestDropdown() {
        const button = (react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "arrowDown", iconSide: "right", size: "s", onClick: this.togglePopover, "data-test-subj": "inspectorRequestChooser" }, this.props.selectedRequest.name));
        return (react_1.default.createElement(eui_1.EuiPopover, { id: "inspectorRequestChooser", button: button, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, panelPaddingSize: "none", anchorPosition: "downLeft", repositionOnScroll: true },
            react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: this.props.requests.map(this.renderRequestDropdownItem), "data-test-subj": "inspectorRequestChooserMenuPanel" })));
    }
    render() {
        const { selectedRequest, requests } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center", gutterSize: "xs" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement("strong", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestLabel", defaultMessage: "Request:" }))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                requests.length <= 1 && (react_1.default.createElement("div", { className: "insRequestSelector__singleRequest", "data-test-subj": "inspectorRequestName" }, selectedRequest.name)),
                requests.length > 1 && this.renderRequestDropdown()),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                selectedRequest.status !== adapters_1.RequestStatus.PENDING && (react_1.default.createElement(eui_1.EuiToolTip, { position: "left", title: selectedRequest.status === adapters_1.RequestStatus.OK ? (react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestSucceededTooltipTitle", defaultMessage: "Request succeeded" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestFailedTooltipTitle", defaultMessage: "Request failed" })), content: react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestTooltipDescription", defaultMessage: "The total time the request took." }) },
                    react_1.default.createElement(eui_1.EuiBadge, { color: selectedRequest.status === adapters_1.RequestStatus.OK ? 'secondary' : 'danger', iconType: selectedRequest.status === adapters_1.RequestStatus.OK ? 'check' : 'cross' },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "inspector.requests.requestTimeLabel", defaultMessage: "{requestTime}ms", values: { requestTime: selectedRequest.time } })))),
                selectedRequest.status === adapters_1.RequestStatus.PENDING && (react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m", "aria-label": i18n_1.i18n.translate('inspector.requests.requestInProgressAriaLabel', {
                        defaultMessage: 'Request in progress',
                    }) })))));
    }
}
exports.RequestSelector = RequestSelector;
RequestSelector.propTypes = {
    requests: prop_types_1.default.array.isRequired,
    selectedRequest: prop_types_1.default.object.isRequired,
    onRequestChanged: prop_types_1.default.func,
};
