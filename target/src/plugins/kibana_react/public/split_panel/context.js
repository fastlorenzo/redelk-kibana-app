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
exports.usePanelContext = exports.PanelContextProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const registry_1 = require("./registry");
const PanelContext = react_1.createContext({ registry: new registry_1.PanelRegistry() });
function PanelContextProvider({ children, registry }) {
    return react_1.default.createElement(PanelContext.Provider, { value: { registry } }, children);
}
exports.PanelContextProvider = PanelContextProvider;
exports.usePanelContext = () => {
    const context = react_1.useContext(PanelContext);
    if (context === undefined) {
        throw new Error('usePanelContext must be used within a <PanelContextProvider />');
    }
    return context;
};
