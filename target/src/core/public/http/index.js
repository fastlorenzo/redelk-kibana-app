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
var http_service_1 = require("./http_service");
Object.defineProperty(exports, "HttpService", { enumerable: true, get: function () { return http_service_1.HttpService; } });
var http_fetch_error_1 = require("./http_fetch_error");
Object.defineProperty(exports, "HttpFetchError", { enumerable: true, get: function () { return http_fetch_error_1.HttpFetchError; } });
tslib_1.__exportStar(require("./types"), exports);
