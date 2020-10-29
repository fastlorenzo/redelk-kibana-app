"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerError = void 0;
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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../../kibana_legacy/public");
function DocViewerError({ error }) {
    const errMsg = public_1.formatMsg(error);
    const errStack = typeof error === 'object' ? public_1.formatStack(error) : '';
    return (react_1.default.createElement(eui_1.EuiCallOut, { title: errMsg, color: "danger", iconType: "cross", "data-test-subj": "docViewerError" }, errStack && react_1.default.createElement(eui_1.EuiCodeBlock, null, errStack)));
}
exports.DocViewerError = DocViewerError;
