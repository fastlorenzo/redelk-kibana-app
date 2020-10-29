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
exports.functionSpecs = void 0;
const tslib_1 = require("tslib");
const clog_1 = require("./clog");
const font_1 = require("./font");
const kibana_1 = require("./kibana");
const kibana_context_1 = require("./kibana_context");
const var_set_1 = require("./var_set");
const var_1 = require("./var");
exports.functionSpecs = [
    clog_1.clog,
    font_1.font,
    kibana_1.kibana,
    kibana_context_1.kibanaContextFunction,
    var_set_1.variableSet,
    var_1.variable,
];
tslib_1.__exportStar(require("./clog"), exports);
tslib_1.__exportStar(require("./font"), exports);
tslib_1.__exportStar(require("./kibana"), exports);
tslib_1.__exportStar(require("./kibana_context"), exports);
tslib_1.__exportStar(require("./var_set"), exports);
tslib_1.__exportStar(require("./var"), exports);
