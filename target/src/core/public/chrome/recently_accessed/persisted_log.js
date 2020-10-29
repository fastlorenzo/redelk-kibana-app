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
const lodash_1 = require("lodash");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
class PersistedLog {
    constructor(name, options, storage = localStorage) {
        this.name = name;
        this.maxLength =
            typeof options.maxLength === 'string'
                ? (this.maxLength = parseInt(options.maxLength, 10))
                : options.maxLength;
        this.isEqual = options.isEqual || lodash_1.isEqual;
        this.storage = storage;
        this.items$ = new Rx.BehaviorSubject(this.loadItems());
        if (this.maxLength !== undefined && !isNaN(this.maxLength)) {
            this.items$.next(lodash_1.take(this.items$.value, this.maxLength));
        }
    }
    add(val) {
        if (val == null) {
            return this.items$.value;
        }
        const nextItems = [
            val,
            // remove any duplicate items
            ...[...this.items$.value].filter((item) => !this.isEqual(item, val)),
        ].slice(0, this.maxLength); // truncate
        // Persist the stack to storage
        this.storage.setItem(this.name, JSON.stringify(nextItems));
        // Notify subscribers
        this.items$.next(nextItems);
        return nextItems;
    }
    get() {
        return lodash_1.cloneDeep(this.items$.value);
    }
    get$() {
        return this.items$.pipe(operators_1.map((items) => lodash_1.cloneDeep(items)));
    }
    loadItems() {
        try {
            return JSON.parse(this.storage.getItem(this.name) || '[]');
        }
        catch {
            return [];
        }
    }
}
exports.PersistedLog = PersistedLog;
