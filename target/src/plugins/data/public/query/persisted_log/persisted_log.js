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
exports.PersistedLog = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const defaultIsDuplicate = (oldItem, newItem) => {
    return lodash_1.default.isEqual(oldItem, newItem);
};
class PersistedLog {
    constructor(name, options = {}, storage) {
        this.update$ = new Rx.BehaviorSubject(undefined);
        this.name = name;
        this.maxLength =
            typeof options.maxLength === 'string'
                ? (this.maxLength = parseInt(options.maxLength, 10))
                : options.maxLength;
        this.filterDuplicates = options.filterDuplicates || false;
        this.isDuplicate = options.isDuplicate || defaultIsDuplicate;
        this.storage = storage;
        this.items = this.storage.get(this.name) || [];
        if (this.maxLength !== undefined && !isNaN(this.maxLength)) {
            this.items = lodash_1.default.take(this.items, this.maxLength);
        }
    }
    add(val) {
        if (val == null) {
            return this.items;
        }
        // remove any matching items from the stack if option is set
        if (this.filterDuplicates) {
            lodash_1.default.remove(this.items, (item) => {
                return this.isDuplicate(item, val);
            });
        }
        this.items.unshift(val);
        // if maxLength is set, truncate the stack
        if (this.maxLength && !isNaN(this.maxLength)) {
            this.items = lodash_1.default.take(this.items, this.maxLength);
        }
        // persist the stack
        this.storage.set(this.name, this.items);
        this.update$.next(undefined);
        return this.items;
    }
    get() {
        return lodash_1.default.cloneDeep(this.items);
    }
    get$() {
        return this.update$.pipe(operators_1.map(() => this.get()));
    }
}
exports.PersistedLog = PersistedLog;
