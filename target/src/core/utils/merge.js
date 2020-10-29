"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
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
const lodash_1 = require("lodash");
function merge(baseObj, ...sources) {
    const firstSource = sources[0];
    if (firstSource === undefined) {
        return baseObj;
    }
    return sources
        .slice(1)
        .reduce((merged, nextSource) => mergeObjects(merged, nextSource), mergeObjects(baseObj, firstSource));
}
exports.merge = merge;
const isMergable = (obj) => lodash_1.isPlainObject(obj);
const mergeObjects = (baseObj, overrideObj) => [...new Set([...Object.keys(baseObj), ...Object.keys(overrideObj)])].reduce((merged, key) => {
    const baseVal = baseObj[key];
    const overrideVal = overrideObj[key];
    if (isMergable(baseVal) && isMergable(overrideVal)) {
        merged[key] = mergeObjects(baseVal, overrideVal);
    }
    else if (overrideVal !== undefined) {
        merged[key] = overrideVal;
    }
    else if (baseVal !== undefined) {
        merged[key] = baseVal;
    }
    return merged;
}, {});
