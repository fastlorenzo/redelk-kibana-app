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
const tslib_1 = require("tslib");
const plugin_1 = require("./plugin");
exports.plugin = (initializerContext) => new plugin_1.KibanaLegacyPlugin(initializerContext);
tslib_1.__exportStar(require("./plugin"), exports);
var kbn_base_url_1 = require("../common/kbn_base_url");
Object.defineProperty(exports, "kbnBaseUrl", { enumerable: true, get: function () { return kbn_base_url_1.kbnBaseUrl; } });
var angular_bootstrap_1 = require("./angular_bootstrap");
Object.defineProperty(exports, "initAngularBootstrap", { enumerable: true, get: function () { return angular_bootstrap_1.initAngularBootstrap; } });
var paginate_1 = require("./paginate/paginate");
Object.defineProperty(exports, "PaginateDirectiveProvider", { enumerable: true, get: function () { return paginate_1.PaginateDirectiveProvider; } });
Object.defineProperty(exports, "PaginateControlsDirectiveProvider", { enumerable: true, get: function () { return paginate_1.PaginateControlsDirectiveProvider; } });
tslib_1.__exportStar(require("./angular"), exports);
tslib_1.__exportStar(require("./notify"), exports);
tslib_1.__exportStar(require("./utils"), exports);
