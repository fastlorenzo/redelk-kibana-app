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
exports.PanelsContainer = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const context_1 = require("../context");
const resizer_1 = require("../components/resizer");
const registry_1 = require("../registry");
const initialState = { isDragging: false, currentResizerPos: -1 };
const pxToPercent = (proportion, whole) => (proportion / whole) * 100;
function PanelsContainer({ children, className, onPanelWidthChange, resizerClassName, }) {
    const childrenArray = react_1.Children.toArray(children);
    const [firstChild, secondChild] = childrenArray;
    const registryRef = react_1.useRef(new registry_1.PanelRegistry());
    const containerRef = react_1.useRef(null);
    const [state, setState] = react_1.useState(initialState);
    const getContainerWidth = () => {
        return containerRef.current.getBoundingClientRect().width;
    };
    const handleMouseDown = react_1.useCallback((event) => {
        setState({
            ...state,
            isDragging: true,
            currentResizerPos: event.clientX,
        });
    }, [state]);
    const handleKeyDown = react_1.useCallback((ev) => {
        const { key } = ev;
        if (key === eui_1.keys.ARROW_LEFT || key === eui_1.keys.ARROW_RIGHT) {
            ev.preventDefault();
            const { current: registry } = registryRef;
            const [left, right] = registry.getPanels();
            const leftPercent = left.width - (key === eui_1.keys.ARROW_LEFT ? 1 : -1);
            const rightPercent = right.width - (key === eui_1.keys.ARROW_RIGHT ? 1 : -1);
            left.setWidth(leftPercent);
            right.setWidth(rightPercent);
            if (onPanelWidthChange) {
                onPanelWidthChange([leftPercent, rightPercent]);
            }
        }
    }, [onPanelWidthChange]);
    react_1.useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            // For now we only support bi-split
            if (childrenArray.length > 2) {
                // eslint-disable-next-line no-console
                console.warn('[Split Panels Container] Detected more than two children; ignoring additional children.');
            }
        }
    }, [childrenArray.length]);
    const childrenWithResizer = [
        firstChild,
        react_1.default.createElement(resizer_1.Resizer, { key: 'resizer', className: resizerClassName, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown }),
        secondChild,
    ];
    return (react_1.default.createElement(context_1.PanelContextProvider, { registry: registryRef.current },
        react_1.default.createElement("div", { className: className, ref: containerRef, style: { display: 'flex', height: '100%', width: '100%' }, onMouseMove: (event) => {
                if (state.isDragging) {
                    const { clientX: x } = event;
                    const { current: registry } = registryRef;
                    const [left, right] = registry.getPanels();
                    const delta = x - state.currentResizerPos;
                    const containerWidth = getContainerWidth();
                    const leftPercent = pxToPercent(left.getWidth() + delta, containerWidth);
                    const rightPercent = pxToPercent(right.getWidth() - delta, containerWidth);
                    left.setWidth(leftPercent);
                    right.setWidth(rightPercent);
                    if (onPanelWidthChange) {
                        onPanelWidthChange([leftPercent, rightPercent]);
                    }
                    setState({ ...state, currentResizerPos: x });
                }
            }, onMouseUp: () => {
                setState(initialState);
            } }, childrenWithResizer)));
}
exports.PanelsContainer = PanelsContainer;
