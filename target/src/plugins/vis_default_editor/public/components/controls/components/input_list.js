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
exports.InputList = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const generateId = eui_1.htmlIdGenerator();
const validateValue = (inputValue, InputObject) => {
    const result = {
        model: inputValue || '',
        isInvalid: false,
    };
    if (!inputValue) {
        result.isInvalid = false;
        return result;
    }
    try {
        result.model = new InputObject(inputValue).toString();
        result.isInvalid = false;
        return result;
    }
    catch (e) {
        result.isInvalid = true;
        return result;
    }
};
function InputList({ config, list, onChange, setValidity }) {
    const { defaultValue, getModelValue, modelNames, onChangeFn, validateClass } = config;
    const [models, setModels] = react_1.useState(() => list.map((item) => ({
        id: generateId(),
        ...getModelValue(item),
    })));
    const hasInvalidValues = models.some(config.hasInvalidValuesFn);
    const updateValues = react_1.useCallback((modelList) => {
        setModels(modelList);
        onChange(modelList.map(onChangeFn));
    }, [onChangeFn, onChange]);
    const onChangeValue = react_1.useCallback((index, value, modelName) => {
        const { model, isInvalid } = validateValue(value, validateClass);
        updateValues(models.map((range, arrayIndex) => arrayIndex === index
            ? {
                ...range,
                [modelName]: {
                    value,
                    model,
                    isInvalid,
                },
            }
            : range));
    }, [models, updateValues, validateClass]);
    const onDelete = react_1.useCallback((id) => updateValues(models.filter((model) => model.id !== id)), [models, updateValues]);
    const onAdd = react_1.useCallback(() => updateValues([
        ...models,
        {
            id: generateId(),
            ...getModelValue(),
        },
    ]), [getModelValue, models, updateValues]);
    react_1.useEffect(() => {
        // resposible for setting up an initial value when there is no default value
        if (!list.length) {
            updateValues([
                {
                    id: generateId(),
                    ...defaultValue,
                },
            ]);
        }
    }, [defaultValue, list.length, updateValues]);
    react_1.useEffect(() => {
        setValidity(!hasInvalidValues);
    }, [hasInvalidValues, setValidity]);
    react_1.useEffect(() => {
        // responsible for discarding changes
        if (list.length !== models.length ||
            list.some((item, index) => {
                // make model to be the same shape as stored value
                const model = lodash_1.mapValues(lodash_1.pick(models[index], modelNames), 'model');
                // we need to skip empty values since they are not stored in saved object
                return !lodash_1.isEqual(item, lodash_1.omitBy(model, lodash_1.isEmpty));
            })) {
            setModels(list.map((item) => ({
                id: generateId(),
                ...getModelValue(item),
            })));
        }
    }, [getModelValue, list, modelNames, models]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        models.map((item, index) => (react_1.default.createElement(react_1.Fragment, { key: item.id },
            react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "xs", alignItems: "center", responsive: false },
                config.renderInputRow(item, index, onChangeValue),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": config.getRemoveBtnAriaLabel(item), title: config.getRemoveBtnAriaLabel(item), disabled: models.length === 1, color: "danger", iconType: "trash", onClick: () => onDelete(item.id) }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "plusInCircleFilled", onClick: onAdd, size: "xs" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.ipRanges.addRangeButtonLabel", defaultMessage: "Add range" })))));
}
exports.InputList = InputList;
