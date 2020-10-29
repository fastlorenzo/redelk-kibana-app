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
exports.SwitchParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
function SwitchParamEditor({ value = false, setValue, dataTestSubj, displayToolTip, displayLabel, disabled, }) {
    return (react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true },
        react_1.default.createElement(eui_1.EuiToolTip, { content: displayToolTip, delay: "long", position: "right" },
            react_1.default.createElement(eui_1.EuiSwitch, { compressed: true, label: displayLabel, checked: value, disabled: disabled, "data-test-subj": dataTestSubj, onChange: (ev) => setValue(ev.target.checked) }))));
}
exports.SwitchParamEditor = SwitchParamEditor;
