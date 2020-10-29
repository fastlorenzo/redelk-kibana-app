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
exports.IncludeExcludeParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const string_1 = require("./string");
const public_1 = require("../../../../data/public");
const simple_number_list_1 = require("./components/simple_number_list");
const { isNumberType } = public_1.search.aggs;
function IncludeExcludeParamEditor(props) {
    const { agg, value, setValue } = props;
    const isAggOfNumberType = isNumberType(agg);
    // This useEffect converts value from string type to number and back when the field type is changed
    react_1.useEffect(() => {
        if (isAggOfNumberType && !Array.isArray(value) && value !== undefined) {
            const numberArray = value
                .split('|')
                .map((item) => parseFloat(item))
                .filter((number) => Number.isFinite(number));
            setValue(numberArray.length ? numberArray : ['']);
        }
        else if (!isAggOfNumberType && Array.isArray(value) && value !== undefined) {
            setValue(value.filter((item) => item !== '').join('|'));
        }
    }, [isAggOfNumberType, setValue, value]);
    return isAggOfNumberType ? (react_1.default.createElement(simple_number_list_1.SimpleNumberList, Object.assign({}, props, { value: value }))) : (react_1.default.createElement(string_1.StringParamEditor, Object.assign({}, props, { value: value })));
}
exports.IncludeExcludeParamEditor = IncludeExcludeParamEditor;
