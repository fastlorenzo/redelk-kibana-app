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
exports.FilterBar = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_2 = tslib_1.__importStar(require("react"));
const filter_editor_1 = require("./filter_editor");
const filter_item_1 = require("./filter_item");
const filter_options_1 = require("./filter_options");
const public_1 = require("../../../../kibana_react/public");
const common_1 = require("../../../common");
function FilterBarUI(props) {
    const [isAddFilterPopoverOpen, setIsAddFilterPopoverOpen] = react_2.useState(false);
    const kibana = public_1.useKibana();
    const uiSettings = kibana.services.uiSettings;
    if (!uiSettings)
        return null;
    function onFiltersUpdated(filters) {
        if (props.onFiltersUpdated) {
            props.onFiltersUpdated(filters);
        }
    }
    function renderItems() {
        return props.filters.map((filter, i) => (react_2.default.createElement(eui_1.EuiFlexItem, { key: i, grow: false, className: "globalFilterBar__flexItem" },
            react_2.default.createElement(filter_item_1.FilterItem, { id: `${i}`, intl: props.intl, filter: filter, onUpdate: (newFilter) => onUpdate(i, newFilter), onRemove: () => onRemove(i), indexPatterns: props.indexPatterns, uiSettings: uiSettings }))));
    }
    function renderAddFilter() {
        const isPinned = uiSettings.get(common_1.UI_SETTINGS.FILTERS_PINNED_BY_DEFAULT);
        const [indexPattern] = props.indexPatterns;
        const index = indexPattern && indexPattern.id;
        const newFilter = common_1.buildEmptyFilter(isPinned, index);
        const button = (react_2.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", onClick: () => setIsAddFilterPopoverOpen(true), "data-test-subj": "addFilter", className: "globalFilterBar__addButton" },
            "+",
            ' ',
            react_2.default.createElement(react_1.FormattedMessage, { id: "data.filter.filterBar.addFilterButtonLabel", defaultMessage: "Add filter" })));
        return (react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_2.default.createElement(eui_1.EuiPopover, { id: "addFilterPopover", button: button, isOpen: isAddFilterPopoverOpen, closePopover: () => setIsAddFilterPopoverOpen(false), anchorPosition: "downLeft", withTitle: true, panelPaddingSize: "none", ownFocus: true, initialFocus: ".filterEditor__hiddenItem", repositionOnScroll: true },
                react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_2.default.createElement("div", { style: { width: 400 } },
                        react_2.default.createElement(filter_editor_1.FilterEditor, { filter: newFilter, indexPatterns: props.indexPatterns, onSubmit: onAdd, onCancel: () => setIsAddFilterPopoverOpen(false), key: JSON.stringify(newFilter) }))))));
    }
    function onAdd(filter) {
        setIsAddFilterPopoverOpen(false);
        const filters = [...props.filters, filter];
        onFiltersUpdated(filters);
    }
    function onRemove(i) {
        const filters = [...props.filters];
        filters.splice(i, 1);
        onFiltersUpdated(filters);
    }
    function onUpdate(i, filter) {
        const filters = [...props.filters];
        filters[i] = filter;
        onFiltersUpdated(filters);
    }
    function onEnableAll() {
        const filters = props.filters.map(common_1.enableFilter);
        onFiltersUpdated(filters);
    }
    function onDisableAll() {
        const filters = props.filters.map(common_1.disableFilter);
        onFiltersUpdated(filters);
    }
    function onPinAll() {
        const filters = props.filters.map(common_1.pinFilter);
        onFiltersUpdated(filters);
    }
    function onUnpinAll() {
        const filters = props.filters.map(common_1.unpinFilter);
        onFiltersUpdated(filters);
    }
    function onToggleAllNegated() {
        const filters = props.filters.map(common_1.toggleFilterNegated);
        onFiltersUpdated(filters);
    }
    function onToggleAllDisabled() {
        const filters = props.filters.map(common_1.toggleFilterDisabled);
        onFiltersUpdated(filters);
    }
    function onRemoveAll() {
        onFiltersUpdated([]);
    }
    const classes = classnames_1.default('globalFilterBar', props.className);
    return (react_2.default.createElement(eui_1.EuiFlexGroup, { className: "globalFilterGroup", gutterSize: "none", alignItems: "flexStart", responsive: false },
        react_2.default.createElement(eui_1.EuiFlexItem, { className: "globalFilterGroup__branch", grow: false },
            react_2.default.createElement(filter_options_1.FilterOptions, { onEnableAll: onEnableAll, onDisableAll: onDisableAll, onPinAll: onPinAll, onUnpinAll: onUnpinAll, onToggleAllNegated: onToggleAllNegated, onToggleAllDisabled: onToggleAllDisabled, onRemoveAll: onRemoveAll })),
        react_2.default.createElement(eui_1.EuiFlexItem, { className: "globalFilterGroup__filterFlexItem" },
            react_2.default.createElement(eui_1.EuiFlexGroup, { className: classes, wrap: true, responsive: false, gutterSize: "xs", alignItems: "center" },
                renderItems(),
                renderAddFilter()))));
}
exports.FilterBar = react_1.injectI18n(FilterBarUI);
