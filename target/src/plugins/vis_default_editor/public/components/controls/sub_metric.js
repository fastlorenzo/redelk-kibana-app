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
exports.SubMetricParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_use_1 = require("react-use");
const public_1 = require("../../../../data/public");
const utils_1 = require("./utils");
const agg_params_1 = require("../agg_params");
function SubMetricParamEditor({ agg, aggParam, formIsTouched, metricAggs, state, setValue, setValidity, setTouched, schemas, }) {
    const metricTitle = i18n_1.i18n.translate('visDefaultEditor.controls.metrics.metricTitle', {
        defaultMessage: 'Metric',
    });
    const bucketTitle = i18n_1.i18n.translate('visDefaultEditor.controls.metrics.bucketTitle', {
        defaultMessage: 'Bucket',
    });
    const type = aggParam.name;
    const isCustomMetric = type === 'customMetric';
    const aggTitle = isCustomMetric ? metricTitle : bucketTitle;
    const aggGroup = isCustomMetric ? public_1.AggGroupNames.Metrics : public_1.AggGroupNames.Buckets;
    react_use_1.useMount(() => {
        if (agg.params[type]) {
            setValue(agg.params[type]);
        }
        else {
            setValue(aggParam.makeAgg(agg));
        }
    });
    const { onAggTypeChange, setAggParamValue } = utils_1.useSubAggParamsHandlers(agg, aggParam, agg.params[type], setValue);
    if (!agg.params[type]) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiFormLabel, null, aggTitle),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(agg_params_1.DefaultEditorAggParams, { agg: agg.params[type], allowedAggs: aggParam.allowedAggs, groupName: aggGroup, className: "visEditorAgg__subAgg", formIsTouched: formIsTouched, indexPattern: agg.getIndexPattern(), metricAggs: metricAggs, state: state, setAggParamValue: setAggParamValue, onAggTypeChange: onAggTypeChange, setValidity: setValidity, setTouched: setTouched, schemas: schemas, hideCustomLabel: !isCustomMetric })));
}
exports.SubMetricParamEditor = SubMetricParamEditor;
