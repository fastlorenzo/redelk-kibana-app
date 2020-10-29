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
exports.FiltersParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const react_use_1 = require("react-use");
const public_1 = require("../../../../data/public");
const public_2 = require("../../../../kibana_react/public");
const filter_1 = require("./filter");
const generateId = eui_1.htmlIdGenerator();
function FiltersParamEditor({ agg, value = [], setValue }) {
    const [filters, setFilters] = react_1.useState(() => value.map((filter) => ({ ...filter, id: generateId() })));
    react_use_1.useMount(() => {
        // set parsed values into model after initialization
        setValue(filters.map((filter) => lodash_1.omit({ ...filter, input: filter.input }, 'id')));
    });
    react_1.useEffect(() => {
        // responsible for discarding changes
        if (value.length !== filters.length ||
            value.some((filter, index) => !lodash_1.isEqual(filter, lodash_1.omit(filters[index], 'id')))) {
            setFilters(value.map((filter) => ({ ...filter, id: generateId() })));
        }
    }, [filters, value]);
    const updateFilters = (updatedFilters) => {
        // do not set internal id parameter into saved object
        setValue(updatedFilters.map((filter) => lodash_1.omit(filter, 'id')));
        setFilters(updatedFilters);
    };
    const { services } = public_2.useKibana();
    const onAddFilter = () => updateFilters([
        ...filters,
        {
            input: { query: '', language: services.uiSettings.get(public_1.UI_SETTINGS.SEARCH_QUERY_LANGUAGE) },
            label: '',
            id: generateId(),
        },
    ]);
    const onRemoveFilter = (id) => updateFilters(filters.filter((filter) => filter.id !== id));
    const onChangeValue = (id, query, label) => updateFilters(filters.map((filter) => filter.id === id
        ? {
            ...filter,
            input: query,
            label,
        }
        : filter));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        filters.map(({ input, label, id }, arrayIndex) => (react_1.default.createElement(filter_1.FilterRow, { key: id, id: id, arrayIndex: arrayIndex, customLabel: label, value: input, autoFocus: arrayIndex === filters.length - 1, disableRemove: arrayIndex === 0 && filters.length === 1, dataTestSubj: `visEditorFilterInput_${agg.id}_${arrayIndex}`, agg: agg, onChangeValue: onChangeValue, onRemoveFilter: onRemoveFilter }))),
        react_1.default.createElement(eui_1.EuiButton, { iconType: "plusInCircle", fill: true, fullWidth: true, onClick: onAddFilter, size: "s", "data-test-subj": "visEditorAddFilterButton" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.controls.filters.addFilterButtonLabel", defaultMessage: "Add filter" })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
}
exports.FiltersParamEditor = FiltersParamEditor;
