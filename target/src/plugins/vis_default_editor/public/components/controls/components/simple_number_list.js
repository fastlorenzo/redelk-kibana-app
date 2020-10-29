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
exports.SimpleNumberList = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const utils_1 = require("./number_list/utils");
const number_row_1 = require("./number_list/number_row");
const generateId = eui_1.htmlIdGenerator();
function SimpleNumberList({ agg, aggParam, value, setValue, setTouched, }) {
    const [numbers, setNumbers] = react_1.useState(utils_1.getInitModelList(value && lodash_1.isArray(value) ? value : [utils_1.EMPTY_STRING]));
    const numberRange = react_1.useMemo(() => utils_1.getRange('[-Infinity,Infinity]'), []);
    // This useEffect is needed to discard changes, it sets numbers a mapped value if they are different
    react_1.useEffect(() => {
        if (lodash_1.isArray(value) &&
            (value.length !== numbers.length ||
                !value.every((numberValue, index) => numberValue === numbers[index].value))) {
            setNumbers(value.map((numberValue) => ({
                id: generateId(),
                value: numberValue,
                isInvalid: false,
            })));
        }
    }, [numbers, value]);
    const onUpdate = react_1.useCallback((numberList) => {
        setNumbers(numberList);
        setValue(numberList.map(({ value: numberValue }) => numberValue));
    }, [setValue]);
    const onChangeValue = react_1.useCallback((numberField) => {
        onUpdate(numbers.map((number) => number.id === numberField.id
            ? {
                id: numberField.id,
                value: utils_1.parse(numberField.value),
                isInvalid: false,
            }
            : number));
    }, [numbers, onUpdate]);
    // Add an item to the end of the list
    const onAdd = react_1.useCallback(() => {
        const newArray = [
            ...numbers,
            {
                id: generateId(),
                value: utils_1.EMPTY_STRING,
                isInvalid: false,
            },
        ];
        onUpdate(newArray);
    }, [numbers, onUpdate]);
    const onDelete = react_1.useCallback((id) => onUpdate(numbers.filter((number) => number.id !== id)), [numbers, onUpdate]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { id: `${aggParam.name}-${agg.id}}`, label: aggParam.displayName || aggParam.name, fullWidth: true, compressed: true },
        react_1.default.createElement(react_1.default.Fragment, null,
            numbers.map((number, arrayIndex) => (react_1.default.createElement(react_1.Fragment, { key: number.id },
                react_1.default.createElement(number_row_1.NumberRow, { isInvalid: number.isInvalid, disableDelete: numbers.length === 1, model: number, labelledbyId: `${aggParam.name}-${agg.id}-legend`, range: numberRange, onDelete: onDelete, onChange: onChangeValue, onBlur: setTouched, autoFocus: numbers.length !== 1 && arrayIndex === numbers.length - 1 }),
                numbers.length - 1 !== arrayIndex && react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "plusInCircleFilled", onClick: onAdd, size: "xs" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.includeExclude.addUnitButtonLabel", defaultMessage: "Add value" }))))));
}
exports.SimpleNumberList = SimpleNumberList;
