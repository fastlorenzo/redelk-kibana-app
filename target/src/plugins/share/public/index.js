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
exports.plugin = void 0;
var constants_1 = require("../common/constants");
Object.defineProperty(exports, "CSV_QUOTE_VALUES_SETTING", { enumerable: true, get: function () { return constants_1.CSV_QUOTE_VALUES_SETTING; } });
Object.defineProperty(exports, "CSV_SEPARATOR_SETTING", { enumerable: true, get: function () { return constants_1.CSV_SEPARATOR_SETTING; } });
var url_generators_1 = require("./url_generators");
Object.defineProperty(exports, "UrlGeneratorsService", { enumerable: true, get: function () { return url_generators_1.UrlGeneratorsService; } });
const plugin_1 = require("./plugin");
exports.plugin = () => new plugin_1.SharePlugin();
