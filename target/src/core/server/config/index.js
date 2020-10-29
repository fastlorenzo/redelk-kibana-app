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
var config_service_1 = require("./config_service");
Object.defineProperty(exports, "ConfigService", { enumerable: true, get: function () { return config_service_1.ConfigService; } });
var raw_config_service_1 = require("./raw_config_service");
Object.defineProperty(exports, "RawConfigService", { enumerable: true, get: function () { return raw_config_service_1.RawConfigService; } });
var config_1 = require("./config");
Object.defineProperty(exports, "isConfigPath", { enumerable: true, get: function () { return config_1.isConfigPath; } });
Object.defineProperty(exports, "hasConfigPathIntersection", { enumerable: true, get: function () { return config_1.hasConfigPathIntersection; } });
var object_to_config_adapter_1 = require("./object_to_config_adapter");
Object.defineProperty(exports, "ObjectToConfigAdapter", { enumerable: true, get: function () { return object_to_config_adapter_1.ObjectToConfigAdapter; } });
var env_1 = require("./env");
Object.defineProperty(exports, "Env", { enumerable: true, get: function () { return env_1.Env; } });
var deprecation_1 = require("./deprecation");
Object.defineProperty(exports, "coreDeprecationProvider", { enumerable: true, get: function () { return deprecation_1.coreDeprecationProvider; } });
