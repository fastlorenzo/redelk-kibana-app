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
exports.FilterLabel = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const filter_operators_1 = require("./filter_operators");
const common_1 = require("../../../../../common");
function FilterLabel({ filter, valueLabel }) {
    const prefixText = filter.meta.negate
        ? ` ${i18n_1.i18n.translate('data.filter.filterBar.negatedFilterPrefix', {
            defaultMessage: 'NOT ',
        })}`
        : '';
    const prefix = filter.meta.negate && !filter.meta.disabled ? (react_1.default.createElement(eui_1.EuiTextColor, { color: "danger" }, prefixText)) : (prefixText);
    const getValue = (text) => {
        return react_1.default.createElement("span", { className: "globalFilterLabel__value" }, text);
    };
    if (filter.meta.alias !== null) {
        return (react_1.default.createElement(react_1.Fragment, null,
            prefix,
            filter.meta.alias));
    }
    switch (filter.meta.type) {
        case common_1.FILTERS.EXISTS:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                filter.meta.key,
                ": ",
                getValue(`${filter_operators_1.existsOperator.message}`)));
        case common_1.FILTERS.GEO_BOUNDING_BOX:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                filter.meta.key,
                ": ",
                getValue(valueLabel)));
        case common_1.FILTERS.GEO_POLYGON:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                filter.meta.key,
                ": ",
                getValue(valueLabel)));
        case common_1.FILTERS.PHRASES:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                filter.meta.key,
                ": ",
                getValue(`${filter_operators_1.isOneOfOperator.message} ${valueLabel}`)));
        case common_1.FILTERS.QUERY_STRING:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                getValue(`${valueLabel}`)));
        case common_1.FILTERS.PHRASE:
        case common_1.FILTERS.RANGE:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                filter.meta.key,
                ": ",
                getValue(valueLabel)));
        default:
            return (react_1.default.createElement(react_1.Fragment, null,
                prefix,
                getValue(`${JSON.stringify(filter.query) || filter.meta.value}`)));
    }
}
exports.FilterLabel = FilterLabel;
