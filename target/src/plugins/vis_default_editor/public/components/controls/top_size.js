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
exports.TopSizeParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const size_1 = require("./size");
const top_aggregate_1 = require("./top_aggregate");
function TopSizeParamEditor(props) {
    const iconTip = (react_1.default.createElement(react_1.default.Fragment, null,
        ' ',
        react_1.default.createElement(eui_1.EuiIconTip, { position: "right", content: i18n_1.i18n.translate('visDefaultEditor.controls.sizeTooltip', {
                defaultMessage: "Request top-K hits. Multiple hits will be combined via 'aggregate with'.",
            }), type: "questionInCircle" })));
    const fieldType = props.agg.params.field && props.agg.params.field.type;
    const disabled = fieldType && !top_aggregate_1.getCompatibleAggs(props.agg).length;
    return react_1.default.createElement(size_1.SizeParamEditor, Object.assign({}, props, { iconTip: iconTip, disabled: disabled }));
}
exports.TopSizeParamEditor = TopSizeParamEditor;
