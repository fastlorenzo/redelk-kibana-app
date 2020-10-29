"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldName = void 0;
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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../../kibana_react/public");
const helpers_1 = require("../../helpers");
const field_type_name_1 = require("./field_type_name");
function FieldName({ fieldName, fieldType, useShortDots, fieldIconProps, scripted = false, }) {
    const typeName = field_type_name_1.getFieldTypeName(fieldType);
    const displayName = useShortDots ? helpers_1.shortenDottedString(fieldName) : fieldName;
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center", gutterSize: "s", responsive: false },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(public_1.FieldIcon, Object.assign({ type: fieldType, label: typeName, scripted: scripted }, fieldIconProps))),
        react_1.default.createElement(eui_1.EuiFlexItem, { className: "eui-textTruncate" },
            react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: displayName, delay: "long", anchorClassName: "eui-textTruncate" },
                react_1.default.createElement("span", null, displayName)))));
}
exports.FieldName = FieldName;
