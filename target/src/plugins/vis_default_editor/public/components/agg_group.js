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
exports.DefaultEditorAggGroup = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../data/public");
const agg_1 = require("./agg");
const agg_add_1 = require("./agg_add");
const agg_group_helper_1 = require("./agg_group_helper");
const agg_group_state_1 = require("./agg_group_state");
function DefaultEditorAggGroup({ formIsTouched, groupName, lastParentPipelineAggTitle, metricAggs, state, schemas = [], addSchema, setAggParamValue, setStateParamValue, onAggTypeChange, onToggleEnableAgg, removeAgg, reorderAggs, setTouched, setValidity, timeRange, }) {
    const groupNameLabel = public_1.AggGroupLabels[groupName];
    // e.g. buckets can have no aggs
    const schemaNames = schemas.map((s) => s.name);
    const group = react_1.useMemo(() => state.data.aggs.aggs.filter((agg) => agg.schema && schemaNames.includes(agg.schema)) || [], [state.data.aggs, schemaNames]);
    const stats = {
        max: 0,
        count: group.length,
    };
    schemas.forEach((schema) => {
        stats.max += schema.max;
    });
    const [aggsState, setAggsState] = react_1.useReducer(agg_group_state_1.aggGroupReducer, group, agg_group_state_1.initAggsState);
    const bucketsError = lastParentPipelineAggTitle && groupName === public_1.AggGroupNames.Buckets && !group.length
        ? i18n_1.i18n.translate('visDefaultEditor.buckets.mustHaveBucketErrorMessage', {
            defaultMessage: 'Add a bucket with "Date Histogram" or "Histogram" aggregation.',
            description: 'Date Histogram and Histogram should not be translated',
        })
        : undefined;
    const isGroupValid = !bucketsError && Object.values(aggsState).every((item) => item.valid);
    const isAllAggsTouched = agg_group_helper_1.isInvalidAggsTouched(aggsState);
    const isMetricAggregationDisabled = react_1.useMemo(() => groupName === public_1.AggGroupNames.Metrics && agg_group_helper_1.getEnabledMetricAggsCount(group) === 1, [groupName, group]);
    react_1.useEffect(() => {
        // when isAllAggsTouched is true, it means that all invalid aggs are touched and we will set ngModel's touched to true
        // which indicates that Apply button can be changed to Error button (when all invalid ngModels are touched)
        setTouched(isAllAggsTouched);
    }, [isAllAggsTouched, setTouched]);
    react_1.useEffect(() => {
        // when not all invalid aggs are touched and formIsTouched becomes true, it means that Apply button was clicked.
        // and in such case we set touched state to true for all aggs
        if (formIsTouched && !isAllAggsTouched) {
            Object.keys(aggsState).map(([aggId]) => {
                setAggsState({
                    type: agg_group_state_1.AGGS_ACTION_KEYS.TOUCHED,
                    payload: true,
                    aggId,
                });
            });
        }
        // adding all of the values to the deps array cause a circular re-render
        // the logic should be rewised
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formIsTouched]);
    react_1.useEffect(() => {
        setValidity(`aggGroup__${groupName}`, isGroupValid);
    }, [groupName, isGroupValid, setValidity]);
    const onDragEnd = react_1.useCallback(({ source, destination }) => {
        if (source && destination) {
            reorderAggs(group[source.index], group[destination.index]);
        }
    }, [reorderAggs, group]);
    return (react_1.default.createElement(eui_1.EuiDragDropContext, { onDragEnd: onDragEnd },
        react_1.default.createElement(eui_1.EuiPanel, { "data-test-subj": `${groupName}AggGroup`, paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null, groupNameLabel)),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            bucketsError && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiFormErrorText, { "data-test-subj": "bucketsError" }, bucketsError),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }))),
            react_1.default.createElement(eui_1.EuiDroppable, { droppableId: `agg_group_dnd_${groupName}` },
                react_1.default.createElement(react_1.default.Fragment, null, group.map((agg, index) => (react_1.default.createElement(eui_1.EuiDraggable, { key: agg.id, index: index, draggableId: `agg_group_dnd_${groupName}_${agg.id}`, customDragHandle: true }, (provided) => (react_1.default.createElement(agg_1.DefaultEditorAgg, { agg: agg, aggIndex: index, aggIsTooLow: agg_group_helper_1.calcAggIsTooLow(agg, index, group, schemas), dragHandleProps: provided.dragHandleProps || null, formIsTouched: aggsState[agg.id] ? aggsState[agg.id].touched : false, groupName: groupName, isDraggable: stats.count > 1, isLastBucket: groupName === public_1.AggGroupNames.Buckets && index === group.length - 1, isRemovable: agg_group_helper_1.isAggRemovable(agg, group, schemas), isDisabled: agg.schema === 'metric' && isMetricAggregationDisabled, lastParentPipelineAggTitle: lastParentPipelineAggTitle, metricAggs: metricAggs, state: state, setAggParamValue: setAggParamValue, setStateParamValue: setStateParamValue, onAggTypeChange: onAggTypeChange, onToggleEnableAgg: onToggleEnableAgg, removeAgg: removeAgg, setAggsState: setAggsState, schemas: schemas, timeRange: timeRange }))))))),
            stats.max > stats.count && (react_1.default.createElement(agg_add_1.DefaultEditorAggAdd, { group: group, groupName: groupName, schemas: schemas, stats: stats, addSchema: addSchema })))));
}
exports.DefaultEditorAggGroup = DefaultEditorAggGroup;
