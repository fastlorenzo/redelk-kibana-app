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
exports.buildAggDescription = exports.isInvalidParamsTouched = exports.getAggTypeOptions = exports.getAggParamsToRender = void 0;
const lodash_1 = require("lodash");
const agg_filters_1 = require("../agg_filters");
const utils_1 = require("../utils");
const agg_params_map_1 = require("./agg_params_map");
const schemas_1 = require("../schemas");
function getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas, hideCustomLabel, }) {
    const params = {
        basic: [],
        advanced: [],
    };
    const paramsToRender = (agg.type &&
        agg.type.params
            // Filter out, i.e. don't render, any parameter that is hidden via the editor config.
            .filter((param) => !lodash_1.get(editorConfig, [param.name, 'hidden'], false))) ||
        [];
    const schema = schemas_1.getSchemaByName(schemas, agg.schema);
    // build collection of agg params components
    paramsToRender.forEach((param, index) => {
        let indexedFields = [];
        let fields;
        if (hideCustomLabel && param.name === 'customLabel') {
            return;
        }
        // if field param exists, compute allowed fields
        if (param.type === 'field') {
            let availableFields = param.getAvailableFields(agg);
            // should be refactored in the future to provide a more general way
            // for visualization to override some agg config settings
            if (agg.type.name === 'top_hits' && param.name === 'field') {
                const allowStrings = lodash_1.get(schema, `aggSettings[${agg.type.name}].allowStrings`, false);
                if (!allowStrings) {
                    availableFields = availableFields.filter((field) => field.type === 'number');
                }
            }
            fields = agg_filters_1.filterAggTypeFields(availableFields, agg);
            indexedFields = utils_1.groupAndSortBy(fields, 'type', 'name');
            if (fields && !indexedFields.length && index > 0) {
                // don't draw the rest of the options if there are no indexed fields and it's an extra param (index > 0).
                return;
            }
        }
        const type = param.advanced ? 'advanced' : 'basic';
        let paramEditor;
        if (agg.type.subtype && agg_params_map_1.aggParamsMap[agg.type.subtype]) {
            paramEditor = lodash_1.get(agg_params_map_1.aggParamsMap, [agg.type.subtype, param.name]);
        }
        else {
            const aggType = agg.type.type;
            const aggName = agg.type.name;
            const aggParams = lodash_1.get(agg_params_map_1.aggParamsMap, [aggType, aggName], {});
            paramEditor = lodash_1.get(aggParams, param.name);
        }
        if (!paramEditor) {
            paramEditor = lodash_1.get(agg_params_map_1.aggParamsMap, ['common', param.type]);
        }
        // show params with an editor component
        if (paramEditor) {
            params[type].push({
                agg,
                aggParam: param,
                editorConfig,
                indexedFields,
                paramEditor,
                metricAggs,
                state,
                value: agg.params[param.name],
                schemas,
                hideCustomLabel,
            });
        }
    });
    return params;
}
exports.getAggParamsToRender = getAggParamsToRender;
function getAggTypeOptions(aggTypes, agg, indexPattern, groupName, allowedAggs) {
    const aggTypeOptions = agg_filters_1.filterAggTypes(aggTypes[groupName], indexPattern, agg, allowedAggs);
    return utils_1.groupAndSortBy(aggTypeOptions, 'subtype', 'title');
}
exports.getAggTypeOptions = getAggTypeOptions;
/**
 * Calculates a ngModel touched state.
 * If an aggregation is not selected, it returns a value of touched agg selector state.
 * Else if there are no invalid agg params, it returns false.
 * Otherwise it returns true if each invalid param is touched.
 * @param aggType Selected aggregation.
 * @param aggTypeState State of aggregation selector.
 * @param aggParams State of aggregation parameters.
 */
function isInvalidParamsTouched(aggType, aggTypeState, aggParams) {
    if (!aggType) {
        return aggTypeState.touched;
    }
    const invalidParams = Object.values(aggParams).filter((param) => !param.valid);
    if (lodash_1.isEmpty(invalidParams)) {
        return false;
    }
    return invalidParams.every((param) => param.touched);
}
exports.isInvalidParamsTouched = isInvalidParamsTouched;
function buildAggDescription(agg) {
    let description = '';
    if (agg.type && agg.type.makeLabel) {
        try {
            description = agg.type.makeLabel(agg);
        }
        catch (e) {
            // Date Histogram's `makeLabel` implementation invokes 'write' method for each param, including interval's 'write',
            // which throws an error when interval is undefined.
        }
    }
    return description;
}
exports.buildAggDescription = buildAggDescription;
