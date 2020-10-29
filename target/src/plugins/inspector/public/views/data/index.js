"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataViewDescription = void 0;
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
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const data_view_1 = require("./components/data_view");
exports.getDataViewDescription = (uiSettings) => ({
    title: i18n_1.i18n.translate('inspector.data.dataTitle', {
        defaultMessage: 'Data',
    }),
    order: 10,
    help: i18n_1.i18n.translate('inspector.data.dataDescriptionTooltip', {
        defaultMessage: 'View the data behind the visualization',
    }),
    shouldShow(adapters) {
        return Boolean(adapters.data);
    },
    component: (props) => (react_1.default.createElement(data_view_1.DataViewComponent, Object.assign({}, props, { uiSettings: uiSettings }))),
});
