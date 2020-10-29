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
exports.useValidation = exports.useFallbackMetric = exports.useAvailableOptions = exports.isCompatibleAggregation = exports.safeMakeLabel = exports.CUSTOM_METRIC = void 0;
const react_1 = require("react");
const i18n_1 = require("@kbn/i18n");
const DEFAULT_METRIC = 'custom';
const CUSTOM_METRIC = {
    text: i18n_1.i18n.translate('visDefaultEditor.controls.customMetricLabel', {
        defaultMessage: 'Custom metric',
    }),
    value: DEFAULT_METRIC,
};
exports.CUSTOM_METRIC = CUSTOM_METRIC;
function useCompatibleAggCallback(aggFilter) {
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    return react_1.useCallback(isCompatibleAggregation(aggFilter), [aggFilter]);
}
/**
 * the effect is used to set up a default metric aggregation in case,
 * when previously selected metric has been removed
 */
function useFallbackMetric(setValue, aggFilter, metricAggs, value, fallbackValue) {
    const isCompatibleAgg = useCompatibleAggCallback(aggFilter);
    react_1.useEffect(() => {
        if (metricAggs && value && value !== DEFAULT_METRIC) {
            // ensure that metric is set to a valid agg
            const respAgg = metricAggs
                .filter(isCompatibleAgg)
                .find((aggregation) => aggregation.id === value);
            if (!respAgg && value !== fallbackValue) {
                setValue(fallbackValue);
            }
        }
    }, [setValue, isCompatibleAgg, metricAggs, value, fallbackValue]);
}
exports.useFallbackMetric = useFallbackMetric;
/**
 * this makes an array of available options in appropriate format for EuiSelect,
 * calculates if an option is disabled
 */
function useAvailableOptions(aggFilter, metricAggs = [], defaultOptions = []) {
    const isCompatibleAgg = useCompatibleAggCallback(aggFilter);
    const options = react_1.useMemo(() => [
        ...metricAggs.map((respAgg) => ({
            text: i18n_1.i18n.translate('visDefaultEditor.controls.definiteMetricLabel', {
                defaultMessage: 'Metric: {metric}',
                values: {
                    metric: safeMakeLabel(respAgg),
                },
            }),
            value: respAgg.id,
            disabled: !isCompatibleAgg(respAgg),
        })),
        CUSTOM_METRIC,
        ...defaultOptions,
    ], [metricAggs, defaultOptions, isCompatibleAgg]);
    return options;
}
exports.useAvailableOptions = useAvailableOptions;
/**
 * the effect is used to set up the editor form validity
 * and reset it if a param has been removed
 */
function useValidation(setValidity, isValid) {
    react_1.useEffect(() => {
        setValidity(isValid);
        return () => setValidity(true);
    }, [isValid, setValidity]);
}
exports.useValidation = useValidation;
function safeMakeLabel(agg) {
    try {
        return agg.makeLabel();
    }
    catch (e) {
        return i18n_1.i18n.translate('visDefaultEditor.controls.aggNotValidLabel', {
            defaultMessage: '- agg not valid -',
        });
    }
}
exports.safeMakeLabel = safeMakeLabel;
function isCompatibleAggregation(aggFilter) {
    return (agg) => {
        return !aggFilter.includes(`!${agg.type.name}`);
    };
}
exports.isCompatibleAggregation = isCompatibleAggregation;
