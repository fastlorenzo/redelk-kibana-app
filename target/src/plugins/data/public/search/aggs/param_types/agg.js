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
exports.AggParamType = void 0;
const agg_config_1 = require("../agg_config");
const base_1 = require("./base");
class AggParamType extends base_1.BaseParamType {
    constructor(config) {
        super(config);
        this.allowedAggs = [];
        if (config.allowedAggs) {
            this.allowedAggs = config.allowedAggs;
        }
        if (!config.write) {
            this.write = (aggConfig, output) => {
                if (aggConfig.params[this.name] && aggConfig.params[this.name].length) {
                    output.params[this.name] = aggConfig.params[this.name];
                }
            };
        }
        if (!config.serialize) {
            this.serialize = (agg) => {
                return agg.serialize();
            };
        }
        if (!config.deserialize) {
            this.deserialize = (state, agg) => {
                if (!agg) {
                    throw new Error('aggConfig was not provided to AggParamType deserialize function');
                }
                return this.makeAgg(agg, state);
            };
        }
        if (!config.toExpressionAst) {
            this.toExpressionAst = (agg) => {
                if (!agg || !agg.toExpressionAst) {
                    throw new Error('aggConfig was not provided to AggParamType toExpressionAst function');
                }
                return agg.toExpressionAst();
            };
        }
        this.makeAgg = config.makeAgg;
        this.valueType = agg_config_1.AggConfig;
    }
}
exports.AggParamType = AggParamType;
