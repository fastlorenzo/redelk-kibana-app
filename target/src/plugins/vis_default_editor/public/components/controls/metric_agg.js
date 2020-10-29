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
exports.MetricAggParamEditor = exports.aggFilter = exports.DEFAULT_OPTIONS = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const utils_1 = require("./utils");
const aggFilter = ['!top_hits', '!percentiles', '!percentile_ranks', '!median', '!std_dev'];
exports.aggFilter = aggFilter;
const EMPTY_VALUE = 'EMPTY_VALUE';
const DEFAULT_OPTIONS = [{ text: '', value: EMPTY_VALUE, hidden: true }];
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
function MetricAggParamEditor({ agg, value, showValidation, setValue, setValidity, setTouched, metricAggs = [], }) {
    const label = i18n_1.i18n.translate('visDefaultEditor.controls.metricLabel', {
        defaultMessage: 'Metric',
    });
    const isValid = !!value;
    utils_1.useValidation(setValidity, isValid);
    utils_1.useFallbackMetric(setValue, aggFilter, metricAggs, value);
    const filteredMetrics = react_1.useMemo(() => metricAggs.filter((respAgg) => respAgg.type.name !== agg.type.name), [metricAggs, agg.type.name]);
    const options = utils_1.useAvailableOptions(aggFilter, filteredMetrics, DEFAULT_OPTIONS);
    const onChange = react_1.useCallback((ev) => setValue(ev.target.value), [setValue]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, fullWidth: true, isInvalid: showValidation && !isValid, compressed: true },
        react_1.default.createElement(eui_1.EuiSelect, { compressed: true, fullWidth: true, options: options, value: value || EMPTY_VALUE, onChange: onChange, isInvalid: showValidation && !isValid, onBlur: setTouched, "data-test-subj": `visEditorSubAggMetric${agg.id}` })));
}
exports.MetricAggParamEditor = MetricAggParamEditor;
