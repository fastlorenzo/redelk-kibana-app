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
var elasticsearch_service_1 = require("./elasticsearch_service");
Object.defineProperty(exports, "ElasticsearchService", { enumerable: true, get: function () { return elasticsearch_service_1.ElasticsearchService; } });
var elasticsearch_config_1 = require("./elasticsearch_config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return elasticsearch_config_1.config; } });
Object.defineProperty(exports, "configSchema", { enumerable: true, get: function () { return elasticsearch_config_1.configSchema; } });
Object.defineProperty(exports, "ElasticsearchConfig", { enumerable: true, get: function () { return elasticsearch_config_1.ElasticsearchConfig; } });
tslib_1.__exportStar(require("./legacy"), exports);
