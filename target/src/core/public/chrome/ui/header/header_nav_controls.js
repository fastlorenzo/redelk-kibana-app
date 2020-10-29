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
exports.HeaderNavControls = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const react_use_1 = require("react-use");
const header_extension_1 = require("./header_extension");
function HeaderNavControls({ navControls$, side }) {
    const navControls = react_use_1.useObservable(navControls$, []);
    if (!navControls) {
        return null;
    }
    // It should be performant to use the index as the key since these are unlikely
    // to change while Kibana is running.
    return (react_1.default.createElement(react_1.default.Fragment, null, navControls.map((navControl, index) => (react_1.default.createElement(eui_1.EuiHeaderSectionItem, { key: index, border: side === 'left' ? 'right' : 'left' },
        react_1.default.createElement(header_extension_1.HeaderExtension, { extension: navControl.mount }))))));
}
exports.HeaderNavControls = HeaderNavControls;
