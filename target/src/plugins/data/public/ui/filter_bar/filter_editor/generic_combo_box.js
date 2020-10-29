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
exports.GenericComboBox = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
/**
 * A generic combo box. Instead of accepting a set of options that contain a `label`, it accepts
 * any type of object. It also accepts a `getLabel` function that each object will be sent through
 * to get the label to be passed to the combo box. The `onChange` will trigger with the actual
 * selected objects, rather than an option object.
 */
function GenericComboBox(props) {
    const { options, selectedOptions, getLabel, onChange, ...otherProps } = props;
    const labels = options.map(getLabel);
    const euiOptions = labels.map((label) => ({ label }));
    const selectedEuiOptions = selectedOptions
        .filter((option) => {
        return options.indexOf(option) !== -1;
    })
        .map((option) => {
        return euiOptions[options.indexOf(option)];
    });
    const onComboBoxChange = (newOptions) => {
        const newValues = newOptions.map(({ label }) => {
            return options[labels.indexOf(label)];
        });
        onChange(newValues);
    };
    return (react_1.default.createElement(eui_1.EuiComboBox, Object.assign({ options: euiOptions, selectedOptions: selectedEuiOptions, onChange: onComboBoxChange, sortMatchesBy: "startsWith" }, otherProps)));
}
exports.GenericComboBox = GenericComboBox;
