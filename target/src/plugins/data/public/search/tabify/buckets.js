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
exports.TabifyBuckets = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const isRangeEqual = (range1, range2) => range1?.from === range2?.from && range1?.to === range2?.to;
class TabifyBuckets {
    constructor(aggResp, aggParams, timeRange) {
        this._keys = [];
        if (aggResp && aggResp.buckets) {
            this.buckets = aggResp.buckets;
        }
        else if (aggResp) {
            // Some Bucket Aggs only return a single bucket (like filter).
            // In those instances, the aggResp is the content of the single bucket.
            this.buckets = [aggResp];
        }
        else {
            this.buckets = [];
        }
        this.objectMode = lodash_1.isPlainObject(this.buckets);
        if (this.objectMode) {
            this._keys = lodash_1.keys(this.buckets);
            this.length = this._keys.length;
        }
        else {
            this.length = this.buckets.length;
        }
        if (this.length && aggParams) {
            this.orderBucketsAccordingToParams(aggParams);
            if (aggParams.drop_partials) {
                this.dropPartials(aggParams, timeRange);
            }
        }
    }
    forEach(fn) {
        const buckets = this.buckets;
        if (this.objectMode) {
            this._keys.forEach((key) => {
                fn(buckets[key], key);
            });
        }
        else {
            buckets.forEach((bucket) => {
                fn(bucket, bucket.key);
            });
        }
    }
    orderBucketsAccordingToParams(params) {
        if (params.filters && this.objectMode) {
            this._keys = params.filters.map((filter) => {
                const query = lodash_1.get(filter, 'input.query.query_string.query', filter.input.query);
                const queryString = typeof query === 'string' ? query : JSON.stringify(query);
                return filter.label || queryString || '*';
            });
        }
        else if (params.ranges && this.objectMode) {
            this._keys = params.ranges.map((range) => lodash_1.findKey(this.buckets, (el) => isRangeEqual(el, range)));
        }
        else if (params.ranges && params.field.type !== 'date') {
            let ranges = params.ranges;
            if (params.ipRangeType) {
                ranges = params.ipRangeType === 'mask' ? ranges.mask : ranges.fromTo;
            }
            this.buckets = ranges.map((range) => {
                if (range.mask) {
                    return this.buckets.find((el) => el.key === range.mask);
                }
                return this.buckets.find((el) => isRangeEqual(el, range));
            });
        }
    }
    // dropPartials should only be called if the aggParam setting is enabled,
    // and the agg field is the same as the Time Range.
    dropPartials(params, timeRange) {
        if (!timeRange ||
            this.buckets.length <= 1 ||
            this.objectMode ||
            !timeRange.timeFields.includes(params.field.name)) {
            return;
        }
        const interval = this.buckets[1].key - this.buckets[0].key;
        this.buckets = this.buckets.filter((bucket) => {
            if (moment_1.default(bucket.key).isBefore(timeRange.from)) {
                return false;
            }
            if (moment_1.default(bucket.key + interval).isAfter(timeRange.to)) {
                return false;
            }
            return true;
        });
        this.length = this.buckets.length;
    }
}
exports.TabifyBuckets = TabifyBuckets;
