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
exports.IpRangeTypes = exports.IpRangeTypeParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
var IpRangeTypes;
(function (IpRangeTypes) {
    IpRangeTypes["MASK"] = "mask";
    IpRangeTypes["FROM_TO"] = "fromTo";
})(IpRangeTypes || (IpRangeTypes = {}));
exports.IpRangeTypes = IpRangeTypes;
function IpRangeTypeParamEditor({ agg, value, setValue }) {
    const options = [
        {
            id: `visEditorIpRangeFromToLabel${agg.id}`,
            label: i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.fromToButtonLabel', {
                defaultMessage: 'From/to',
            }),
        },
        {
            id: `visEditorIpRangeCidrLabel${agg.id}`,
            label: i18n_1.i18n.translate('visDefaultEditor.controls.ipRanges.cidrMasksButtonLabel', {
                defaultMessage: 'CIDR masks',
            }),
        },
    ];
    const onClick = (optionId) => {
        setValue(optionId === options[0].id ? IpRangeTypes.FROM_TO : IpRangeTypes.MASK);
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiButtonGroup, { isFullWidth: true, onChange: onClick, idSelected: value === IpRangeTypes.FROM_TO ? options[0].id : options[1].id, options: options, legend: i18n_1.i18n.translate('visDefaultEditor.controls.ipRangesAriaLabel', {
                defaultMessage: 'IP ranges',
            }) }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
}
exports.IpRangeTypeParamEditor = IpRangeTypeParamEditor;
