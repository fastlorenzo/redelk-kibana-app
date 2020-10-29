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
exports.PrecisionParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../kibana_react/public");
function PrecisionParamEditor({ agg, value, setValue }) {
    const { services } = public_1.useKibana();
    const label = i18n_1.i18n.translate('visDefaultEditor.controls.precisionLabel', {
        defaultMessage: 'Precision',
    });
    if (agg.params.autoPrecision) {
        return null;
    }
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, compressed: true },
        react_1.default.createElement(eui_1.EuiRange, { min: 1, max: services.uiSettings.get('visualization:tileMap:maxPrecision'), value: value || '', onChange: (ev) => setValue(Number(ev.currentTarget.value)), "data-test-subj": `visEditorMapPrecision${agg.id}`, showValue: true, compressed: true })));
}
exports.PrecisionParamEditor = PrecisionParamEditor;
