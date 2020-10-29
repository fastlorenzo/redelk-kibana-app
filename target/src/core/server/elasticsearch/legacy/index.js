"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
var cluster_client_1 = require("./cluster_client");
Object.defineProperty(exports, "LegacyClusterClient", { enumerable: true, get: function () { return cluster_client_1.LegacyClusterClient; } });
var scoped_cluster_client_1 = require("./scoped_cluster_client");
Object.defineProperty(exports, "LegacyScopedClusterClient", { enumerable: true, get: function () { return scoped_cluster_client_1.LegacyScopedClusterClient; } });
var retry_call_cluster_1 = require("./retry_call_cluster");
Object.defineProperty(exports, "retryCallCluster", { enumerable: true, get: function () { return retry_call_cluster_1.retryCallCluster; } });
Object.defineProperty(exports, "migrationsRetryCallCluster", { enumerable: true, get: function () { return retry_call_cluster_1.migrationsRetryCallCluster; } });
var errors_1 = require("./errors");
Object.defineProperty(exports, "LegacyElasticsearchErrorHelpers", { enumerable: true, get: function () { return errors_1.LegacyElasticsearchErrorHelpers; } });
tslib_1.__exportStar(require("./api_types"), exports);
