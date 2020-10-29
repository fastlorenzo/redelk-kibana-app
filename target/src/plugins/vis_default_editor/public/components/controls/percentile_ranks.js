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
exports.PercentileRanksEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const number_list_1 = require("./components/number_list");
function PercentileRanksEditor({ agg, showValidation, value = [], setTouched, setValidity, setValue, }) {
    const label = i18n_1.i18n.translate('visDefaultEditor.controls.percentileRanks.valuesLabel', {
        defaultMessage: 'Values',
    });
    const [isValid, setIsValid] = react_1.useState(true);
    const setModelValidity = react_1.useCallback((isListValid) => {
        setIsValid(isListValid);
        setValidity(isListValid);
    }, [setValidity]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, labelType: "legend", fullWidth: true, id: `visEditorPercentileRanksLabel${agg.id}`, isInvalid: showValidation ? !isValid : false, compressed: true, "data-test-subj": "visEditorPercentileRanks" },
        react_1.default.createElement(number_list_1.NumberList, { labelledbyId: `visEditorPercentileRanksLabel${agg.id}-legend`, numberArray: value, range: "[-Infinity,Infinity]", unitName: i18n_1.i18n.translate('visDefaultEditor.controls.percentileRanks.valueUnitNameText', {
                defaultMessage: 'value',
            }), validateAscendingOrder: true, showValidation: showValidation, onChange: setValue, setTouched: setTouched, setValidity: setModelValidity })));
}
exports.PercentileRanksEditor = PercentileRanksEditor;
