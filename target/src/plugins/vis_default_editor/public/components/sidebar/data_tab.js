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
exports.DefaultEditorDataTab = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../data/public");
const agg_group_1 = require("../agg_group");
const state_1 = require("./state");
function DefaultEditorDataTab({ dispatch, formIsTouched, metricAggs, schemas, state, setTouched, setValidity, setStateValue, timeRange, }) {
    const lastParentPipelineAgg = react_1.useMemo(() => lodash_1.findLast(metricAggs, ({ type }) => type.subtype === public_1.search.aggs.parentPipelineType), [metricAggs]);
    const lastParentPipelineAggTitle = lastParentPipelineAgg && lastParentPipelineAgg.type.title;
    const addSchema = react_1.useCallback((schema) => dispatch(state_1.addNewAgg(schema)), [dispatch]);
    const onAggRemove = react_1.useCallback((aggId) => dispatch(state_1.removeAgg(aggId, schemas.all || [])), [dispatch, schemas]);
    const onReorderAggs = react_1.useCallback((...props) => dispatch(state_1.reorderAggs(...props)), [
        dispatch,
    ]);
    const onAggParamValueChange = react_1.useCallback((...props) => dispatch(state_1.setAggParamValue(...props)), [dispatch]);
    const onAggTypeChange = react_1.useCallback((...props) => dispatch(state_1.changeAggType(...props)), [dispatch]);
    const onToggleEnableAgg = react_1.useCallback((...props) => dispatch(state_1.toggleEnabledAgg(...props)), [dispatch]);
    const commonProps = {
        addSchema,
        formIsTouched,
        lastParentPipelineAggTitle,
        metricAggs,
        state,
        reorderAggs: onReorderAggs,
        setAggParamValue: onAggParamValueChange,
        setStateParamValue: setStateValue,
        onAggTypeChange,
        onToggleEnableAgg,
        setValidity,
        setTouched,
        removeAgg: onAggRemove,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({ groupName: public_1.AggGroupNames.Metrics, schemas: schemas.metrics }, commonProps)),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({ groupName: public_1.AggGroupNames.Buckets, schemas: schemas.buckets, timeRange: timeRange }, commonProps))));
}
exports.DefaultEditorDataTab = DefaultEditorDataTab;
