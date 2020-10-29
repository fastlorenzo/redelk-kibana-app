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
exports.mountReactNode = exports.MountWrapper = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_dom_1 = require("react-dom");
const react_2 = require("@kbn/i18n/react");
const defaultWrapperClass = 'kbnMountWrapper';
/**
 * MountWrapper is a react component to mount a {@link MountPoint} inside a react tree.
 */
exports.MountWrapper = ({ mount, className = defaultWrapperClass, }) => {
    const element = react_1.useRef(null);
    react_1.useEffect(() => mount(element.current), [mount]);
    return react_1.default.createElement("div", { className: className, ref: element });
};
/**
 * Mount converter for react node.
 *
 * @param node to get a mount for
 */
exports.mountReactNode = (node) => (element) => {
    react_dom_1.render(react_1.default.createElement(react_2.I18nProvider, null, node), element);
    return () => react_dom_1.unmountComponentAtNode(element);
};
