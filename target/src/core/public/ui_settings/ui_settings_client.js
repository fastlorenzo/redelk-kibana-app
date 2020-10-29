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
exports.UiSettingsClient = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class UiSettingsClient {
    constructor(params) {
        this.update$ = new rxjs_1.Subject();
        this.saved$ = new rxjs_1.Subject();
        this.updateErrors$ = new rxjs_1.Subject();
        this.api = params.api;
        this.defaults = lodash_1.cloneDeep(params.defaults);
        this.cache = lodash_1.defaultsDeep({}, this.defaults, lodash_1.cloneDeep(params.initialSettings));
        params.done$.subscribe({
            complete: () => {
                this.update$.complete();
                this.saved$.complete();
                this.updateErrors$.complete();
            },
        });
    }
    getAll() {
        return lodash_1.cloneDeep(this.cache);
    }
    get(key, defaultOverride) {
        const declared = this.isDeclared(key);
        if (!declared && defaultOverride !== undefined) {
            return defaultOverride;
        }
        if (!declared) {
            throw new Error(`Unexpected \`IUiSettingsClient.get("${key}")\` call on unrecognized configuration setting "${key}".
Setting an initial value via \`IUiSettingsClient.set("${key}", value)\` before attempting to retrieve
any custom setting value for "${key}" may fix this issue.
You can use \`IUiSettingsClient.get("${key}", defaultValue)\`, which will just return
\`defaultValue\` when the key is unrecognized.`);
        }
        const type = this.cache[key].type;
        const userValue = this.cache[key].userValue;
        const defaultValue = defaultOverride !== undefined ? defaultOverride : this.cache[key].value;
        const value = userValue == null ? defaultValue : userValue;
        if (type === 'json') {
            return JSON.parse(value);
        }
        if (type === 'number') {
            return parseFloat(value);
        }
        return value;
    }
    get$(key, defaultOverride) {
        return rxjs_1.concat(rxjs_1.defer(() => rxjs_1.of(this.get(key, defaultOverride))), this.update$.pipe(operators_1.filter((update) => update.key === key), operators_1.map(() => this.get(key, defaultOverride))));
    }
    async set(key, value) {
        return await this.update(key, value);
    }
    async remove(key) {
        return await this.update(key, null);
    }
    isDeclared(key) {
        return key in this.cache;
    }
    isDefault(key) {
        return !this.isDeclared(key) || this.cache[key].userValue == null;
    }
    isCustom(key) {
        return this.isDeclared(key) && !('value' in this.cache[key]);
    }
    isOverridden(key) {
        return this.isDeclared(key) && Boolean(this.cache[key].isOverridden);
    }
    overrideLocalDefault(key, newDefault) {
        // capture the previous value
        const prevDefault = this.defaults[key] ? this.defaults[key].value : undefined;
        // update defaults map
        this.defaults[key] = {
            ...(this.defaults[key] || {}),
            value: newDefault,
        };
        // update cached default value
        this.cache[key] = {
            ...(this.cache[key] || {}),
            value: newDefault,
        };
        // don't broadcast change if userValue was already overriding the default
        if (this.cache[key].userValue == null) {
            this.update$.next({ key, newValue: newDefault, oldValue: prevDefault });
            this.saved$.next({ key, newValue: newDefault, oldValue: prevDefault });
        }
    }
    getUpdate$() {
        return this.update$.asObservable();
    }
    getSaved$() {
        return this.saved$.asObservable();
    }
    getUpdateErrors$() {
        return this.updateErrors$.asObservable();
    }
    assertUpdateAllowed(key) {
        if (this.isOverridden(key)) {
            throw new Error(`Unable to update "${key}" because its value is overridden by the Kibana server`);
        }
    }
    async update(key, newVal) {
        this.assertUpdateAllowed(key);
        const declared = this.isDeclared(key);
        const defaults = this.defaults;
        const oldVal = declared ? this.cache[key].userValue : undefined;
        const unchanged = oldVal === newVal;
        if (unchanged) {
            return true;
        }
        const initialVal = declared ? this.get(key) : undefined;
        this.setLocally(key, newVal);
        try {
            const { settings } = await this.api.batchSet(key, newVal);
            this.cache = lodash_1.defaultsDeep({}, defaults, settings);
            this.saved$.next({ key, newValue: newVal, oldValue: initialVal });
            return true;
        }
        catch (error) {
            this.setLocally(key, initialVal);
            this.updateErrors$.next(error);
            return false;
        }
    }
    setLocally(key, newValue) {
        this.assertUpdateAllowed(key);
        if (!this.isDeclared(key)) {
            this.cache[key] = {};
        }
        const oldValue = this.get(key);
        if (newValue === null) {
            delete this.cache[key].userValue;
        }
        else {
            const { type } = this.cache[key];
            if (type === 'json' && typeof newValue !== 'string') {
                this.cache[key].userValue = JSON.stringify(newValue);
            }
            else {
                this.cache[key].userValue = newValue;
            }
        }
        this.update$.next({ key, newValue, oldValue });
    }
}
exports.UiSettingsClient = UiSettingsClient;
