"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldIcon = exports.typeToEuiIconMap = void 0;
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
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const eui_1 = require("@elastic/eui");
// defaultIcon => a unknown datatype
const defaultIcon = { iconType: 'questionInCircle', color: 'gray' };
exports.typeToEuiIconMap = {
    boolean: { iconType: 'tokenBoolean' },
    // icon for an index pattern mapping conflict in discover
    conflict: { iconType: 'alert', color: 'euiVisColor9' },
    date: { iconType: 'tokenDate' },
    geo_point: { iconType: 'tokenGeo' },
    geo_shape: { iconType: 'tokenGeo' },
    ip: { iconType: 'tokenIP' },
    // is a plugin's data type https://www.elastic.co/guide/en/elasticsearch/plugins/current/mapper-murmur3-usage.html
    murmur3: { iconType: 'tokenFile' },
    number: { iconType: 'tokenNumber' },
    _source: { iconType: 'editorCodeBlock', color: 'gray' },
    string: { iconType: 'tokenString' },
    nested: { iconType: 'tokenNested' },
};
/**
 * Field token icon used across the app
 */
function FieldIcon({ type, label, size = 's', scripted, className, ...rest }) {
    const token = exports.typeToEuiIconMap[type] || defaultIcon;
    return (react_1.default.createElement(eui_1.EuiToken, Object.assign({}, token, { className: classnames_1.default('kbnFieldIcon', className), "aria-label": label || type, title: label || type, size: size, fill: scripted ? 'dark' : undefined }, rest)));
}
exports.FieldIcon = FieldIcon;
