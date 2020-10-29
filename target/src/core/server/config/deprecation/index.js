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
var deprecation_factory_1 = require("./deprecation_factory");
Object.defineProperty(exports, "configDeprecationFactory", { enumerable: true, get: function () { return deprecation_factory_1.configDeprecationFactory; } });
var core_deprecations_1 = require("./core_deprecations");
Object.defineProperty(exports, "coreDeprecationProvider", { enumerable: true, get: function () { return core_deprecations_1.coreDeprecationProvider; } });
var apply_deprecations_1 = require("./apply_deprecations");
Object.defineProperty(exports, "applyDeprecations", { enumerable: true, get: function () { return apply_deprecations_1.applyDeprecations; } });
