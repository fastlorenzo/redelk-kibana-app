"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShardFailureDescription = exports.formatValueByKey = exports.formatKey = void 0;
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
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../../core/public");
const shard_failure_description_header_1 = require("./shard_failure_description_header");
/**
 * Provides pretty formatting of a given key string
 * e.g. formats "this_key.is_nice" to "This key is nice"
 * @param key
 */
function formatKey(key) {
    const nameCapitalized = key.charAt(0).toUpperCase() + key.slice(1);
    return nameCapitalized.replace(/[\._]/g, ' ');
}
exports.formatKey = formatKey;
/**
 * Adds a EuiCodeBlock to values of  `script` and `script_stack` key
 * Values of other keys are handled a strings
 * @param value
 * @param key
 */
function formatValueByKey(value, key) {
    if (key === 'script' || key === 'script_stack') {
        const valueScript = Array.isArray(value) ? value.join('\n') : String(value);
        return (react_1.default.createElement(eui_1.EuiCodeBlock, { language: "java", paddingSize: "s", isCopyable: true }, valueScript));
    }
    else {
        return String(value);
    }
}
exports.formatValueByKey = formatValueByKey;
function ShardFailureDescription(props) {
    const flattendReason = public_1.getFlattenedObject(props.reason);
    const listItems = Object.entries(flattendReason).map(([key, value]) => ({
        title: formatKey(key),
        description: formatValueByKey(value, key),
    }));
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(shard_failure_description_header_1.ShardFailureDescriptionHeader, Object.assign({}, props)),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiDescriptionList, { listItems: listItems, type: "column", compressed: true, className: "shardFailureModal__desc", titleProps: { className: 'shardFailureModal__descTitle' }, descriptionProps: { className: 'shardFailureModal__descValue' } })));
}
exports.ShardFailureDescription = ShardFailureDescription;
