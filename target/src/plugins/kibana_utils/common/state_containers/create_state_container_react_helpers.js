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
exports.createStateContainerReactHelpers = exports.useContainerSelector = exports.useContainerState = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const useObservable_1 = tslib_1.__importDefault(require("react-use/lib/useObservable"));
const fast_deep_equal_1 = tslib_1.__importDefault(require("fast-deep-equal"));
const { useContext, useLayoutEffect, useRef, createElement: h } = react_1.default;
/**
 * React hooks that returns the latest state of a {@link StateContainer}.
 *
 * @param container - {@link StateContainer} which state to track.
 * @returns - latest {@link StateContainer} state
 * @public
 */
exports.useContainerState = (container) => useObservable_1.default(container.state$, container.get());
/**
 * React hook to apply selector to state container to extract only needed information. Will
 * re-render your component only when the section changes.
 *
 * @param container - {@link StateContainer} which state to track.
 * @param selector - Function used to pick parts of state.
 * @param comparator - {@link Comparator} function used to memoize previous result, to not
 *    re-render React component if state did not change. By default uses
 *    `fast-deep-equal` package.
 * @returns - result of a selector(state)
 * @public
 */
exports.useContainerSelector = (container, selector, comparator = fast_deep_equal_1.default) => {
    const { state$, get } = container;
    const lastValueRef = useRef(get());
    const [value, setValue] = react_1.default.useState(() => {
        const newValue = selector(get());
        lastValueRef.current = newValue;
        return newValue;
    });
    useLayoutEffect(() => {
        const subscription = state$.subscribe((currentState) => {
            const newValue = selector(currentState);
            if (!comparator(lastValueRef.current, newValue)) {
                lastValueRef.current = newValue;
                setValue(newValue);
            }
        });
        return () => subscription.unsubscribe();
    }, [state$, comparator]);
    return value;
};
/**
 * Creates helpers for using {@link StateContainer | State Containers} with react
 * Refer to {@link https://github.com/elastic/kibana/blob/master/src/plugins/kibana_utils/docs/state_containers/react.md | guide} for details
 * @public
 */
exports.createStateContainerReactHelpers = () => {
    const context = react_1.default.createContext(null);
    const useContainer = () => useContext(context);
    const useState = () => {
        const container = useContainer();
        return exports.useContainerState(container);
    };
    const useTransitions = () => useContainer().transitions;
    const useSelector = (selector, comparator = fast_deep_equal_1.default) => {
        const container = useContainer();
        return exports.useContainerSelector(container, selector, comparator);
    };
    const connect = (mapStateToProp) => (component) => (props) => h(component, { ...useSelector(mapStateToProp), ...props });
    return {
        Provider: context.Provider,
        Consumer: context.Consumer,
        context,
        useContainer,
        useState,
        useTransitions,
        useSelector,
        connect,
    };
};
