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
 * State syncing utilities are a set of helpers for syncing your application state
 * with browser URL or browser storage.
 *
 * They are designed to work together with {@link https://github.com/elastic/kibana/tree/master/src/plugins/kibana_utils/docs/state_containers | state containers}. But state containers are not required.
 *
 * State syncing utilities include:
 *
 * *{@link syncState} util which:
 *   * Subscribes to state changes and pushes them to state storage.
 *   * Optionally subscribes to state storage changes and pushes them to state.
 *   * Two types of storages compatible with `syncState`:
 *   * {@link IKbnUrlStateStorage} - Serializes state and persists it to URL's query param in rison or hashed format.
 * Listens for state updates in the URL and pushes them back to state.
 *   * {@link ISessionStorageStateStorage} - Serializes state and persists it to browser storage.
 *
 * Refer {@link https://github.com/elastic/kibana/tree/master/src/plugins/kibana_utils/docs/state_sync | here} for a complete guide and examples.
 * @packageDocumentation
 */
var state_sync_state_storage_1 = require("./state_sync_state_storage");
Object.defineProperty(exports, "createSessionStorageStateStorage", { enumerable: true, get: function () { return state_sync_state_storage_1.createSessionStorageStateStorage; } });
Object.defineProperty(exports, "createKbnUrlStateStorage", { enumerable: true, get: function () { return state_sync_state_storage_1.createKbnUrlStateStorage; } });
var state_sync_1 = require("./state_sync");
Object.defineProperty(exports, "syncState", { enumerable: true, get: function () { return state_sync_1.syncState; } });
Object.defineProperty(exports, "syncStates", { enumerable: true, get: function () { return state_sync_1.syncStates; } });
