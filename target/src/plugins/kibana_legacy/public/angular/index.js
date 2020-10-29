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
// @ts-ignore
var promises_1 = require("./promises");
Object.defineProperty(exports, "PromiseServiceCreator", { enumerable: true, get: function () { return promises_1.PromiseServiceCreator; } });
// @ts-ignore
var watch_multi_1 = require("./watch_multi");
Object.defineProperty(exports, "watchMultiDecorator", { enumerable: true, get: function () { return watch_multi_1.watchMultiDecorator; } });
tslib_1.__exportStar(require("./angular_config"), exports);
// @ts-ignore
var kbn_top_nav_1 = require("./kbn_top_nav");
Object.defineProperty(exports, "createTopNavDirective", { enumerable: true, get: function () { return kbn_top_nav_1.createTopNavDirective; } });
Object.defineProperty(exports, "createTopNavHelper", { enumerable: true, get: function () { return kbn_top_nav_1.createTopNavHelper; } });
Object.defineProperty(exports, "loadKbnTopNavDirectives", { enumerable: true, get: function () { return kbn_top_nav_1.loadKbnTopNavDirectives; } });
var subscribe_with_scope_1 = require("./subscribe_with_scope");
Object.defineProperty(exports, "subscribeWithScope", { enumerable: true, get: function () { return subscribe_with_scope_1.subscribeWithScope; } });
