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
exports.isRangeValid = void 0;
const i18n_1 = require("@kbn/i18n");
const LOWER_VALUE_INDEX = 0;
const UPPER_VALUE_INDEX = 1;
function isRangeValid(value = [0, 0], min = 0, max = 0, allowEmptyRange) {
    allowEmptyRange = typeof allowEmptyRange === 'boolean' ? allowEmptyRange : true; // cannot use default props since that uses falsy check
    let lowerValue = isNaN(value[LOWER_VALUE_INDEX])
        ? ''
        : `${value[LOWER_VALUE_INDEX]}`;
    let upperValue = isNaN(value[UPPER_VALUE_INDEX])
        ? ''
        : `${value[UPPER_VALUE_INDEX]}`;
    const isLowerValueValid = lowerValue.toString() !== '';
    const isUpperValueValid = upperValue.toString() !== '';
    if (isLowerValueValid) {
        lowerValue = parseFloat(lowerValue);
    }
    if (isUpperValueValid) {
        upperValue = parseFloat(upperValue);
    }
    let isValid = true;
    let errorMessage = '';
    const bothMustBeSetErrorMessage = i18n_1.i18n.translate('kibana-react.dualRangeControl.mustSetBothErrorMessage', {
        defaultMessage: 'Both lower and upper values must be set',
    });
    if (!allowEmptyRange && (!isLowerValueValid || !isUpperValueValid)) {
        isValid = false;
        errorMessage = bothMustBeSetErrorMessage;
    }
    else if ((!isLowerValueValid && isUpperValueValid) ||
        (isLowerValueValid && !isUpperValueValid)) {
        isValid = false;
        errorMessage = bothMustBeSetErrorMessage;
    }
    else if ((isLowerValueValid && lowerValue < min) || (isUpperValueValid && upperValue > max)) {
        isValid = false;
        errorMessage = i18n_1.i18n.translate('kibana-react.dualRangeControl.outsideOfRangeErrorMessage', {
            defaultMessage: 'Values must be on or between {min} and {max}',
            values: { min, max },
        });
    }
    else if (isLowerValueValid && isUpperValueValid && upperValue < lowerValue) {
        isValid = false;
        errorMessage = i18n_1.i18n.translate('kibana-react.dualRangeControl.upperValidErrorMessage', {
            defaultMessage: 'Upper value must be greater or equal to lower value',
        });
    }
    return {
        isValid,
        errorMessage,
    };
}
exports.isRangeValid = isRangeValid;
