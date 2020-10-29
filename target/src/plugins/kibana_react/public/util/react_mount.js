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
exports.toMountPoint = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_2 = require("@kbn/i18n/react");
/**
 * MountPoint converter for react nodes.
 *
 * @param node to get a mount point for
 */
exports.toMountPoint = (node) => {
    const mount = (element) => {
        react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null, node), element);
        return () => react_dom_1.default.unmountComponentAtNode(element);
    };
    // only used for tests and snapshots serialization
    if (process.env.NODE_ENV !== 'production') {
        mount.__reactMount__ = node;
    }
    return mount;
};
