"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDiff = void 0;
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
/**
 * Filter the private vars
 * @param {string} key The keys
 * @returns {boolean}
 */
const filterPrivateAndMethods = function (obj) {
    return function (key) {
        if (lodash_1.isFunction(obj[key]))
            return false;
        if (key.charAt(0) === '$')
            return false;
        return key.charAt(0) !== '_';
    };
};
function applyDiff(target, source) {
    const diff = {
        removed: [],
        added: [],
        changed: [],
        keys: [],
    };
    const targetKeys = lodash_1.keys(target).filter(filterPrivateAndMethods(target));
    const sourceKeys = lodash_1.keys(source).filter(filterPrivateAndMethods(source));
    // Find the keys to be removed
    diff.removed = lodash_1.difference(targetKeys, sourceKeys);
    // Find the keys to be added
    diff.added = lodash_1.difference(sourceKeys, targetKeys);
    // Find the keys that will be changed
    diff.changed = lodash_1.filter(sourceKeys, (key) => !lodash_1.isEqual(target[key], source[key]));
    // Make a list of all the keys that are changing
    diff.keys = lodash_1.union(diff.changed, diff.removed, diff.added);
    // Remove all the keys
    lodash_1.each(diff.removed, (key) => {
        delete target[key];
    });
    // Assign the changed to the source to the target
    lodash_1.assign(target, lodash_1.pick(source, diff.changed));
    // Assign the added to the source to the target
    lodash_1.assign(target, lodash_1.pick(source, diff.added));
    return diff;
}
exports.applyDiff = applyDiff;
