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
exports.JsonParamType = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const base_1 = require("./base");
class JsonParamType extends base_1.BaseParamType {
    constructor(config) {
        super(config);
        this.name = config.name || 'json';
        if (!config.write) {
            this.write = (aggConfig, output) => {
                let paramJson;
                const param = aggConfig.params[this.name];
                if (!param) {
                    return;
                }
                // handle invalid Json input
                try {
                    paramJson = JSON.parse(param);
                }
                catch (err) {
                    return;
                }
                function filteredCombine(srcA, srcB) {
                    function mergeObjs(a, b) {
                        return lodash_1.default(a)
                            .keys()
                            .union(lodash_1.default.keys(b))
                            .transform(function (dest, key) {
                            const val = compare(a[key], b[key]);
                            if (val !== undefined)
                                dest[key] = val;
                        }, {})
                            .value();
                    }
                    function mergeArrays(a, b) {
                        // attempt to merge each value
                        return lodash_1.default.times(Math.max(a.length, b.length), function (i) {
                            return compare(a[i], b[i]);
                        });
                    }
                    function compare(a, b) {
                        if (lodash_1.default.isPlainObject(a) && lodash_1.default.isPlainObject(b))
                            return mergeObjs(a, b);
                        if (Array.isArray(a) && Array.isArray(b))
                            return mergeArrays(a, b);
                        if (b === null)
                            return undefined;
                        if (b !== undefined)
                            return b;
                        return a;
                    }
                    return compare(srcA, srcB);
                }
                output.params = filteredCombine(output.params, paramJson);
                return;
            };
        }
    }
}
exports.JsonParamType = JsonParamType;
