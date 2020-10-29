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
exports.create = exports.getResponseAggConfigClass = void 0;
const lodash_1 = require("lodash");
/**
 * Get the ResponseAggConfig class for an aggConfig,
 * which might be cached on the aggConfig or created.
 *
 * @param  {AggConfig} agg - the AggConfig the VAC should inherit from
 * @param  {object} props - properties that the VAC should have
 * @return {Constructor} - a constructor for VAC objects that will inherit the aggConfig
 */
exports.getResponseAggConfigClass = (agg, props) => {
    if (agg.$$_ResponseAggConfigClass) {
        return agg.$$_ResponseAggConfigClass;
    }
    else {
        return (agg.$$_ResponseAggConfigClass = exports.create(agg, props));
    }
};
exports.create = (parentAgg, props) => {
    /**
     * AggConfig "wrapper" for multi-value metric aggs which
     * need to modify AggConfig behavior for each value produced.
     *
     * @param {string|number} key - the key or index that identifies
     *                            this part of the multi-value
     */
    function ResponseAggConfig(key) {
        const parentId = parentAgg.id;
        let id;
        const subId = String(key);
        if (subId.indexOf('.') > -1) {
            id = parentId + "['" + subId.replace(/'/g, "\\'") + "']";
        }
        else {
            id = parentId + '.' + subId;
        }
        this.id = id;
        this.key = key;
        this.parentId = parentId;
    }
    ResponseAggConfig.prototype = Object.create(parentAgg);
    ResponseAggConfig.prototype.constructor = ResponseAggConfig;
    lodash_1.assignIn(ResponseAggConfig.prototype, props);
    return ResponseAggConfig;
};
