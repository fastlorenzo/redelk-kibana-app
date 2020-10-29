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
var connect_to_query_state_1 = require("./connect_to_query_state");
Object.defineProperty(exports, "connectToQueryState", { enumerable: true, get: function () { return connect_to_query_state_1.connectToQueryState; } });
var sync_state_with_url_1 = require("./sync_state_with_url");
Object.defineProperty(exports, "syncQueryStateWithUrl", { enumerable: true, get: function () { return sync_state_with_url_1.syncQueryStateWithUrl; } });
