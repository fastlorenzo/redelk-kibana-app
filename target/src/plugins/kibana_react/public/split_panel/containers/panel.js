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
exports.Panel = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const context_1 = require("../context");
function Panel({ children, className, initialWidth = 100, style = {} }) {
    const [width, setWidth] = react_1.useState(`${initialWidth}%`);
    const { registry } = context_1.usePanelContext();
    const divRef = react_1.useRef(null);
    react_1.useEffect(() => {
        registry.registerPanel({
            width: initialWidth,
            setWidth(value) {
                setWidth(value + '%');
                this.width = value;
            },
            getWidth() {
                return divRef.current.getBoundingClientRect().width;
            },
        });
    }, [initialWidth, registry]);
    return (react_1.default.createElement("div", { className: className, ref: divRef, style: { ...style, width, display: 'flex' } }, children));
}
exports.Panel = Panel;
