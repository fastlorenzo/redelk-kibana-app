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
exports.Plugin = exports.DataServerPlugin = void 0;
const index_patterns_1 = require("./index_patterns");
const search_service_1 = require("./search/search_service");
const query_service_1 = require("./query/query_service");
const scripts_1 = require("./scripts");
const kql_telemetry_1 = require("./kql_telemetry");
const autocomplete_1 = require("./autocomplete");
const field_formats_1 = require("./field_formats");
const ui_settings_1 = require("./ui_settings");
class DataServerPlugin {
    constructor(initializerContext) {
        this.indexPatterns = new index_patterns_1.IndexPatternsService();
        this.fieldFormats = new field_formats_1.FieldFormatsService();
        this.queryService = new query_service_1.QueryService();
        this.searchService = new search_service_1.SearchService(initializerContext);
        this.scriptsService = new scripts_1.ScriptsService();
        this.kqlTelemetryService = new kql_telemetry_1.KqlTelemetryService(initializerContext);
        this.autocompleteService = new autocomplete_1.AutocompleteService(initializerContext);
        this.logger = initializerContext.logger.get('data');
    }
    setup(core, { usageCollection }) {
        this.indexPatterns.setup(core);
        this.scriptsService.setup(core);
        this.queryService.setup(core);
        this.autocompleteService.setup(core);
        this.kqlTelemetryService.setup(core, { usageCollection });
        core.uiSettings.register(ui_settings_1.getUiSettings());
        return {
            search: this.searchService.setup(core, { usageCollection }),
            fieldFormats: this.fieldFormats.setup(),
        };
    }
    start(core) {
        const fieldFormats = this.fieldFormats.start();
        return {
            search: this.searchService.start(),
            fieldFormats,
            indexPatterns: this.indexPatterns.start(core, {
                fieldFormats,
                logger: this.logger.get('indexPatterns'),
            }),
        };
    }
    stop() { }
}
exports.DataServerPlugin = DataServerPlugin;
exports.Plugin = DataServerPlugin;
