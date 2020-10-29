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
exports.FilterRow = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../data/public");
const public_2 = require("../../../../kibana_react/public");
function FilterRow({ id, arrayIndex, customLabel, value, autoFocus, disableRemove, dataTestSubj, agg, onChangeValue, onRemoveFilter, }) {
    const { services } = public_2.useKibana();
    const [showCustomLabel, setShowCustomLabel] = react_1.useState(false);
    const filterLabel = i18n_1.i18n.translate('visDefaultEditor.controls.filters.filterLabel', {
        defaultMessage: 'Filter {index}',
        values: {
            index: arrayIndex + 1,
        },
    });
    const onBlur = () => {
        if (value.query.length > 0) {
            // Store filter to the query log so that it is available in autocomplete.
            services.data.query.addToQueryLog(services.appName, value);
        }
    };
    const FilterControl = (react_1.default.createElement("div", null,
        react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "tag", "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.filters.toggleFilterButtonAriaLabel', {
                defaultMessage: 'Toggle filter label',
            }), "aria-expanded": showCustomLabel, "aria-controls": `visEditorFilterLabel${arrayIndex}`, onClick: () => setShowCustomLabel(!showCustomLabel) }),
        react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "trash", color: "danger", disabled: disableRemove, "aria-label": i18n_1.i18n.translate('visDefaultEditor.controls.filters.removeFilterButtonAriaLabel', {
                defaultMessage: 'Remove this filter',
            }), onClick: () => onRemoveFilter(id) })));
    return (react_1.default.createElement(eui_1.EuiForm, null,
        react_1.default.createElement(eui_1.EuiFormRow, { label: `${filterLabel}${customLabel ? ` - ${customLabel}` : ''}`, labelAppend: FilterControl, fullWidth: true },
            react_1.default.createElement(public_1.QueryStringInput, { query: value, indexPatterns: [agg.getIndexPattern()], onChange: (query) => onChangeValue(id, query, customLabel), onBlur: onBlur, disableAutoFocus: !autoFocus, dataTestSubj: dataTestSubj, bubbleSubmitEvent: true, languageSwitcherPopoverAnchorPosition: "leftDown" })),
        showCustomLabel ? (react_1.default.createElement(eui_1.EuiFormRow, { id: `visEditorFilterLabel${arrayIndex}`, label: i18n_1.i18n.translate('visDefaultEditor.controls.filters.definiteFilterLabel', {
                defaultMessage: 'Filter {index} label',
                description: "'Filter {index}' represents the name of the filter as a noun, similar to 'label for filter 1'.",
                values: {
                    index: arrayIndex + 1,
                },
            }), fullWidth: true, compressed: true },
            react_1.default.createElement(eui_1.EuiFieldText, { value: customLabel, placeholder: i18n_1.i18n.translate('visDefaultEditor.controls.filters.labelPlaceholder', {
                    defaultMessage: 'Label',
                }), onChange: (ev) => onChangeValue(id, value, ev.target.value), fullWidth: true, compressed: true }))) : null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
}
exports.FilterRow = FilterRow;
