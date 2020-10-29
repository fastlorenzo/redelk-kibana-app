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
exports.DateRangesParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const datemath_1 = tslib_1.__importDefault(require("@elastic/datemath"));
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const react_use_1 = require("react-use");
const public_1 = require("../../../../kibana_react/public");
const FROM_PLACEHOLDER = '\u2212\u221E';
const TO_PLACEHOLDER = '+\u221E';
const generateId = eui_1.htmlIdGenerator();
const validateDateMath = (value = '') => {
    if (!value) {
        return true;
    }
    const moment = datemath_1.default.parse(value);
    return moment && moment.isValid();
};
function DateRangesParamEditor({ value = [], setValue, setValidity, }) {
    const { services } = public_1.useKibana();
    const [ranges, setRanges] = react_1.useState(() => value.map((range) => ({ ...range, id: generateId() })));
    const hasInvalidRange = value.some(({ from, to }) => (!from && !to) || !validateDateMath(from) || !validateDateMath(to));
    const updateRanges = react_1.useCallback((rangeValues) => {
        // do not set internal id parameter into saved object
        setValue(rangeValues.map((range) => lodash_1.omit(range, 'id')));
        setRanges(rangeValues);
    }, [setValue]);
    const onAddRange = react_1.useCallback(() => updateRanges([...ranges, { id: generateId() }]), [
        ranges,
        updateRanges,
    ]);
    react_use_1.useMount(() => {
        // set up an initial range when there is no default range
        if (!value.length) {
            onAddRange();
        }
    });
    react_1.useEffect(() => {
        // responsible for discarding changes
        if (value.length !== ranges.length ||
            value.some((range, index) => !lodash_1.isEqual(range, lodash_1.omit(ranges[index], 'id')))) {
            setRanges(value.map((range) => ({ ...range, id: generateId() })));
        }
    }, [ranges, value]);
    react_1.useEffect(() => {
        setValidity(!hasInvalidRange);
    }, [hasInvalidRange, setValidity]);
    const onRemoveRange = (id) => updateRanges(ranges.filter((range) => range.id !== id));
    const onChangeRange = (id, key, newValue) => updateRanges(ranges.map((range) => range.id === id
        ? {
            ...range,
            [key]: newValue === '' ? undefined : newValue,
        }
        : range));
    return (react_1.default.createElement(eui_1.EuiFormRow, { compressed: true, fullWidth: true },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                react_1.default.createElement(eui_1.EuiLink, { href: services.docLinks.links.date.dateMath, target: "_blank" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.dateRanges.acceptedDateFormatsLinkText", defaultMessage: "Acceptable date formats" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            ranges.map(({ from, to, id }, index) => {
                const deleteBtnTitle = i18n_1.i18n.translate('visDefaultEditor.controls.dateRanges.removeRangeButtonAriaLabel', {
                    defaultMessage: 'Remove the range of {from} to {to}',
                    values: { from: from || FROM_PLACEHOLDER, to: to || TO_PLACEHOLDER },
                });
                const areBothEmpty = !from && !to;
                return (react_1.default.createElement(react_1.Fragment, { key: id },
                    react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: "s", alignItems: "center" },
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(eui_1.EuiFieldText, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.dateRanges.fromColumnLabel', {
                                    defaultMessage: 'From',
                                    description: 'Beginning of a date range, e.g. *From* 2018-02-26 To 2018-02-28',
                                }), compressed: true, fullWidth: true, isInvalid: areBothEmpty || !validateDateMath(from), placeholder: FROM_PLACEHOLDER, value: from || '', onChange: (ev) => onChangeRange(id, 'from', ev.target.value), "data-test-subj": `visEditorDateRange${index}__from` })),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "sortRight", color: "subdued" })),
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(eui_1.EuiFieldText, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.dateRanges.toColumnLabel', {
                                    defaultMessage: 'To',
                                    description: 'End of a date range, e.g. From 2018-02-26 *To* 2018-02-28',
                                }), "data-test-subj": `visEditorDateRange${index}__to`, compressed: true, fullWidth: true, isInvalid: areBothEmpty || !validateDateMath(to), placeholder: TO_PLACEHOLDER, value: to || '', onChange: (ev) => onChangeRange(id, 'to', ev.target.value) })),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButtonIcon, { title: deleteBtnTitle, "aria-label": deleteBtnTitle, disabled: value.length === 1, color: "danger", iconType: "trash", onClick: () => onRemoveRange(id) }))),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })));
            }),
            hasInvalidRange && (react_1.default.createElement(eui_1.EuiFormErrorText, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.dateRanges.errorMessage", defaultMessage: "Each range should have at least one valid date." }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "plusInCircleFilled", onClick: onAddRange, size: "xs", "data-test-subj": "visEditorAddDateRange" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.dateRanges.addRangeButtonLabel", defaultMessage: "Add range" }))))));
}
exports.DateRangesParamEditor = DateRangesParamEditor;
