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
exports.createOrUpgradeSavedConfig = void 0;
const lodash_1 = require("lodash");
const saved_objects_1 = require("../../saved_objects/");
const get_upgradeable_config_1 = require("./get_upgradeable_config");
async function createOrUpgradeSavedConfig(options) {
    const { savedObjectsClient, version, buildNum, log, handleWriteErrors } = options;
    // try to find an older config we can upgrade
    const upgradeableConfig = await get_upgradeable_config_1.getUpgradeableConfig({
        savedObjectsClient,
        version,
    });
    // default to the attributes of the upgradeableConfig if available
    const attributes = lodash_1.defaults({ buildNum }, upgradeableConfig ? upgradeableConfig.attributes : {});
    try {
        // create the new SavedConfig
        await savedObjectsClient.create('config', attributes, { id: version });
    }
    catch (error) {
        if (handleWriteErrors) {
            if (saved_objects_1.SavedObjectsErrorHelpers.isConflictError(error)) {
                return;
            }
            if (saved_objects_1.SavedObjectsErrorHelpers.isNotAuthorizedError(error) ||
                saved_objects_1.SavedObjectsErrorHelpers.isForbiddenError(error)) {
                return attributes;
            }
        }
        throw error;
    }
    if (upgradeableConfig) {
        log.debug(`Upgrade config from ${upgradeableConfig.id} to ${version}`, {
            prevVersion: upgradeableConfig.id,
            newVersion: version,
        });
    }
}
exports.createOrUpgradeSavedConfig = createOrUpgradeSavedConfig;
