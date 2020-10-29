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
exports.initEditorState = exports.createEditorStateReducer = void 0;
const lodash_1 = require("lodash");
const public_1 = require("../../../../../data/public");
const constants_1 = require("./constants");
const agg_group_helper_1 = require("../../agg_group_helper");
function initEditorState(vis) {
    return {
        ...vis.clone(),
    };
}
exports.initEditorState = initEditorState;
const createEditorStateReducer = ({ aggs: { createAggConfigs }, }) => (state, action) => {
    switch (action.type) {
        case constants_1.EditorStateActionTypes.ADD_NEW_AGG: {
            const { schema } = action.payload;
            const defaultConfig = !state.data.aggs.aggs.find((agg) => agg.schema === schema.name) && schema.defaults
                ? schema.defaults.slice(0, schema.max)
                : { schema: schema.name };
            const aggConfig = state.data.aggs.createAggConfig(defaultConfig, {
                addToAggConfigs: false,
            });
            aggConfig.brandNew = true;
            const newAggs = [...state.data.aggs.aggs, aggConfig];
            return {
                ...state,
                data: {
                    ...state.data,
                    aggs: createAggConfigs(state.data.indexPattern, newAggs),
                },
            };
        }
        case constants_1.EditorStateActionTypes.DISCARD_CHANGES: {
            return initEditorState(action.payload);
        }
        case constants_1.EditorStateActionTypes.CHANGE_AGG_TYPE: {
            const { aggId, value } = action.payload;
            const newAggs = state.data.aggs.aggs.map((agg) => {
                if (agg.id === aggId) {
                    agg.type = value;
                    return agg.toJSON();
                }
                return agg;
            });
            return {
                ...state,
                data: {
                    ...state.data,
                    aggs: createAggConfigs(state.data.indexPattern, newAggs),
                },
            };
        }
        case constants_1.EditorStateActionTypes.SET_AGG_PARAM_VALUE: {
            const { aggId, paramName, value } = action.payload;
            const newAggs = state.data.aggs.aggs.map((agg) => {
                if (agg.id === aggId) {
                    const parsedAgg = agg.toJSON();
                    return {
                        ...parsedAgg,
                        params: {
                            ...parsedAgg.params,
                            [paramName]: value,
                        },
                    };
                }
                return agg;
            });
            return {
                ...state,
                data: {
                    ...state.data,
                    aggs: createAggConfigs(state.data.indexPattern, newAggs),
                },
            };
        }
        case constants_1.EditorStateActionTypes.SET_STATE_PARAM_VALUE: {
            const { paramName, value } = action.payload;
            return {
                ...state,
                params: {
                    ...state.params,
                    [paramName]: value,
                },
            };
        }
        case constants_1.EditorStateActionTypes.REMOVE_AGG: {
            let isMetric = false;
            const newAggs = state.data.aggs.aggs.filter(({ id, schema }) => {
                if (id === action.payload.aggId) {
                    const schemaDef = action.payload.schemas.find((s) => s.name === schema);
                    if (schemaDef && schemaDef.group === public_1.AggGroupNames.Metrics) {
                        isMetric = true;
                    }
                    return false;
                }
                return true;
            });
            if (isMetric && agg_group_helper_1.getEnabledMetricAggsCount(newAggs) === 0) {
                const aggToEnable = newAggs.find((agg) => agg.schema === 'metric');
                if (aggToEnable) {
                    aggToEnable.enabled = true;
                }
            }
            return {
                ...state,
                data: {
                    ...state.data,
                    aggs: createAggConfigs(state.data.indexPattern, newAggs),
                },
            };
        }
        case constants_1.EditorStateActionTypes.REORDER_AGGS: {
            const { sourceAgg, destinationAgg } = action.payload;
            const destinationIndex = state.data.aggs.aggs.indexOf(destinationAgg);
            const newAggs = [...state.data.aggs.aggs];
            newAggs.splice(destinationIndex, 0, newAggs.splice(state.data.aggs.aggs.indexOf(sourceAgg), 1)[0]);
            return {
                ...state,
                data: {
                    ...state.data,
                    aggs: createAggConfigs(state.data.indexPattern, newAggs),
                },
            };
        }
        case constants_1.EditorStateActionTypes.TOGGLE_ENABLED_AGG: {
            const { aggId, enabled } = action.payload;
            const newAggs = state.data.aggs.aggs.map((agg) => {
                if (agg.id === aggId) {
                    const parsedAgg = agg.toJSON();
                    return {
                        ...parsedAgg,
                        enabled,
                    };
                }
                return agg;
            });
            return {
                ...state,
                data: {
                    ...state.data,
                    aggs: createAggConfigs(state.data.indexPattern, newAggs),
                },
            };
        }
        case constants_1.EditorStateActionTypes.UPDATE_STATE_PARAMS: {
            const { params } = action.payload;
            return {
                ...state,
                params: lodash_1.cloneDeep(params),
            };
        }
    }
};
exports.createEditorStateReducer = createEditorStateReducer;
