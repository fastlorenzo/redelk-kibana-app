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
exports.NumberIntervalParamEditor = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../data/public");
const label = (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.numberInterval.minimumIntervalLabel", defaultMessage: "Minimum interval" }),
    ' ',
    react_1.default.createElement(eui_1.EuiIconTip, { position: "right", content: react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.numberInterval.minimumIntervalTooltip", defaultMessage: "Interval will be automatically scaled in the event that the provided value creates more buckets than specified by Advanced Setting's {histogramMaxBars}", values: { histogramMaxBars: public_1.UI_SETTINGS.HISTOGRAM_MAX_BARS } }), type: "questionInCircle" })));
function NumberIntervalParamEditor({ agg, editorConfig, showValidation, value, setTouched, setValidity, setValue, }) {
    const base = lodash_1.get(editorConfig, 'interval.base');
    const min = base || 0;
    const isValid = value !== undefined && value >= min;
    react_1.useEffect(() => {
        setValidity(isValid);
    }, [isValid, setValidity]);
    const onChange = react_1.useCallback(({ target }) => setValue(isNaN(target.valueAsNumber) ? undefined : target.valueAsNumber), [setValue]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { compressed: true, label: label, fullWidth: true, isInvalid: showValidation && !isValid, helpText: lodash_1.get(editorConfig, 'interval.help') },
        react_1.default.createElement(eui_1.EuiFieldNumber, { value: value === undefined ? '' : value, min: min, step: base, "data-test-subj": `visEditorInterval${agg.id}`, isInvalid: showValidation && !isValid, onChange: onChange, onBlur: setTouched, fullWidth: true, compressed: true, placeholder: i18n_1.i18n.translate('visDefaultEditor.controls.numberInterval.selectIntervalPlaceholder', {
                defaultMessage: 'Enter an interval',
            }) })));
}
exports.NumberIntervalParamEditor = NumberIntervalParamEditor;
