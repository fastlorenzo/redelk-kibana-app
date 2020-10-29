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
exports.IpRangesParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const from_to_list_1 = require("./components/from_to_list");
const mask_list_1 = require("./components/mask_list");
const ip_range_type_1 = require("./ip_range_type");
function IpRangesParamEditor({ agg, value = { fromTo: [], mask: [] }, setTouched, setValue, setValidity, showValidation, }) {
    const handleMaskListChange = react_1.useCallback((items) => setValue({
        ...value,
        [ip_range_type_1.IpRangeTypes.MASK]: items,
    }), [setValue, value]);
    const handleFromToListChange = react_1.useCallback((items) => setValue({
        ...value,
        [ip_range_type_1.IpRangeTypes.FROM_TO]: items,
    }), [setValue, value]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, id: `visEditorIpRange${agg.id}`, compressed: true }, agg.params.ipRangeType === ip_range_type_1.IpRangeTypes.MASK ? (react_1.default.createElement(mask_list_1.MaskList, { list: value.mask, showValidation: showValidation, onBlur: setTouched, onChange: handleMaskListChange, setValidity: setValidity })) : (react_1.default.createElement(from_to_list_1.FromToList, { list: value.fromTo, showValidation: showValidation, onBlur: setTouched, onChange: handleFromToListChange, setValidity: setValidity }))));
}
exports.IpRangesParamEditor = IpRangesParamEditor;
