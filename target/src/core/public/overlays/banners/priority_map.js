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
exports.PriorityMap = void 0;
const lodash_1 = require("lodash");
/**
 * Immutable map that ensures entries are always in descending order based on
 * the values 'priority' property.
 */
class PriorityMap {
    constructor(map) {
        this.map = map ? new Map(sortEntries(map)) : new Map();
    }
    add(key, value) {
        return new PriorityMap(new Map(sortEntries([...this.map, [key, value]])));
    }
    remove(key) {
        return new PriorityMap(new Map([...this.map].filter(([itemKey]) => itemKey !== key)));
    }
    has(key) {
        return this.map.has(key);
    }
    [Symbol.iterator]() {
        return this.map[Symbol.iterator]();
    }
    values() {
        return this.map.values();
    }
}
exports.PriorityMap = PriorityMap;
const sortEntries = (map) => lodash_1.sortBy([...map], '1.priority').reverse();
