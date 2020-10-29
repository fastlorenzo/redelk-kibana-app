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
/**
 * The Kibana Core APIs for client-side plugins.
 *
 * A plugin's `public/index` file must contain a named import, `plugin`, that
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
require("./index.scss");
/** @interal */
var core_system_1 = require("./core_system");
Object.defineProperty(exports, "CoreSystem", { enumerable: true, get: function () { return core_system_1.CoreSystem; } });
var utils_1 = require("../utils");
Object.defineProperty(exports, "DEFAULT_APP_CATEGORIES", { enumerable: true, get: function () { return utils_1.DEFAULT_APP_CATEGORIES; } });
Object.defineProperty(exports, "getFlattenedObject", { enumerable: true, get: function () { return utils_1.getFlattenedObject; } });
Object.defineProperty(exports, "modifyUrl", { enumerable: true, get: function () { return utils_1.modifyUrl; } });
Object.defineProperty(exports, "isRelativeUrl", { enumerable: true, get: function () { return utils_1.isRelativeUrl; } });
Object.defineProperty(exports, "deepFreeze", { enumerable: true, get: function () { return utils_1.deepFreeze; } });
Object.defineProperty(exports, "assertNever", { enumerable: true, get: function () { return utils_1.assertNever; } });
var application_1 = require("./application");
Object.defineProperty(exports, "AppLeaveActionType", { enumerable: true, get: function () { return application_1.AppLeaveActionType; } });
Object.defineProperty(exports, "AppStatus", { enumerable: true, get: function () { return application_1.AppStatus; } });
Object.defineProperty(exports, "AppNavLinkStatus", { enumerable: true, get: function () { return application_1.AppNavLinkStatus; } });
Object.defineProperty(exports, "ScopedHistory", { enumerable: true, get: function () { return application_1.ScopedHistory; } });
var saved_objects_1 = require("./saved_objects");
Object.defineProperty(exports, "SavedObjectsClient", { enumerable: true, get: function () { return saved_objects_1.SavedObjectsClient; } });
Object.defineProperty(exports, "SimpleSavedObject", { enumerable: true, get: function () { return saved_objects_1.SimpleSavedObject; } });
var http_1 = require("./http");
Object.defineProperty(exports, "HttpFetchError", { enumerable: true, get: function () { return http_1.HttpFetchError; } });
var notifications_1 = require("./notifications");
Object.defineProperty(exports, "ToastsApi", { enumerable: true, get: function () { return notifications_1.ToastsApi; } });
var core_app_1 = require("./core_app");
Object.defineProperty(exports, "URL_MAX_LENGTH", { enumerable: true, get: function () { return core_app_1.URL_MAX_LENGTH; } });
var kbn_bootstrap_1 = require("./kbn_bootstrap");
Object.defineProperty(exports, "__kbnBootstrap__", { enumerable: true, get: function () { return kbn_bootstrap_1.__kbnBootstrap__; } });
