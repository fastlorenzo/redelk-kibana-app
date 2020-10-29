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
exports.hasInvalidValues = exports.getValidatedModels = exports.getInitModelList = exports.getNextModel = exports.validateValue = exports.getRange = exports.parse = exports.EMPTY_STRING = void 0;
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const range_1 = require("./range");
const EMPTY_STRING = '';
exports.EMPTY_STRING = EMPTY_STRING;
const defaultRange = range_1.parseRange('[0,Infinity)');
const generateId = eui_1.htmlIdGenerator();
const defaultModel = { value: 0, id: generateId(), isInvalid: false };
function parse(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? EMPTY_STRING : parsedValue;
}
exports.parse = parse;
function getRange(range) {
    try {
        return range ? range_1.parseRange(range) : defaultRange;
    }
    catch (e) {
        throw new TypeError('Unable to parse range: ' + e.message);
    }
}
exports.getRange = getRange;
function validateValue(value, numberRange) {
    const result = {
        isInvalid: false,
    };
    if (value === EMPTY_STRING) {
        result.isInvalid = true;
        result.error = EMPTY_STRING;
    }
    else if (!numberRange.within(value)) {
        result.isInvalid = true;
        result.error = i18n_1.i18n.translate('visDefaultEditor.controls.numberList.invalidRangeErrorMessage', {
            defaultMessage: 'The value should be in the range of {min} to {max}.',
            values: { min: numberRange.min, max: numberRange.max },
        });
    }
    return result;
}
exports.validateValue = validateValue;
function validateValueAscending(inputValue, index, list) {
    const result = {
        isInvalidOrder: false,
    };
    const previousModel = list[index - 1];
    if (previousModel !== undefined && inputValue !== undefined && inputValue <= previousModel) {
        result.isInvalidOrder = true;
        result.error = i18n_1.i18n.translate('visDefaultEditor.controls.numberList.invalidAscOrderErrorMessage', {
            defaultMessage: 'Value is not in ascending order.',
        });
    }
    return result;
}
function validateValueUnique(inputValue, index, list) {
    const result = {
        isDuplicate: false,
    };
    if (inputValue !== EMPTY_STRING && list.indexOf(inputValue) !== index) {
        result.isDuplicate = true;
        result.error = i18n_1.i18n.translate('visDefaultEditor.controls.numberList.duplicateValueErrorMessage', {
            defaultMessage: 'Duplicate value.',
        });
    }
    return result;
}
function getNextModel(list, range) {
    const lastValue = lodash_1.last(list).value;
    let next = Number(lastValue) ? Number(lastValue) + 1 : 1;
    if (next >= range.max) {
        next = range.max - 1;
    }
    return {
        id: generateId(),
        value: next,
        isInvalid: false,
    };
}
exports.getNextModel = getNextModel;
function getInitModelList(list) {
    return list.length
        ? list.map((num) => ({
            value: (num === undefined ? EMPTY_STRING : num),
            id: generateId(),
            isInvalid: false,
        }))
        : [defaultModel];
}
exports.getInitModelList = getInitModelList;
function getValidatedModels(numberList, modelList, numberRange, validateAscendingOrder = false, disallowDuplicates = false) {
    if (!numberList.length) {
        return [defaultModel];
    }
    return numberList.map((number, index) => {
        const model = modelList[index] || { id: generateId() };
        const newValue = number === undefined ? EMPTY_STRING : number;
        const valueResult = numberRange ? validateValue(newValue, numberRange) : { isInvalid: false };
        const ascendingResult = validateAscendingOrder
            ? validateValueAscending(newValue, index, numberList)
            : { isInvalidOrder: false };
        const duplicationResult = disallowDuplicates
            ? validateValueUnique(newValue, index, numberList)
            : { isDuplicate: false };
        const allErrors = [valueResult.error, ascendingResult.error, duplicationResult.error]
            .filter(Boolean)
            .join(' ');
        return {
            ...model,
            value: newValue,
            isInvalid: valueResult.isInvalid || ascendingResult.isInvalidOrder || duplicationResult.isDuplicate,
            error: allErrors === EMPTY_STRING ? undefined : allErrors,
        };
    });
}
exports.getValidatedModels = getValidatedModels;
function hasInvalidValues(modelList) {
    return !!modelList.find(({ isInvalid }) => isInvalid);
}
exports.hasInvalidValues = hasInvalidValues;
