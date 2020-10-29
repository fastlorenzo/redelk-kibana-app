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
var as_pretty_string_1 = require("./as_pretty_string");
Object.defineProperty(exports, "asPrettyString", { enumerable: true, get: function () { return as_pretty_string_1.asPrettyString; } });
var highlight_1 = require("./highlight");
Object.defineProperty(exports, "getHighlightHtml", { enumerable: true, get: function () { return highlight_1.getHighlightHtml; } });
Object.defineProperty(exports, "getHighlightRequest", { enumerable: true, get: function () { return highlight_1.getHighlightRequest; } });
