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
exports.TopNavMenuItem = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
function TopNavMenuItem(props) {
    function isDisabled() {
        const val = lodash_1.isFunction(props.disableButton) ? props.disableButton() : props.disableButton;
        return val;
    }
    function getTooltip() {
        const val = lodash_1.isFunction(props.tooltip) ? props.tooltip() : props.tooltip;
        return val;
    }
    function handleClick(e) {
        if (isDisabled())
            return;
        props.run(e.currentTarget);
    }
    const commonButtonProps = {
        isDisabled: isDisabled(),
        onClick: handleClick,
        iconType: props.iconType,
        iconSide: props.iconSide,
        'data-test-subj': props.testId,
    };
    const btn = props.emphasize ? (react_1.default.createElement(eui_2.EuiButton, Object.assign({}, commonButtonProps, { size: "s", fill: true }), lodash_1.upperFirst(props.label || props.id))) : (react_1.default.createElement(eui_1.EuiButtonEmpty, Object.assign({}, commonButtonProps, { size: "xs" }), lodash_1.upperFirst(props.label || props.id)));
    const tooltip = getTooltip();
    if (tooltip) {
        return react_1.default.createElement(eui_1.EuiToolTip, { content: tooltip }, btn);
    }
    return btn;
}
exports.TopNavMenuItem = TopNavMenuItem;
TopNavMenuItem.defaultProps = {
    disableButton: false,
    tooltip: '',
};
