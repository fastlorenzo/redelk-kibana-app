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
var saved_object_1 = require("./saved_object");
Object.defineProperty(exports, "createSavedObjectClass", { enumerable: true, get: function () { return saved_object_1.createSavedObjectClass; } });
var saved_object_loader_1 = require("./saved_object_loader");
Object.defineProperty(exports, "SavedObjectLoader", { enumerable: true, get: function () { return saved_object_loader_1.SavedObjectLoader; } });
var check_for_duplicate_title_1 = require("./helpers/check_for_duplicate_title");
Object.defineProperty(exports, "checkForDuplicateTitle", { enumerable: true, get: function () { return check_for_duplicate_title_1.checkForDuplicateTitle; } });
var save_with_confirmation_1 = require("./helpers/save_with_confirmation");
Object.defineProperty(exports, "saveWithConfirmation", { enumerable: true, get: function () { return save_with_confirmation_1.saveWithConfirmation; } });
var save_saved_object_1 = require("./helpers/save_saved_object");
Object.defineProperty(exports, "isErrorNonFatal", { enumerable: true, get: function () { return save_saved_object_1.isErrorNonFatal; } });
