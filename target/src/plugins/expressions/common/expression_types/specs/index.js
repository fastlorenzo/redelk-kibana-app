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
exports.typeSpecs = void 0;
const tslib_1 = require("tslib");
const boolean_1 = require("./boolean");
const datatable_1 = require("./datatable");
const error_1 = require("./error");
const filter_1 = require("./filter");
const image_1 = require("./image");
const kibana_context_1 = require("./kibana_context");
const kibana_datatable_1 = require("./kibana_datatable");
const null_1 = require("./null");
const num_1 = require("./num");
const number_1 = require("./number");
const pointseries_1 = require("./pointseries");
const range_1 = require("./range");
const render_1 = require("./render");
const shape_1 = require("./shape");
const string_1 = require("./string");
const style_1 = require("./style");
exports.typeSpecs = [
    boolean_1.boolean,
    datatable_1.datatable,
    error_1.error,
    filter_1.filter,
    image_1.image,
    kibana_context_1.kibanaContext,
    kibana_datatable_1.kibanaDatatable,
    null_1.nullType,
    num_1.num,
    number_1.number,
    pointseries_1.pointseries,
    range_1.range,
    render_1.render,
    shape_1.shape,
    string_1.string,
    style_1.style,
];
tslib_1.__exportStar(require("./boolean"), exports);
tslib_1.__exportStar(require("./datatable"), exports);
tslib_1.__exportStar(require("./error"), exports);
tslib_1.__exportStar(require("./filter"), exports);
tslib_1.__exportStar(require("./image"), exports);
tslib_1.__exportStar(require("./kibana_context"), exports);
tslib_1.__exportStar(require("./kibana_datatable"), exports);
tslib_1.__exportStar(require("./null"), exports);
tslib_1.__exportStar(require("./num"), exports);
tslib_1.__exportStar(require("./number"), exports);
tslib_1.__exportStar(require("./pointseries"), exports);
tslib_1.__exportStar(require("./range"), exports);
tslib_1.__exportStar(require("./render"), exports);
tslib_1.__exportStar(require("./shape"), exports);
tslib_1.__exportStar(require("./string"), exports);
tslib_1.__exportStar(require("./style"), exports);
