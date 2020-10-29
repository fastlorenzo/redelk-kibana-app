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
exports.config = void 0;
const tslib_1 = require("tslib");
/**
 * The Kibana Core APIs for server-side plugins.
 *
 * A plugin requires a `kibana.json` file at it's root directory that follows
 * {@link PluginManifest | the manfiest schema} to define static plugin
 * information required to load the plugin.
 *
 * A plugin's `server/index` file must contain a named import, `plugin`, that
 * implements {@link PluginInitializer} which returns an object that implements
 * {@link Plugin}.
 *
 * The plugin integrates with the core system via lifecycle events: `setup`,
 * `start`, and `stop`. In each lifecycle method, the plugin will receive the
 * corresponding core services available (either {@link CoreSetup} or
 * {@link CoreStart}) and any interfaces returned by dependency plugins'
 * lifecycle method. Anything returned by the plugin's lifecycle method will be
 * exposed to downstream dependencies when their corresponding lifecycle methods
 * are invoked.
 *
 * @packageDocumentation
 */
const elasticsearch_1 = require("./elasticsearch");
const logging_1 = require("./logging");
var bootstrap_1 = require("./bootstrap");
Object.defineProperty(exports, "bootstrap", { enumerable: true, get: function () { return bootstrap_1.bootstrap; } });
var config_1 = require("./config");
Object.defineProperty(exports, "ConfigService", { enumerable: true, get: function () { return config_1.ConfigService; } });
var csp_1 = require("./csp");
Object.defineProperty(exports, "CspConfig", { enumerable: true, get: function () { return csp_1.CspConfig; } });
var elasticsearch_2 = require("./elasticsearch");
Object.defineProperty(exports, "LegacyClusterClient", { enumerable: true, get: function () { return elasticsearch_2.LegacyClusterClient; } });
Object.defineProperty(exports, "LegacyScopedClusterClient", { enumerable: true, get: function () { return elasticsearch_2.LegacyScopedClusterClient; } });
Object.defineProperty(exports, "ElasticsearchConfig", { enumerable: true, get: function () { return elasticsearch_2.ElasticsearchConfig; } });
Object.defineProperty(exports, "LegacyElasticsearchErrorHelpers", { enumerable: true, get: function () { return elasticsearch_2.LegacyElasticsearchErrorHelpers; } });
tslib_1.__exportStar(require("./elasticsearch/legacy/api_types"), exports);
var http_1 = require("./http");
Object.defineProperty(exports, "AuthStatus", { enumerable: true, get: function () { return http_1.AuthStatus; } });
Object.defineProperty(exports, "AuthResultType", { enumerable: true, get: function () { return http_1.AuthResultType; } });
Object.defineProperty(exports, "BasePath", { enumerable: true, get: function () { return http_1.BasePath; } });
Object.defineProperty(exports, "KibanaRequest", { enumerable: true, get: function () { return http_1.KibanaRequest; } });
Object.defineProperty(exports, "kibanaResponseFactory", { enumerable: true, get: function () { return http_1.kibanaResponseFactory; } });
Object.defineProperty(exports, "validBodyOutput", { enumerable: true, get: function () { return http_1.validBodyOutput; } });
Object.defineProperty(exports, "RouteValidationError", { enumerable: true, get: function () { return http_1.RouteValidationError; } });
var logging_2 = require("./logging");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logging_2.LogLevel; } });
var saved_objects_1 = require("./saved_objects");
Object.defineProperty(exports, "SavedObjectsClient", { enumerable: true, get: function () { return saved_objects_1.SavedObjectsClient; } });
Object.defineProperty(exports, "SavedObjectsErrorHelpers", { enumerable: true, get: function () { return saved_objects_1.SavedObjectsErrorHelpers; } });
Object.defineProperty(exports, "SavedObjectsSchema", { enumerable: true, get: function () { return saved_objects_1.SavedObjectsSchema; } });
Object.defineProperty(exports, "SavedObjectsSerializer", { enumerable: true, get: function () { return saved_objects_1.SavedObjectsSerializer; } });
Object.defineProperty(exports, "SavedObjectsRepository", { enumerable: true, get: function () { return saved_objects_1.SavedObjectsRepository; } });
Object.defineProperty(exports, "SavedObjectTypeRegistry", { enumerable: true, get: function () { return saved_objects_1.SavedObjectTypeRegistry; } });
Object.defineProperty(exports, "exportSavedObjectsToStream", { enumerable: true, get: function () { return saved_objects_1.exportSavedObjectsToStream; } });
Object.defineProperty(exports, "importSavedObjectsFromStream", { enumerable: true, get: function () { return saved_objects_1.importSavedObjectsFromStream; } });
Object.defineProperty(exports, "resolveSavedObjectsImportErrors", { enumerable: true, get: function () { return saved_objects_1.resolveSavedObjectsImportErrors; } });
var utils_1 = require("../utils");
Object.defineProperty(exports, "DEFAULT_APP_CATEGORIES", { enumerable: true, get: function () { return utils_1.DEFAULT_APP_CATEGORIES; } });
Object.defineProperty(exports, "getFlattenedObject", { enumerable: true, get: function () { return utils_1.getFlattenedObject; } });
Object.defineProperty(exports, "modifyUrl", { enumerable: true, get: function () { return utils_1.modifyUrl; } });
Object.defineProperty(exports, "isRelativeUrl", { enumerable: true, get: function () { return utils_1.isRelativeUrl; } });
Object.defineProperty(exports, "deepFreeze", { enumerable: true, get: function () { return utils_1.deepFreeze; } });
Object.defineProperty(exports, "assertNever", { enumerable: true, get: function () { return utils_1.assertNever; } });
var legacy_1 = require("./legacy");
Object.defineProperty(exports, "LegacyInternals", { enumerable: true, get: function () { return legacy_1.LegacyInternals; } });
var status_1 = require("./status");
Object.defineProperty(exports, "ServiceStatusLevels", { enumerable: true, get: function () { return status_1.ServiceStatusLevels; } });
/**
 * Config schemas for the platform services.
 *
 * @alpha
 */
exports.config = {
    elasticsearch: {
        schema: elasticsearch_1.configSchema,
    },
    logging: {
        appenders: logging_1.appendersSchema,
        loggers: logging_1.loggerSchema,
        loggerContext: logging_1.loggerContextConfigSchema,
    },
};
