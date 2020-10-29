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
exports.SavedObjectConfig = exports.savedObjectsConfig = exports.savedObjectsMigrationConfig = void 0;
const config_schema_1 = require("@kbn/config-schema");
exports.savedObjectsMigrationConfig = {
    path: 'migrations',
    schema: config_schema_1.schema.object({
        batchSize: config_schema_1.schema.number({ defaultValue: 100 }),
        scrollDuration: config_schema_1.schema.string({ defaultValue: '15m' }),
        pollInterval: config_schema_1.schema.number({ defaultValue: 1500 }),
        skip: config_schema_1.schema.boolean({ defaultValue: false }),
    }),
};
exports.savedObjectsConfig = {
    path: 'savedObjects',
    schema: config_schema_1.schema.object({
        maxImportPayloadBytes: config_schema_1.schema.byteSize({ defaultValue: 10485760 }),
        maxImportExportSize: config_schema_1.schema.byteSize({ defaultValue: 10000 }),
    }),
};
class SavedObjectConfig {
    constructor(rawConfig, rawMigrationConfig) {
        this.maxImportPayloadBytes = rawConfig.maxImportPayloadBytes.getValueInBytes();
        this.maxImportExportSize = rawConfig.maxImportExportSize.getValueInBytes();
        this.migration = rawMigrationConfig;
    }
}
exports.SavedObjectConfig = SavedObjectConfig;
