"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiSettingsClient = void 0;
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
const saved_objects_1 = require("../saved_objects");
const create_or_upgrade_saved_config_1 = require("./create_or_upgrade_saved_config");
const ui_settings_errors_1 = require("./ui_settings_errors");
class UiSettingsClient {
    constructor(options) {
        const { type, id, buildNum, savedObjectsClient, log, defaults = {}, overrides = {} } = options;
        this.type = type;
        this.id = id;
        this.buildNum = buildNum;
        this.savedObjectsClient = savedObjectsClient;
        this.defaults = defaults;
        this.overrides = overrides;
        this.log = log;
    }
    getRegistered() {
        const copiedDefaults = {};
        for (const [key, value] of Object.entries(this.defaults)) {
            copiedDefaults[key] = lodash_1.omit(value, 'schema');
        }
        return copiedDefaults;
    }
    async get(key) {
        const all = await this.getAll();
        return all[key];
    }
    async getAll() {
        const raw = await this.getRaw();
        return Object.keys(raw).reduce((all, key) => {
            const item = raw[key];
            all[key] = ('userValue' in item ? item.userValue : item.value);
            return all;
        }, {});
    }
    async getUserProvided() {
        const userProvided = this.onReadHook(await this.read());
        // write all overridden keys, dropping the userValue is override is null and
        // adding keys for overrides that are not in saved object
        for (const [key, value] of Object.entries(this.overrides)) {
            userProvided[key] =
                value === null ? { isOverridden: true } : { isOverridden: true, userValue: value };
        }
        return userProvided;
    }
    async setMany(changes) {
        this.onWriteHook(changes);
        await this.write({ changes });
    }
    async set(key, value) {
        await this.setMany({ [key]: value });
    }
    async remove(key) {
        await this.set(key, null);
    }
    async removeMany(keys) {
        const changes = {};
        keys.forEach((key) => {
            changes[key] = null;
        });
        await this.setMany(changes);
    }
    isOverridden(key) {
        return this.overrides.hasOwnProperty(key);
    }
    assertUpdateAllowed(key) {
        if (this.isOverridden(key)) {
            throw new ui_settings_errors_1.CannotOverrideError(`Unable to update "${key}" because it is overridden`);
        }
    }
    async getRaw() {
        const userProvided = await this.getUserProvided();
        return lodash_1.defaultsDeep(userProvided, this.defaults);
    }
    validateKey(key, value) {
        const definition = this.defaults[key];
        if (value === null || definition === undefined)
            return;
        if (definition.schema) {
            definition.schema.validate(value, {}, `validation [${key}]`);
        }
    }
    onWriteHook(changes) {
        for (const key of Object.keys(changes)) {
            this.assertUpdateAllowed(key);
        }
        for (const [key, value] of Object.entries(changes)) {
            this.validateKey(key, value);
        }
    }
    onReadHook(values) {
        // write the userValue for each key stored in the saved object that is not overridden
        // validate value read from saved objects as it can be changed via SO API
        const filteredValues = {};
        for (const [key, userValue] of Object.entries(values)) {
            if (userValue === null || this.isOverridden(key))
                continue;
            try {
                this.validateKey(key, userValue);
                filteredValues[key] = {
                    userValue: userValue,
                };
            }
            catch (error) {
                this.log.warn(`Ignore invalid UiSettings value. ${error}.`);
            }
        }
        return filteredValues;
    }
    async write({ changes, autoCreateOrUpgradeIfMissing = true, }) {
        try {
            await this.savedObjectsClient.update(this.type, this.id, changes);
        }
        catch (error) {
            if (!saved_objects_1.SavedObjectsErrorHelpers.isNotFoundError(error) || !autoCreateOrUpgradeIfMissing) {
                throw error;
            }
            await create_or_upgrade_saved_config_1.createOrUpgradeSavedConfig({
                savedObjectsClient: this.savedObjectsClient,
                version: this.id,
                buildNum: this.buildNum,
                log: this.log,
                handleWriteErrors: false,
            });
            await this.write({
                changes,
                autoCreateOrUpgradeIfMissing: false,
            });
        }
    }
    async read({ ignore401Errors = false, autoCreateOrUpgradeIfMissing = true, } = {}) {
        try {
            const resp = await this.savedObjectsClient.get(this.type, this.id);
            return resp.attributes;
        }
        catch (error) {
            if (saved_objects_1.SavedObjectsErrorHelpers.isNotFoundError(error) && autoCreateOrUpgradeIfMissing) {
                const failedUpgradeAttributes = await create_or_upgrade_saved_config_1.createOrUpgradeSavedConfig({
                    savedObjectsClient: this.savedObjectsClient,
                    version: this.id,
                    buildNum: this.buildNum,
                    log: this.log,
                    handleWriteErrors: true,
                });
                if (!failedUpgradeAttributes) {
                    return await this.read({
                        ignore401Errors,
                        autoCreateOrUpgradeIfMissing: false,
                    });
                }
                return failedUpgradeAttributes;
            }
            if (this.isIgnorableError(error, ignore401Errors)) {
                return {};
            }
            throw error;
        }
    }
    isIgnorableError(error, ignore401Errors) {
        const { isForbiddenError, isEsUnavailableError, isNotAuthorizedError, } = this.savedObjectsClient.errors;
        return (isForbiddenError(error) ||
            isEsUnavailableError(error) ||
            (ignore401Errors && isNotAuthorizedError(error)));
    }
}
exports.UiSettingsClient = UiSettingsClient;
