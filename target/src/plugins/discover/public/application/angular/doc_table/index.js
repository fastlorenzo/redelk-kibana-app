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
var doc_table_1 = require("./doc_table");
Object.defineProperty(exports, "createDocTableDirective", { enumerable: true, get: function () { return doc_table_1.createDocTableDirective; } });
var get_sort_1 = require("./lib/get_sort");
Object.defineProperty(exports, "getSort", { enumerable: true, get: function () { return get_sort_1.getSort; } });
Object.defineProperty(exports, "getSortArray", { enumerable: true, get: function () { return get_sort_1.getSortArray; } });
var get_sort_for_search_source_1 = require("./lib/get_sort_for_search_source");
Object.defineProperty(exports, "getSortForSearchSource", { enumerable: true, get: function () { return get_sort_for_search_source_1.getSortForSearchSource; } });
