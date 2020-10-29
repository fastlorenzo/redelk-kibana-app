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
exports.FILTER_OPERATORS = exports.doesNotExistOperator = exports.existsOperator = exports.isNotBetweenOperator = exports.isBetweenOperator = exports.isNotOneOfOperator = exports.isOneOfOperator = exports.isNotOperator = exports.isOperator = void 0;
const i18n_1 = require("@kbn/i18n");
const filters_1 = require("../../../../../common/es_query/filters");
exports.isOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.isOperatorOptionLabel', {
        defaultMessage: 'is',
    }),
    type: filters_1.FILTERS.PHRASE,
    negate: false,
};
exports.isNotOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.isNotOperatorOptionLabel', {
        defaultMessage: 'is not',
    }),
    type: filters_1.FILTERS.PHRASE,
    negate: true,
};
exports.isOneOfOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.isOneOfOperatorOptionLabel', {
        defaultMessage: 'is one of',
    }),
    type: filters_1.FILTERS.PHRASES,
    negate: false,
    fieldTypes: ['string', 'number', 'date', 'ip', 'geo_point', 'geo_shape'],
};
exports.isNotOneOfOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.isNotOneOfOperatorOptionLabel', {
        defaultMessage: 'is not one of',
    }),
    type: filters_1.FILTERS.PHRASES,
    negate: true,
    fieldTypes: ['string', 'number', 'date', 'ip', 'geo_point', 'geo_shape'],
};
exports.isBetweenOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.isBetweenOperatorOptionLabel', {
        defaultMessage: 'is between',
    }),
    type: filters_1.FILTERS.RANGE,
    negate: false,
    fieldTypes: ['number', 'date', 'ip'],
};
exports.isNotBetweenOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.isNotBetweenOperatorOptionLabel', {
        defaultMessage: 'is not between',
    }),
    type: filters_1.FILTERS.RANGE,
    negate: true,
    fieldTypes: ['number', 'date', 'ip'],
};
exports.existsOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.existsOperatorOptionLabel', {
        defaultMessage: 'exists',
    }),
    type: filters_1.FILTERS.EXISTS,
    negate: false,
};
exports.doesNotExistOperator = {
    message: i18n_1.i18n.translate('data.filter.filterEditor.doesNotExistOperatorOptionLabel', {
        defaultMessage: 'does not exist',
    }),
    type: filters_1.FILTERS.EXISTS,
    negate: true,
};
exports.FILTER_OPERATORS = [
    exports.isOperator,
    exports.isNotOperator,
    exports.isOneOfOperator,
    exports.isNotOneOfOperator,
    exports.isBetweenOperator,
    exports.isNotBetweenOperator,
    exports.existsOperator,
    exports.doesNotExistOperator,
];
