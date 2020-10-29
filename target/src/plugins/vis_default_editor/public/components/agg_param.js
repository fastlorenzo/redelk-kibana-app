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
exports.DefaultEditorAggParam = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const agg_params_state_1 = require("./agg_params_state");
function DefaultEditorAggParam(props) {
    const { agg, aggParam, paramEditor: ParamEditor, setAggParamValue, onChangeParamsState, ...rest } = props;
    const setValidity = react_1.useCallback((valid) => {
        onChangeParamsState({
            type: agg_params_state_1.AGG_PARAMS_ACTION_KEYS.VALID,
            paramName: aggParam.name,
            payload: valid,
        });
    }, [onChangeParamsState, aggParam.name]);
    // setTouched can be called from sub-agg which passes a parameter
    const setTouched = react_1.useCallback((isTouched = true) => {
        onChangeParamsState({
            type: agg_params_state_1.AGG_PARAMS_ACTION_KEYS.TOUCHED,
            paramName: aggParam.name,
            payload: isTouched,
        });
    }, [onChangeParamsState, aggParam.name]);
    const setValue = react_1.useCallback((value) => {
        if (props.value !== value) {
            setAggParamValue(agg.id, aggParam.name, value);
        }
    }, [setAggParamValue, agg.id, aggParam.name, props.value]);
    react_1.useEffect(() => {
        if (aggParam.shouldShow && !aggParam.shouldShow(agg)) {
            setValidity(true);
        }
    }, [agg, agg.params.field, aggParam, setValidity]);
    if (aggParam.shouldShow && !aggParam.shouldShow(agg)) {
        return null;
    }
    return (react_1.default.createElement(ParamEditor, Object.assign({ agg: agg, aggParam: aggParam, setValidity: setValidity, setTouched: setTouched, setValue: setValue }, rest)));
}
exports.DefaultEditorAggParam = DefaultEditorAggParam;
