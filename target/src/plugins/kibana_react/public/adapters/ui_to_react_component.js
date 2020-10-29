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
exports.uiToReactComponent = void 0;
const react_1 = require("react");
/**
 * Transforms `UiComponent` into a React component.
 */
exports.uiToReactComponent = (Comp, as = 'div') => (props) => {
    const ref = react_1.useRef();
    const comp = react_1.useMemo(() => Comp(), [Comp]);
    react_1.useLayoutEffect(() => {
        if (!ref.current)
            return;
        comp.render(ref.current, props);
    });
    react_1.useLayoutEffect(() => {
        if (!comp.unmount)
            return;
        return () => {
            if (comp.unmount)
                comp.unmount();
        };
    }, [comp]);
    return react_1.createElement(as, {
        ref,
    });
};
