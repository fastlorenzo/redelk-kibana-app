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
exports.TopSortFieldParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const field_1 = require("./field");
function TopSortFieldParamEditor(props) {
    const customLabel = i18n_1.i18n.translate('visDefaultEditor.controls.sortOnLabel', {
        defaultMessage: 'Sort on',
    });
    return react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, props, { customLabel: customLabel }));
}
exports.TopSortFieldParamEditor = TopSortFieldParamEditor;
