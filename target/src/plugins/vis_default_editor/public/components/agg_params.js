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
exports.DefaultEditorAggParams = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const useUnmount_1 = tslib_1.__importDefault(require("react-use/lib/useUnmount"));
const public_1 = require("../../../data/public");
const agg_select_1 = require("./agg_select");
const agg_param_1 = require("./agg_param");
const agg_params_helper_1 = require("./agg_params_helper");
const agg_params_state_1 = require("./agg_params_state");
const utils_1 = require("./utils");
const schemas_1 = require("../schemas");
const public_2 = require("../../../kibana_react/public");
const FIXED_VALUE_PROP = 'fixedValue';
const DEFAULT_PROP = 'default';
function DefaultEditorAggParams({ agg, aggError, aggIndex = 0, aggIsTooLow = false, className, disabledParams, groupName, formIsTouched, indexPattern, metricAggs, state, setAggParamValue, onAggTypeChange, setTouched, setValidity, schemas, allowedAggs = [], hideCustomLabel = false, }) {
    const schema = react_1.useMemo(() => schemas_1.getSchemaByName(schemas, agg.schema), [agg.schema, schemas]);
    const aggFilter = react_1.useMemo(() => [...allowedAggs, ...(schema.aggFilter || [])], [
        allowedAggs,
        schema.aggFilter,
    ]);
    const { services } = public_2.useKibana();
    const aggTypes = react_1.useMemo(() => services.data.search.aggs.types.getAll(), [
        services.data.search.aggs.types,
    ]);
    const groupedAggTypeOptions = react_1.useMemo(() => agg_params_helper_1.getAggTypeOptions(aggTypes, agg, indexPattern, groupName, aggFilter), [aggTypes, agg, indexPattern, groupName, aggFilter]);
    const error = aggIsTooLow
        ? i18n_1.i18n.translate('visDefaultEditor.aggParams.errors.aggWrongRunOrderErrorMessage', {
            defaultMessage: '"{schema}" aggs must run before all other buckets!',
            values: { schema: schema.title },
        })
        : '';
    const aggTypeName = agg.type?.name;
    const fieldName = agg.params?.field?.name;
    const editorConfig = react_1.useMemo(() => utils_1.getEditorConfig(indexPattern, aggTypeName, fieldName), [
        indexPattern,
        aggTypeName,
        fieldName,
    ]);
    const params = react_1.useMemo(() => agg_params_helper_1.getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas, hideCustomLabel }), [agg, editorConfig, metricAggs, state, schemas, hideCustomLabel]);
    const allParams = [...params.basic, ...params.advanced];
    const [paramsState, onChangeParamsState] = react_1.useReducer(agg_params_state_1.aggParamsReducer, allParams, agg_params_state_1.initAggParamsState);
    const [aggType, onChangeAggType] = react_1.useReducer(agg_params_state_1.aggTypeReducer, { touched: false, valid: true });
    const isFormValid = !error &&
        aggType.valid &&
        Object.entries(paramsState).every(([, paramState]) => paramState.valid);
    const isAllInvalidParamsTouched = !!error || agg_params_helper_1.isInvalidParamsTouched(agg.type, aggType, paramsState);
    const onAggSelect = react_1.useCallback((value) => {
        if (agg.type !== value) {
            onAggTypeChange(agg.id, value);
            // reset touched and valid of params
            onChangeParamsState({ type: agg_params_state_1.AGG_PARAMS_ACTION_KEYS.RESET });
        }
    }, [onAggTypeChange, agg]);
    // reset validity before component destroyed
    useUnmount_1.default(() => setValidity(true));
    react_1.useEffect(() => {
        Object.entries(editorConfig).forEach(([param, paramConfig]) => {
            const paramOptions = agg.type.params.find((paramOption) => paramOption.name === param);
            const hasFixedValue = paramConfig.hasOwnProperty(FIXED_VALUE_PROP);
            const hasDefault = paramConfig.hasOwnProperty(DEFAULT_PROP);
            // If the parameter has a fixed value in the config, set this value.
            // Also for all supported configs we should freeze the editor for this param.
            if (hasFixedValue || hasDefault) {
                let newValue;
                let property = FIXED_VALUE_PROP;
                let typedParamConfig = paramConfig;
                if (hasDefault) {
                    property = DEFAULT_PROP;
                    typedParamConfig = paramConfig;
                }
                if (paramOptions && paramOptions.deserialize) {
                    newValue = paramOptions.deserialize(typedParamConfig[property]);
                }
                else {
                    newValue = typedParamConfig[property];
                }
                // this check is obligatory to avoid infinite render, because setAggParamValue creates a brand new agg object
                if (agg.params[param] !== newValue) {
                    setAggParamValue(agg.id, param, newValue);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorConfig]);
    react_1.useEffect(() => {
        setTouched(false);
    }, [agg.type, setTouched]);
    react_1.useEffect(() => {
        setValidity(isFormValid);
    }, [isFormValid, agg.type, setValidity]);
    react_1.useEffect(() => {
        // when all invalid controls were touched or they are untouched
        setTouched(isAllInvalidParamsTouched);
    }, [isAllInvalidParamsTouched, setTouched]);
    return (react_1.default.createElement(eui_1.EuiForm, { className: className, isInvalid: !!error, error: error, "data-test-subj": "visAggEditorParams" },
        react_1.default.createElement(agg_select_1.DefaultEditorAggSelect, { aggError: aggError, id: agg.id, indexPattern: indexPattern, value: agg.type, aggTypeOptions: groupedAggTypeOptions, isSubAggregation: aggIndex >= 1 && groupName === public_1.AggGroupNames.Buckets, showValidation: formIsTouched || aggType.touched, setValue: onAggSelect, onChangeAggType: onChangeAggType }),
        params.basic.map((param) => {
            const model = paramsState[param.aggParam.name] || {
                touched: false,
                valid: true,
            };
            return (react_1.default.createElement(agg_param_1.DefaultEditorAggParam, Object.assign({ key: `${param.aggParam.name}${agg.type ? agg.type.name : ''}`, disabled: disabledParams && disabledParams.includes(param.aggParam.name), formIsTouched: formIsTouched, showValidation: formIsTouched || model.touched, setAggParamValue: setAggParamValue, onChangeParamsState: onChangeParamsState }, param)));
        }),
        params.advanced.length ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiAccordion, { id: "advancedAccordion", "data-test-subj": `advancedParams-${agg.id}`, buttonContent: i18n_1.i18n.translate('visDefaultEditor.advancedToggle.advancedLinkLabel', {
                    defaultMessage: 'Advanced',
                }) },
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                params.advanced.map((param) => {
                    const model = paramsState[param.aggParam.name] || {
                        touched: false,
                        valid: true,
                    };
                    return (react_1.default.createElement(agg_param_1.DefaultEditorAggParam, Object.assign({ key: `${param.aggParam.name}${agg.type ? agg.type.name : ''}`, disabled: disabledParams && disabledParams.includes(param.aggParam.name), formIsTouched: formIsTouched, showValidation: formIsTouched || model.touched, setAggParamValue: setAggParamValue, onChangeParamsState: onChangeParamsState }, param)));
                })))) : null));
}
exports.DefaultEditorAggParams = DefaultEditorAggParams;
