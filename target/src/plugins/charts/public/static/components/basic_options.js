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
exports.BasicOptions = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const switch_1 = require("./switch");
const select_1 = require("./select");
function BasicOptions({ stateParams, setValue, vis, }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(select_1.SelectOption, { label: i18n_1.i18n.translate('charts.controls.vislibBasicOptions.legendPositionLabel', {
                defaultMessage: 'Legend position',
            }), options: vis.type.editorConfig.collections.legendPositions, paramName: "legendPosition", value: stateParams.legendPosition, setValue: setValue }),
        react_1.default.createElement(switch_1.SwitchOption, { label: i18n_1.i18n.translate('charts.controls.vislibBasicOptions.showTooltipLabel', {
                defaultMessage: 'Show tooltip',
            }), paramName: "addTooltip", value: stateParams.addTooltip, setValue: setValue })));
}
exports.BasicOptions = BasicOptions;
