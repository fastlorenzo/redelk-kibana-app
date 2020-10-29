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
exports.NumberList = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const number_row_1 = require("./number_row");
const utils_1 = require("./utils");
const utils_2 = require("../../utils");
function NumberList({ labelledbyId, numberArray, range, showValidation, unitName, validateAscendingOrder = false, disallowDuplicates = false, onChange, setTouched, setValidity, }) {
    const numberRange = react_1.useMemo(() => utils_1.getRange(range), [range]);
    const [models, setModels] = react_1.useState(utils_1.getInitModelList(numberArray));
    // set up validity for each model
    react_1.useEffect(() => {
        setModels((state) => utils_1.getValidatedModels(numberArray, state, numberRange, validateAscendingOrder, disallowDuplicates));
    }, [numberArray, numberRange, validateAscendingOrder, disallowDuplicates]);
    // responsible for setting up an initial value ([0]) when there is no default value
    react_1.useEffect(() => {
        if (!numberArray.length) {
            onChange([models[0].value]);
        }
    }, [models, numberArray.length, onChange]);
    const isValid = !utils_1.hasInvalidValues(models);
    utils_2.useValidation(setValidity, isValid);
    const onUpdate = react_1.useCallback((modelList) => {
        setModels(modelList);
        onChange(modelList.map(({ value }) => (value === utils_1.EMPTY_STRING ? undefined : value)));
    }, [onChange]);
    const onChangeValue = react_1.useCallback(({ id, value }) => {
        const parsedValue = utils_1.parse(value);
        onUpdate(models.map((model) => {
            if (model.id === id) {
                return {
                    id,
                    value: parsedValue,
                    isInvalid: false,
                };
            }
            return model;
        }));
    }, [models, onUpdate]);
    // Add an item to the end of the list
    const onAdd = react_1.useCallback(() => {
        const newArray = [...models, utils_1.getNextModel(models, numberRange)];
        onUpdate(newArray);
    }, [models, numberRange, onUpdate]);
    const onDelete = react_1.useCallback((id) => {
        const newArray = models.filter((model) => model.id !== id);
        onUpdate(newArray);
    }, [models, onUpdate]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        models.map((model, arrayIndex) => (react_1.default.createElement(react_1.Fragment, { key: model.id },
            react_1.default.createElement(number_row_1.NumberRow, { isInvalid: showValidation ? model.isInvalid : false, disableDelete: models.length === 1, model: model, labelledbyId: labelledbyId, range: numberRange, onDelete: onDelete, onChange: onChangeValue, onBlur: setTouched, autoFocus: models.length !== 1 && arrayIndex === models.length - 1 }),
            showValidation && model.isInvalid && model.error && (react_1.default.createElement(eui_1.EuiFormErrorText, null, model.error)),
            models.length - 1 !== arrayIndex && react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "plusInCircleFilled", onClick: onAdd, size: "xs" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.numberList.addUnitButtonLabel", defaultMessage: "Add {unitName}", values: { unitName } })))));
}
exports.NumberList = NumberList;
