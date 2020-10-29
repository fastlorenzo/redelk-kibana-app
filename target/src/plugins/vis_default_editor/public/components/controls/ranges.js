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
exports.RangesParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const FROM_PLACEHOLDER = '\u2212\u221E';
const TO_PLACEHOLDER = '+\u221E';
const generateId = eui_1.htmlIdGenerator();
const isEmpty = (value) => value === undefined || value === null;
function RangesParamEditor({ 'data-test-subj': dataTestSubj = 'range', addRangeValues, error, value = [], hidePlaceholders, setValue, setTouched, setValidity, validateRange, }) {
    const [ranges, setRanges] = react_1.useState(() => value.map((range) => ({ ...range, id: generateId() })));
    const updateRanges = react_1.useCallback((rangeValues) => {
        // do not set internal id parameter into saved object
        setValue(rangeValues.map((range) => lodash_1.omit(range, 'id')));
        setRanges(rangeValues);
        if (setTouched) {
            setTouched(true);
        }
    }, [setTouched, setValue]);
    const onAddRange = react_1.useCallback(() => addRangeValues
        ? updateRanges([...ranges, { ...addRangeValues(), id: generateId() }])
        : updateRanges([...ranges, { id: generateId() }]), [addRangeValues, ranges, updateRanges]);
    const onRemoveRange = (id) => updateRanges(ranges.filter((range) => range.id !== id));
    const onChangeRange = (id, key, newValue) => updateRanges(ranges.map((range) => range.id === id
        ? {
            ...range,
            [key]: newValue === '' ? undefined : parseFloat(newValue),
        }
        : range));
    // set up an initial range when there is no default range
    react_1.useEffect(() => {
        if (!value.length) {
            onAddRange();
        }
    }, [onAddRange, value.length]);
    react_1.useEffect(() => {
        // responsible for discarding changes
        if (value.length !== ranges.length ||
            value.some((range, index) => !lodash_1.isEqual(range, lodash_1.omit(ranges[index], 'id')))) {
            setRanges(value.map((range) => ({ ...range, id: generateId() })));
        }
    }, [ranges, value]);
    const hasInvalidRange = validateRange &&
        ranges.some(({ from, to, id }, index) => {
            const [isFromValid, isToValid] = validateRange({ from, to }, index);
            return !isFromValid || !isToValid;
        });
    react_1.useEffect(() => {
        if (setValidity) {
            setValidity(!hasInvalidRange);
        }
    }, [hasInvalidRange, setValidity]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { compressed: true, fullWidth: true },
        react_1.default.createElement(react_1.default.Fragment, null,
            ranges.map(({ from, to, id }, index) => {
                const deleteBtnTitle = i18n_1.i18n.translate('visDefaultEditor.controls.ranges.removeRangeButtonAriaLabel', {
                    defaultMessage: 'Remove the range of {from} to {to}',
                    values: {
                        from: isEmpty(from) ? FROM_PLACEHOLDER : from,
                        to: isEmpty(to) ? TO_PLACEHOLDER : to,
                    },
                });
                let isFromValid = true;
                let isToValid = true;
                if (validateRange) {
                    [isFromValid, isToValid] = validateRange({ from, to }, index);
                }
                const gtePrependLabel = i18n_1.i18n.translate('visDefaultEditor.controls.ranges.greaterThanOrEqualPrepend', {
                    defaultMessage: '\u2265',
                });
                const gteTooltipContent = i18n_1.i18n.translate('visDefaultEditor.controls.ranges.greaterThanOrEqualTooltip', {
                    defaultMessage: 'Greater than or equal to',
                });
                const ltPrependLabel = i18n_1.i18n.translate('visDefaultEditor.controls.ranges.lessThanPrepend', {
                    defaultMessage: '\u003c',
                });
                const ltTooltipContent = i18n_1.i18n.translate('visDefaultEditor.controls.ranges.lessThanTooltip', {
                    defaultMessage: 'Less than',
                });
                return (react_1.default.createElement(react_1.Fragment, { key: id },
                    react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s", alignItems: "center", responsive: false },
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(eui_1.EuiFieldNumber, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.ranges.fromLabel', {
                                    defaultMessage: 'From',
                                }), "data-test-subj": `${dataTestSubj}${index}__from`, value: isEmpty(from) ? '' : from, placeholder: hidePlaceholders ? undefined : FROM_PLACEHOLDER, onChange: (ev) => onChangeRange(id, 'from', ev.target.value), fullWidth: true, compressed: true, isInvalid: !isFromValid, prepend: react_1.default.createElement(eui_1.EuiToolTip, { content: gteTooltipContent },
                                    react_1.default.createElement(eui_1.EuiText, { size: "s" }, gtePrependLabel)) })),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "sortRight", color: "subdued" })),
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(eui_1.EuiFieldNumber, { "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.ranges.toLabel', {
                                    defaultMessage: 'To',
                                }), "data-test-subj": `${dataTestSubj}${index}__to`, value: isEmpty(to) ? '' : to, placeholder: hidePlaceholders ? undefined : TO_PLACEHOLDER, onChange: (ev) => onChangeRange(id, 'to', ev.target.value), fullWidth: true, compressed: true, isInvalid: !isToValid, prepend: react_1.default.createElement(eui_1.EuiToolTip, { content: ltTooltipContent },
                                    react_1.default.createElement(eui_1.EuiText, { size: "s" }, ltPrependLabel)) })),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButtonIcon, { title: deleteBtnTitle, "aria-label": deleteBtnTitle, disabled: value.length === 1, color: "danger", iconType: "trash", onClick: () => onRemoveRange(id) }))),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })));
            }),
            hasInvalidRange && error && react_1.default.createElement(eui_1.EuiFormErrorText, null, error),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": `${dataTestSubj}__addRangeButton`, iconType: "plusInCircleFilled", onClick: onAddRange, size: "xs" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.ranges.addRangeButtonLabel", defaultMessage: "Add range" }))))));
}
exports.RangesParamEditor = RangesParamEditor;
