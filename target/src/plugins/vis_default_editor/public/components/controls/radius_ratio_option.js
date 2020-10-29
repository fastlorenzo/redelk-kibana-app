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
exports.RadiusRatioOptionControl = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const react_use_1 = require("react-use");
const DEFAULT_VALUE = 50;
const PARAM_NAME = 'radiusRatio';
function RadiusRatioOptionControl({ editorStateParams, setStateParamValue }) {
    const label = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.dotSizeRatioLabel", defaultMessage: "Dot size ratio" }),
        ' ',
        react_1.default.createElement(eui_1.EuiIconTip, { content: i18n_1.i18n.translate('visDefaultEditor.controls.dotSizeRatioHelpText', {
                defaultMessage: 'Change the ratio of the radius of the smallest point to the largest point.',
            }), position: "right" })));
    react_use_1.useMount(() => {
        if (!editorStateParams.radiusRatio) {
            setStateParamValue(PARAM_NAME, DEFAULT_VALUE);
        }
    });
    const onChange = react_1.useCallback((e) => setStateParamValue(PARAM_NAME, parseFloat(e.currentTarget.value)), [setStateParamValue]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: label, compressed: true },
            react_1.default.createElement(eui_1.EuiRange, { compressed: true, fullWidth: true, min: 1, max: 100, value: editorStateParams.radiusRatio || DEFAULT_VALUE, onChange: onChange, showRange: true, showValue: true, valueAppend: "%" })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
}
exports.RadiusRatioOptionControl = RadiusRatioOptionControl;
