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
exports.PersistedState = void 0;
const events_1 = require("events");
const safer_lodash_set_1 = require("@elastic/safer-lodash-set");
const lodash_1 = require("lodash");
function prepSetParams(key, value, path) {
    // key must be the value, set the entire state using it
    if (value === undefined && (lodash_1.isPlainObject(key) || path.length > 0)) {
        // setting entire tree, swap the key and value to write to the state
        value = key;
        key = undefined;
    }
    // ensure the value being passed in is never mutated
    return {
        value: lodash_1.cloneDeep(value),
        key,
    };
}
class PersistedState extends events_1.EventEmitter {
    constructor(value, path) {
        super();
        this._path = this.setPath(path);
        // Some validations
        if (!this._path.length && value && !lodash_1.isPlainObject(value)) {
            throw new Error('State value must be a plain object');
        }
        value = value || this.getDefault();
        // copy passed state values and create internal trackers
        this.set(value);
        this._initialized = true; // used to track state changes
    }
    get(key, defaultValue) {
        // no path and no key, get the whole state
        if (!this.hasPath() && key === undefined) {
            return this._mergedState;
        }
        return lodash_1.cloneDeep(lodash_1.get(this._mergedState, this.getIndex(key || ''), defaultValue));
    }
    set(key, value) {
        const params = prepSetParams(key, value, this._path);
        const val = this.setValue(params.key, params.value);
        this.emit('set');
        return val;
    }
    setSilent(key, value) {
        const params = prepSetParams(key, value, this._path);
        if (params.key || params.value) {
            return this.setValue(params.key, params.value, true);
        }
    }
    clearAllKeys() {
        Object.getOwnPropertyNames(this._changedState).forEach((key) => {
            this.set(key, null);
        });
    }
    reset(path) {
        const keyPath = this.getIndex(path);
        const origValue = lodash_1.get(this._defaultState, keyPath);
        const currentValue = lodash_1.get(this._mergedState, keyPath);
        if (origValue === undefined) {
            this.cleanPath(path, this._mergedState);
        }
        else {
            safer_lodash_set_1.set(this._mergedState, keyPath, origValue);
        }
        // clean up the changedState tree
        this.cleanPath(path, this._changedState);
        if (!lodash_1.isEqual(currentValue, origValue))
            this.emit('change');
    }
    getChanges() {
        return lodash_1.cloneDeep(this._changedState);
    }
    toJSON() {
        return this.get();
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    fromString(input) {
        return this.set(JSON.parse(input));
    }
    getIndex(key) {
        if (key === undefined)
            return this._path;
        return [...(this._path || []), ...lodash_1.toPath(key)];
    }
    getPartialIndex(key) {
        const keyPath = this.getIndex(key);
        return keyPath.slice(this._path.length);
    }
    cleanPath(path, stateTree) {
        const partialPath = this.getPartialIndex(path);
        let remove = true;
        if (Array.isArray(partialPath)) {
            // recursively delete value tree, when no other keys exist
            while (partialPath.length > 0) {
                const lastKey = partialPath.splice(partialPath.length - 1, 1)[0];
                const statePath = [...this._path, partialPath];
                const stateVal = statePath.length > 0 ? lodash_1.get(stateTree, statePath) : stateTree;
                // if stateVal isn't an object, do nothing
                if (!lodash_1.isPlainObject(stateVal))
                    return;
                if (remove)
                    delete stateVal[lastKey];
                if (Object.keys(stateVal).length > 0)
                    remove = false;
            }
        }
    }
    getDefault() {
        return this.hasPath() ? undefined : {};
    }
    setPath(path) {
        if (Array.isArray(path)) {
            return path;
        }
        if (lodash_1.isString(path)) {
            return [...this.getIndex(path)];
        }
        return [];
    }
    hasPath() {
        return this._path.length > 0;
    }
    setValue(key, value, silent = false) {
        const self = this;
        let stateChanged = false;
        const initialState = !this._initialized;
        const keyPath = this.getIndex(key);
        const hasKeyPath = keyPath.length > 0;
        // if this is the initial state value, save value as the default
        if (initialState) {
            this._changedState = {};
            if (!this.hasPath() && key === undefined)
                this._defaultState = value;
            else
                this._defaultState = safer_lodash_set_1.set({}, keyPath, value);
        }
        if (!initialState) {
            // no path and no key, set the whole state
            if (!this.hasPath() && key === undefined) {
                // compare changedState and new state, emit an event when different
                stateChanged = !lodash_1.isEqual(this._changedState, value);
                this._changedState = value;
                this._mergedState = lodash_1.cloneDeep(value);
            }
            else {
                // check for changes at path, emit an event when different
                const curVal = hasKeyPath ? this.get(keyPath) : this._mergedState;
                stateChanged = !lodash_1.isEqual(curVal, value);
                // arrays are merge by index, not desired - ensure they are replaced
                if (Array.isArray(lodash_1.get(this._mergedState, keyPath))) {
                    if (hasKeyPath) {
                        safer_lodash_set_1.set(this._mergedState, keyPath, undefined);
                    }
                    else {
                        this._mergedState = undefined;
                    }
                }
                if (hasKeyPath) {
                    safer_lodash_set_1.set(this._changedState, keyPath, value);
                }
                else {
                    this._changedState = lodash_1.isPlainObject(value) ? value : {};
                }
            }
        }
        // update the merged state value
        const targetObj = this._mergedState || lodash_1.cloneDeep(this._defaultState);
        const sourceObj = lodash_1.merge({}, this._changedState);
        // handler arguments are (targetValue, sourceValue, key, target, source)
        const mergeMethod = function (targetValue, sourceValue, mergeKey) {
            // if not initial state, skip default merge method (ie. return value, see note below)
            if (!initialState && lodash_1.isEqual(keyPath, self.getIndex(mergeKey))) {
                // use the sourceValue or fall back to targetValue
                return sourceValue === undefined ? targetValue : sourceValue;
            }
        };
        // If `mergeMethod` is provided it is invoked to produce the merged values of the
        // destination and source properties.
        // If `mergeMethod` returns `undefined` the default merging method is used
        this._mergedState = lodash_1.mergeWith(targetObj, sourceObj, mergeMethod);
        // sanity check; verify that there are actually changes
        if (lodash_1.isEqual(this._mergedState, this._defaultState))
            this._changedState = {};
        if (!silent && stateChanged)
            this.emit('change', key);
        return this;
    }
}
exports.PersistedState = PersistedState;
