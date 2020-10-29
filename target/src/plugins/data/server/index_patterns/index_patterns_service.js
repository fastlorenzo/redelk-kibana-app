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
exports.IndexPatternsService = void 0;
const routes_1 = require("./routes");
const saved_objects_1 = require("../saved_objects");
const capabilities_provider_1 = require("./capabilities_provider");
const index_patterns_1 = require("../../common/index_patterns");
const ui_settings_wrapper_1 = require("./ui_settings_wrapper");
const index_patterns_api_client_1 = require("./index_patterns_api_client");
const saved_objects_client_wrapper_1 = require("./saved_objects_client_wrapper");
class IndexPatternsService {
    setup(core) {
        core.savedObjects.registerType(saved_objects_1.indexPatternSavedObjectType);
        core.capabilities.registerProvider(capabilities_provider_1.capabilitiesProvider);
        routes_1.registerRoutes(core.http);
    }
    start(core, { fieldFormats, logger }) {
        const { uiSettings, savedObjects } = core;
        return {
            indexPatternsServiceFactory: async (kibanaRequest) => {
                const savedObjectsClient = savedObjects.getScopedClient(kibanaRequest);
                const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
                const formats = await fieldFormats.fieldFormatServiceFactory(uiSettingsClient);
                return new index_patterns_1.IndexPatternsService({
                    uiSettings: new ui_settings_wrapper_1.UiSettingsServerToCommon(uiSettingsClient),
                    savedObjectsClient: new saved_objects_client_wrapper_1.SavedObjectsClientServerToCommon(savedObjectsClient),
                    apiClient: new index_patterns_api_client_1.IndexPatternsApiServer(),
                    fieldFormats: formats,
                    onError: (error) => {
                        logger.error(error);
                    },
                    onNotification: ({ title, text }) => {
                        logger.warn(`${title} : ${text}`);
                    },
                    onUnsupportedTimePattern: ({ index, title }) => {
                        logger.warn(`Currently querying all indices matching ${index}. ${title} should be migrated to a wildcard-based index pattern.`);
                    },
                });
            },
        };
    }
}
exports.IndexPatternsService = IndexPatternsService;
