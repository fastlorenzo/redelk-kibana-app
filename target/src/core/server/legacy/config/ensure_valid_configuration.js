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
exports.ensureValidConfiguration = void 0;
const get_unused_config_keys_1 = require("./get_unused_config_keys");
const errors_1 = require("../../errors");
async function ensureValidConfiguration(configService, { pluginSpecs, disabledPluginSpecs, pluginExtendedConfig, settings }) {
    const unusedConfigKeys = await get_unused_config_keys_1.getUnusedConfigKeys({
        coreHandledConfigPaths: await configService.getUsedPaths(),
        pluginSpecs,
        disabledPluginSpecs,
        settings,
        legacyConfig: pluginExtendedConfig,
    });
    if (unusedConfigKeys.length > 0) {
        const message = `Unknown configuration key(s): ${unusedConfigKeys
            .map((key) => `"${key}"`)
            .join(', ')}. Check for spelling errors and ensure that expected plugins are installed.`;
        throw new InvalidConfigurationError(message);
    }
}
exports.ensureValidConfiguration = ensureValidConfiguration;
class InvalidConfigurationError extends errors_1.CriticalError {
    constructor(message) {
        super(message, 'InvalidConfig', 64);
        Object.setPrototypeOf(this, InvalidConfigurationError.prototype);
    }
}
