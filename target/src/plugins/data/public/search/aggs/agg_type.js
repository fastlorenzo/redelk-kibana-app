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
exports.AggType = void 0;
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const agg_params_1 = require("./agg_params");
const base_1 = require("./param_types/base");
class AggType {
    /**
     * Generic AggType Constructor
     *
     * Used to create the values exposed by the agg_types module.
     *
     * @class AggType
     * @private
     * @param {object} config - used to set the properties of the AggType
     */
    constructor(config) {
        this.paramByName = (name) => {
            return this.params.find((p) => p.name === name);
        };
        this.name = config.name;
        this.type = config.type || 'metrics';
        this.dslName = config.dslName || config.name;
        this.expressionName = config.expressionName;
        this.title = config.title;
        this.makeLabel = config.makeLabel || lodash_1.constant(this.name);
        this.ordered = config.ordered;
        this.hasNoDsl = !!config.hasNoDsl;
        if (config.createFilter) {
            this.createFilter = config.createFilter;
        }
        if (config.params && config.params.length && config.params[0] instanceof base_1.BaseParamType) {
            this.params = config.params;
        }
        else {
            // always append the raw JSON param
            const params = config.params ? [...config.params] : [];
            params.push({
                name: 'json',
                type: 'json',
                advanced: true,
            });
            // always append custom label
            if (config.customLabels !== false) {
                params.push({
                    name: 'customLabel',
                    displayName: i18n_1.i18n.translate('data.search.aggs.string.customLabel', {
                        defaultMessage: 'Custom label',
                    }),
                    type: 'string',
                    write: lodash_1.noop,
                });
            }
            this.params = agg_params_1.initParams(params);
        }
        this.getRequestAggs = config.getRequestAggs || lodash_1.noop;
        this.getResponseAggs = config.getResponseAggs || (() => { });
        this.decorateAggConfig = config.decorateAggConfig || (() => ({}));
        this.postFlightRequest = config.postFlightRequest || lodash_1.identity;
        this.getSerializedFormat =
            config.getSerializedFormat ||
                ((agg) => {
                    return agg.params.field ? agg.params.field.format.toJSON() : {};
                });
        this.getValue = config.getValue || ((agg, bucket) => { });
    }
}
exports.AggType = AggType;
