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
exports.isBucketAggType = exports.BucketAggType = void 0;
const agg_type_1 = require("../agg_type");
const bucketType = 'buckets';
class BucketAggType extends agg_type_1.AggType {
    constructor(config) {
        super(config);
        this.type = bucketType;
        this.getKey =
            config.getKey ||
                ((bucket, key) => {
                    return key || bucket.key;
                });
    }
}
exports.BucketAggType = BucketAggType;
function isBucketAggType(aggConfig) {
    return aggConfig && aggConfig.type === bucketType;
}
exports.isBucketAggType = isBucketAggType;
