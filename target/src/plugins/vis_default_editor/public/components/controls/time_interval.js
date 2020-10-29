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
exports.TimeIntervalParamEditor = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../data/public");
const { parseEsInterval, InvalidEsCalendarIntervalError } = public_1.search.aggs;
// we check if Elasticsearch interval is valid to show a user appropriate error message
// e.g. there is the case when a user inputs '14d' but it's '2w' in expression equivalent and the request will fail
// we don't check it for 0ms because the overall time range has not yet been set
function isValidCalendarInterval(interval) {
    if (interval === '0ms') {
        return { isValidCalendarValue: true };
    }
    try {
        parseEsInterval(interval);
        return { isValidCalendarValue: true };
    }
    catch (e) {
        if (e instanceof InvalidEsCalendarIntervalError) {
            return { isValidCalendarValue: false, error: e.message };
        }
        return { isValidCalendarValue: true };
    }
}
const errorMessage = i18n_1.i18n.translate('visDefaultEditor.controls.timeInterval.invalidFormatErrorMessage', {
    defaultMessage: 'Invalid interval format.',
});
function validateInterval(agg, value, definedOption, timeBase) {
    if (definedOption) {
        return { isValid: true, interval: agg.buckets?.getInterval() };
    }
    if (!value) {
        return { isValid: false };
    }
    if (!timeBase) {
        // we check if Elasticsearch interval is valid ES interval to show a user appropriate error message
        // we don't check if there is timeBase
        const { isValidCalendarValue, error } = isValidCalendarInterval(value);
        if (!isValidCalendarValue) {
            return { isValid: false, error };
        }
    }
    const isValid = public_1.search.aggs.isValidInterval(value, timeBase);
    if (!isValid) {
        return { isValid: false, error: errorMessage };
    }
    const interval = agg.buckets?.getInterval();
    const { isValidCalendarValue, error } = isValidCalendarInterval(interval.expression);
    if (!isValidCalendarValue) {
        return { isValid: false, error };
    }
    return { isValid, interval };
}
function TimeIntervalParamEditor({ agg, aggParam, editorConfig, value, setValue, showValidation, setTouched, setValidity, }) {
    const timeBase = lodash_1.get(editorConfig, 'interval.timeBase');
    const options = timeBase
        ? []
        : (aggParam.options || []).reduce((filtered, option) => {
            if (option.enabled ? option.enabled(agg) : true) {
                filtered.push({ label: option.display, key: option.val });
            }
            return filtered;
        }, []);
    let selectedOptions = [];
    let definedOption;
    if (value) {
        definedOption = lodash_1.find(options, { key: value });
        selectedOptions = definedOption ? [definedOption] : [{ label: value, key: 'custom' }];
    }
    const { isValid, error, interval } = validateInterval(agg, value, definedOption, timeBase);
    const scaledHelpText = interval && interval.scaled ? (react_1.default.createElement("strong", { "data-test-subj": "currentlyScaledText", className: "eui-displayBlock" },
        react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.timeInterval.scaledHelpText", defaultMessage: "Currently scaled to {bucketDescription}", values: { bucketDescription: lodash_1.get(interval, 'description') || '' } }),
        ' ',
        react_1.default.createElement(eui_1.EuiIconTip, { position: "right", type: "questionInCircle", content: interval.scale <= 1 ? tooManyBucketsTooltip : tooLargeBucketsTooltip }))) : null;
    const helpText = (react_1.default.createElement(react_1.default.Fragment, null,
        scaledHelpText,
        lodash_1.get(editorConfig, 'interval.help') || selectOptionHelpText));
    const onCustomInterval = (customValue) => setValue(customValue.trim());
    const onChange = (opts) => {
        const selectedOpt = lodash_1.get(opts, '0');
        setValue(selectedOpt ? selectedOpt.key : '');
    };
    react_1.useEffect(() => {
        setValidity(isValid);
    }, [isValid, setValidity]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { compressed: true, error: error, fullWidth: true, helpText: helpText, isInvalid: showValidation && !isValid, label: i18n_1.i18n.translate('visDefaultEditor.controls.timeInterval.minimumIntervalLabel', {
            defaultMessage: 'Minimum interval',
        }) },
        react_1.default.createElement(eui_1.EuiComboBox, { compressed: true, fullWidth: true, "data-test-subj": "visEditorInterval", isInvalid: showValidation && !isValid, noSuggestions: !!timeBase, onChange: onChange, onCreateOption: onCustomInterval, options: options, selectedOptions: selectedOptions, singleSelection: { asPlainText: true }, placeholder: i18n_1.i18n.translate('visDefaultEditor.controls.timeInterval.selectIntervalPlaceholder', {
                defaultMessage: 'Select an interval',
            }), onBlur: setTouched })));
}
exports.TimeIntervalParamEditor = TimeIntervalParamEditor;
const tooManyBucketsTooltip = (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.timeInterval.createsTooManyBucketsTooltip", defaultMessage: "This interval creates too many buckets to show in the selected time range, so it has been scaled up." }));
const tooLargeBucketsTooltip = (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.timeInterval.createsTooLargeBucketsTooltip", defaultMessage: "This interval creates buckets that are too large to show in the selected time range, so it has been scaled down." }));
const selectOptionHelpText = (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.timeInterval.selectOptionHelpText", defaultMessage: "Select an option or create a custom value. Examples: 30s, 20m, 24h, 2d, 1w, 1M" }));
