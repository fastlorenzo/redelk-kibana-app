"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverFieldSearch = void 0;
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
/**
 * Component is Discover's side bar to  search of available fields
 * Additionally there's a button displayed that allows the user to show/hide more filter fields
 */
function DiscoverFieldSearch({ onChange, value, types }) {
    const searchPlaceholder = i18n_1.i18n.translate('discover.fieldChooser.searchPlaceHolder', {
        defaultMessage: 'Search field names',
    });
    const aggregatableLabel = i18n_1.i18n.translate('discover.fieldChooser.filter.aggregatableLabel', {
        defaultMessage: 'Aggregatable',
    });
    const searchableLabel = i18n_1.i18n.translate('discover.fieldChooser.filter.searchableLabel', {
        defaultMessage: 'Searchable',
    });
    const typeLabel = i18n_1.i18n.translate('discover.fieldChooser.filter.typeLabel', {
        defaultMessage: 'Type',
    });
    const typeOptions = types
        ? types.map((type) => {
            return { value: type, text: type };
        })
        : [{ value: 'any', text: 'any' }];
    const [activeFiltersCount, setActiveFiltersCount] = react_1.useState(0);
    const [isPopoverOpen, setPopoverOpen] = react_1.useState(false);
    const [values, setValues] = react_1.useState({
        searchable: 'any',
        aggregatable: 'any',
        type: 'any',
        missing: true,
    });
    if (typeof value !== 'string') {
        // at initial rendering value is undefined (angular related), this catches the warning
        // should be removed once all is react
        return null;
    }
    const filterBtnAriaLabel = isPopoverOpen
        ? i18n_1.i18n.translate('discover.fieldChooser.toggleFieldFilterButtonHideAriaLabel', {
            defaultMessage: 'Hide field filter settings',
        })
        : i18n_1.i18n.translate('discover.fieldChooser.toggleFieldFilterButtonShowAriaLabel', {
            defaultMessage: 'Show field filter settings',
        });
    const handleFacetButtonClicked = () => {
        setPopoverOpen(!isPopoverOpen);
    };
    const applyFilterValue = (id, filterValue) => {
        switch (filterValue) {
            case 'any':
                if (id !== 'type') {
                    onChange(id, undefined);
                }
                else {
                    onChange(id, filterValue);
                }
                break;
            case 'true':
                onChange(id, true);
                break;
            case 'false':
                onChange(id, false);
                break;
            default:
                onChange(id, filterValue);
        }
    };
    const isFilterActive = (name, filterValue) => {
        return name !== 'missing' && filterValue !== 'any';
    };
    const handleValueChange = (name, filterValue) => {
        const previousValue = values[name];
        updateFilterCount(name, previousValue, filterValue);
        const updatedValues = { ...values };
        updatedValues[name] = filterValue;
        setValues(updatedValues);
        applyFilterValue(name, filterValue);
    };
    const updateFilterCount = (name, previousValue, currentValue) => {
        const previouslyFilterActive = isFilterActive(name, previousValue);
        const filterActive = isFilterActive(name, currentValue);
        const diff = Number(filterActive) - Number(previouslyFilterActive);
        setActiveFiltersCount(activeFiltersCount + diff);
    };
    const handleMissingChange = (e) => {
        const missingValue = e.target.checked;
        handleValueChange('missing', missingValue);
    };
    const buttonContent = (react_1.default.createElement(eui_1.EuiFacetButton, { "aria-label": filterBtnAriaLabel, "data-test-subj": "toggleFieldFilterButton", className: "dscFieldSearch__toggleButton", icon: react_1.default.createElement(eui_1.EuiIcon, { type: "filter" }), isSelected: activeFiltersCount > 0, quantity: activeFiltersCount, onClick: handleFacetButtonClicked },
        react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.fieldFilterFacetButtonLabel", defaultMessage: "Filter by type" })));
    const select = (id, selectOptions, selectValue) => {
        return (react_1.default.createElement(eui_1.EuiSelect, { id: `${id}-select`, options: selectOptions, value: selectValue, onChange: (e) => handleValueChange(id, e.target.value), "aria-label": i18n_1.i18n.translate('discover.fieldChooser.filter.fieldSelectorLabel', {
                defaultMessage: 'Selection of {id} filter options',
                values: { id },
            }), "data-test-subj": `${id}Select`, compressed: true }));
    };
    const toggleButtons = (id) => {
        return [
            {
                id: `${id}-any`,
                label: 'any',
            },
            {
                id: `${id}-true`,
                label: 'yes',
            },
            {
                id: `${id}-false`,
                label: 'no',
            },
        ];
    };
    const buttonGroup = (id, legend) => {
        return (react_1.default.createElement(eui_1.EuiButtonGroup, { legend: legend, options: toggleButtons(id), idSelected: `${id}-${values[id]}`, onChange: (optionId) => handleValueChange(id, optionId.replace(`${id}-`, '')), buttonSize: "compressed", isFullWidth: true, "data-test-subj": `${id}ButtonGroup` }));
    };
    const selectionPanel = (react_1.default.createElement("div", { className: "dscFieldSearch__formWrapper" },
        react_1.default.createElement(eui_1.EuiForm, { "data-test-subj": "filterSelectionPanel" },
            react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: aggregatableLabel, display: "columnCompressed" }, buttonGroup('aggregatable', aggregatableLabel)),
            react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: searchableLabel, display: "columnCompressed" }, buttonGroup('searchable', searchableLabel)),
            react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: typeLabel, display: "columnCompressed" }, select('type', typeOptions, values.type)))));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: 's' },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiFieldSearch, { "aria-label": searchPlaceholder, "data-test-subj": "fieldFilterSearchInput", compressed: true, fullWidth: true, onChange: (event) => onChange('name', event.currentTarget.value), placeholder: searchPlaceholder, value: value }))),
        react_1.default.createElement("div", { className: "dscFieldSearch__filterWrapper" },
            react_1.default.createElement(eui_1.EuiOutsideClickDetector, { onOutsideClick: () => { }, isDisabled: !isPopoverOpen },
                react_1.default.createElement(eui_1.EuiPopover, { id: "dataPanelTypeFilter", panelClassName: "euiFilterGroup__popoverPanel", panelPaddingSize: "none", anchorPosition: "downLeft", display: "block", isOpen: isPopoverOpen, closePopover: () => {
                        setPopoverOpen(false);
                    }, button: buttonContent },
                    react_1.default.createElement(eui_1.EuiPopoverTitle, null, i18n_1.i18n.translate('discover.fieldChooser.filter.filterByTypeLabel', {
                        defaultMessage: 'Filter by type',
                    })),
                    selectionPanel,
                    react_1.default.createElement(eui_1.EuiPopoverFooter, null,
                        react_1.default.createElement(eui_1.EuiSwitch, { label: i18n_1.i18n.translate('discover.fieldChooser.filter.hideMissingFieldsLabel', {
                                defaultMessage: 'Hide missing fields',
                            }), checked: values.missing, onChange: handleMissingChange, "data-test-subj": "missingSwitch" })))))));
}
exports.DiscoverFieldSearch = DiscoverFieldSearch;
