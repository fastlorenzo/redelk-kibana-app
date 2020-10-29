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
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./service"), exports);
var schema_1 = require("./schema");
Object.defineProperty(exports, "SavedObjectsSchema", { enumerable: true, get: function () { return schema_1.SavedObjectsSchema; } });
tslib_1.__exportStar(require("./import"), exports);
var export_1 = require("./export");
Object.defineProperty(exports, "exportSavedObjectsToStream", { enumerable: true, get: function () { return export_1.exportSavedObjectsToStream; } });
var serialization_1 = require("./serialization");
Object.defineProperty(exports, "SavedObjectsSerializer", { enumerable: true, get: function () { return serialization_1.SavedObjectsSerializer; } });
var saved_objects_service_1 = require("./saved_objects_service");
Object.defineProperty(exports, "SavedObjectsService", { enumerable: true, get: function () { return saved_objects_service_1.SavedObjectsService; } });
var saved_objects_config_1 = require("./saved_objects_config");
Object.defineProperty(exports, "savedObjectsConfig", { enumerable: true, get: function () { return saved_objects_config_1.savedObjectsConfig; } });
Object.defineProperty(exports, "savedObjectsMigrationConfig", { enumerable: true, get: function () { return saved_objects_config_1.savedObjectsMigrationConfig; } });
var saved_objects_type_registry_1 = require("./saved_objects_type_registry");
Object.defineProperty(exports, "SavedObjectTypeRegistry", { enumerable: true, get: function () { return saved_objects_type_registry_1.SavedObjectTypeRegistry; } });
