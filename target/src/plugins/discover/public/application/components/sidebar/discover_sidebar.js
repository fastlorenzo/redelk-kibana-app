"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverSidebar = void 0;
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
require("./discover_sidebar.scss");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const lodash_1 = require("lodash");
const react_2 = require("@kbn/i18n/react");
const discover_field_1 = require("./discover_field");
const discover_index_pattern_1 = require("./discover_index_pattern");
const discover_field_search_1 = require("./discover_field_search");
const common_1 = require("../../../../common");
const group_fields_1 = require("./lib/group_fields");
const public_1 = require("../../../../../data/public");
const get_details_1 = require("./lib/get_details");
const field_filter_1 = require("./lib/field_filter");
const get_index_pattern_field_list_1 = require("./lib/get_index_pattern_field_list");
const kibana_services_1 = require("../../../kibana_services");
function DiscoverSidebar({ columns, fieldCounts, hits, indexPatternList, onAddField, onAddFilter, onRemoveField, selectedIndexPattern, setIndexPattern, state, }) {
    const [openFieldMap, setOpenFieldMap] = react_1.useState(new Map());
    const [showFields, setShowFields] = react_1.useState(false);
    const [fields, setFields] = react_1.useState(null);
    const [fieldFilterState, setFieldFilterState] = react_1.useState(field_filter_1.getDefaultFieldFilter());
    const services = react_1.useMemo(() => kibana_services_1.getServices(), []);
    react_1.useEffect(() => {
        const newFields = get_index_pattern_field_list_1.getIndexPatternFieldList(selectedIndexPattern, fieldCounts, services);
        setFields(newFields);
    }, [selectedIndexPattern, fieldCounts, hits, services]);
    const onShowDetails = react_1.useCallback((show, field) => {
        if (!show) {
            setOpenFieldMap(new Map(openFieldMap.set(field.name, false)));
        }
        else {
            setOpenFieldMap(new Map(openFieldMap.set(field.name, true)));
            if (services.capabilities.discover.save) {
                selectedIndexPattern.popularizeField(field.name, 1);
            }
        }
    }, [openFieldMap, selectedIndexPattern, services.capabilities.discover.save]);
    const onChangeFieldSearch = react_1.useCallback((field, value) => {
        const newState = field_filter_1.setFieldFilterProp(fieldFilterState, field, value);
        setFieldFilterState(newState);
    }, [fieldFilterState]);
    const getDetailsByField = react_1.useCallback((ipField) => get_details_1.getDetails(ipField, selectedIndexPattern, state, columns, hits, services), [selectedIndexPattern, state, columns, hits, services]);
    const popularLimit = services.uiSettings.get(common_1.FIELDS_LIMIT_SETTING);
    const useShortDots = services.uiSettings.get(public_1.UI_SETTINGS.SHORT_DOTS_ENABLE);
    const { selected: selectedFields, popular: popularFields, unpopular: unpopularFields, } = react_1.useMemo(() => group_fields_1.groupFields(fields, columns, popularLimit, fieldCounts, fieldFilterState), [
        fields,
        columns,
        popularLimit,
        fieldCounts,
        fieldFilterState,
    ]);
    const fieldTypes = react_1.useMemo(() => {
        const result = ['any'];
        if (Array.isArray(fields)) {
            for (const field of fields) {
                if (result.indexOf(field.type) === -1) {
                    result.push(field.type);
                }
            }
        }
        return result;
    }, [fields]);
    if (!selectedIndexPattern || !fields) {
        return null;
    }
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement("section", { className: "sidebar-list", "aria-label": i18n_1.i18n.translate('discover.fieldChooser.filter.indexAndFieldsSectionAriaLabel', {
                defaultMessage: 'Index and fields',
            }) },
            react_1.default.createElement(discover_index_pattern_1.DiscoverIndexPattern, { selectedIndexPattern: selectedIndexPattern, setIndexPattern: setIndexPattern, indexPatternList: lodash_1.sortBy(indexPatternList, (o) => o.attributes.title) }),
            react_1.default.createElement("div", { className: "dscSidebar__item" },
                react_1.default.createElement("form", null,
                    react_1.default.createElement(discover_field_search_1.DiscoverFieldSearch, { onChange: onChangeFieldSearch, value: fieldFilterState.name, types: fieldTypes }))),
            react_1.default.createElement("div", { className: "sidebar-list" },
                fields.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "xxxs", id: "selected_fields" },
                        react_1.default.createElement("h3", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.filter.selectedFieldsTitle", defaultMessage: "Selected fields" }))),
                    react_1.default.createElement("ul", { className: "dscSidebarList dscFieldList--selected", "aria-labelledby": "selected_fields", "data-test-subj": `fieldList-selected` }, selectedFields.map((field, idx) => {
                        return (react_1.default.createElement("li", { key: `field${idx}`, "data-attr-field": field.name, className: "dscSidebar__item" },
                            react_1.default.createElement(discover_field_1.DiscoverField, { field: field, indexPattern: selectedIndexPattern, onAddField: onAddField, onRemoveField: onRemoveField, onAddFilter: onAddFilter, onShowDetails: onShowDetails, getDetails: getDetailsByField, showDetails: openFieldMap.get(field.name) || false, selected: true, useShortDots: useShortDots })));
                    })),
                    react_1.default.createElement("div", { className: "euiFlexGroup euiFlexGroup--gutterMedium" },
                        react_1.default.createElement(eui_1.EuiTitle, { size: "xxxs", id: "available_fields", className: "euiFlexItem" },
                            react_1.default.createElement("h3", null,
                                react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.filter.availableFieldsTitle", defaultMessage: "Available fields" }))),
                        react_1.default.createElement("div", { className: "euiFlexItem euiFlexItem--flexGrowZero" },
                            react_1.default.createElement(eui_1.EuiButtonIcon, { className: 'visible-xs visible-sm dscFieldChooser__toggle', iconType: showFields ? 'arrowDown' : 'arrowRight', onClick: () => setShowFields(!showFields), "aria-label": showFields
                                    ? i18n_1.i18n.translate('discover.fieldChooser.filter.indexAndFieldsSectionHideAriaLabel', {
                                        defaultMessage: 'Hide fields',
                                    })
                                    : i18n_1.i18n.translate('discover.fieldChooser.filter.indexAndFieldsSectionShowAriaLabel', {
                                        defaultMessage: 'Show fields',
                                    }) }))))),
                popularFields.length > 0 && (react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "xxxs", className: `dscFieldListHeader ${!showFields ? 'hidden-sm hidden-xs' : ''}` },
                        react_1.default.createElement("h4", { style: { fontWeight: 'normal' }, id: "available_fields_popular" },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "discover.fieldChooser.filter.popularTitle", defaultMessage: "Popular" }))),
                    react_1.default.createElement("ul", { className: `dscFieldList dscFieldList--popular ${!showFields ? 'hidden-sm hidden-xs' : ''}`, "aria-labelledby": "available_fields available_fields_popular", "data-test-subj": `fieldList-popular` }, popularFields.map((field, idx) => {
                        return (react_1.default.createElement("li", { key: `field${idx}`, "data-attr-field": field.name, className: "dscSidebar__item" },
                            react_1.default.createElement(discover_field_1.DiscoverField, { field: field, indexPattern: selectedIndexPattern, onAddField: onAddField, onRemoveField: onRemoveField, onAddFilter: onAddFilter, onShowDetails: onShowDetails, getDetails: getDetailsByField, showDetails: openFieldMap.get(field.name) || false, useShortDots: useShortDots })));
                    })))),
                react_1.default.createElement("ul", { className: `dscFieldList dscFieldList--unpopular ${!showFields ? 'hidden-sm hidden-xs' : ''}`, "aria-labelledby": "available_fields", "data-test-subj": `fieldList-unpopular` }, unpopularFields.map((field, idx) => {
                    return (react_1.default.createElement("li", { key: `field${idx}`, "data-attr-field": field.name, className: "dscSidebar__item" },
                        react_1.default.createElement(discover_field_1.DiscoverField, { field: field, indexPattern: selectedIndexPattern, onAddField: onAddField, onRemoveField: onRemoveField, onAddFilter: onAddFilter, onShowDetails: onShowDetails, getDetails: getDetailsByField, showDetails: openFieldMap.get(field.name) || false, useShortDots: useShortDots })));
                }))))));
}
exports.DiscoverSidebar = DiscoverSidebar;
