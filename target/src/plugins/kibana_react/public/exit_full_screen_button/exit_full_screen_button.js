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
exports.ExitFullScreenButton = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
require("./index.scss");
class ExitFullScreenButtonUi extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.onKeyDown = (e) => {
            if (e.key === eui_1.keys.ESCAPE) {
                this.props.onExitFullScreenMode();
            }
        };
    }
    UNSAFE_componentWillMount() {
        document.addEventListener('keydown', this.onKeyDown, false);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown, false);
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
                react_1.default.createElement("p", { "aria-live": "polite" }, i18n_1.i18n.translate('kibana-react.exitFullScreenButton.fullScreenModeDescription', {
                    defaultMessage: 'In full screen mode, press ESC to exit.',
                }))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("button", { "aria-label": i18n_1.i18n.translate('kibana-react.exitFullScreenButton.exitFullScreenModeButtonAriaLabel', {
                        defaultMessage: 'Exit full screen mode',
                    }), className: "dshExitFullScreenButton", onClick: this.props.onExitFullScreenMode, "data-test-subj": "exitFullScreenModeLogo" },
                    react_1.default.createElement(eui_2.EuiFlexGroup, { component: "span", responsive: false, alignItems: "center", gutterSize: "s" },
                        react_1.default.createElement(eui_2.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_2.EuiIcon, { type: "logoElastic", size: "l" })),
                        react_1.default.createElement(eui_2.EuiFlexItem, { grow: false, "data-test-subj": "exitFullScreenModeText" },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(eui_2.EuiText, { size: "s", className: "dshExitFullScreenButton__text" },
                                    react_1.default.createElement("p", null, i18n_1.i18n.translate('kibana-react.exitFullScreenButton.exitFullScreenModeButtonText', {
                                        defaultMessage: 'Exit full screen',
                                    }))))),
                        react_1.default.createElement(eui_2.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_2.EuiIcon, { type: "fullScreen", className: "dshExitFullScreenButton__icon" })))))));
    }
}
exports.ExitFullScreenButton = ExitFullScreenButtonUi;
