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
exports.ColorRanges = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../vis_default_editor/public");
function ColorRanges({ 'data-test-subj': dataTestSubj, colorsRange, setValue, setValidity, setTouched, }) {
    const addRangeValues = react_1.useCallback(() => {
        const previousRange = lodash_1.last(colorsRange) || {};
        const from = previousRange.to ? previousRange.to : 0;
        const to = previousRange.to ? from + (previousRange.to - (previousRange.from || 0)) : 100;
        return { from, to };
    }, [colorsRange]);
    const validateRange = react_1.useCallback(({ from, to }, index) => {
        if (!colorsRange[index]) {
            return [false, false];
        }
        const leftBound = index === 0 ? -Infinity : colorsRange[index - 1].to || 0;
        const isFromValid = from >= leftBound;
        const isToValid = to >= from;
        return [isFromValid, isToValid];
    }, [colorsRange]);
    const setColorRanges = react_1.useCallback((value) => setValue('colorsRange', value), [
        setValue,
    ]);
    return (react_1.default.createElement(public_1.RangesParamEditor, { "data-test-subj": dataTestSubj, error: i18n_1.i18n.translate('charts.controls.colorRanges.errorText', {
            defaultMessage: 'Each range should be greater than previous.',
        }), hidePlaceholders: true, value: colorsRange, setValue: setColorRanges, setValidity: setValidity, setTouched: setTouched, addRangeValues: addRangeValues, validateRange: validateRange }));
}
exports.ColorRanges = ColorRanges;
