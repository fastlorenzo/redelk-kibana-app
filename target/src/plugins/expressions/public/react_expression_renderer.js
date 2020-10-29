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
exports.ReactExpressionRenderer = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const operators_1 = require("rxjs/operators");
const useShallowCompareEffect_1 = tslib_1.__importDefault(require("react-use/lib/useShallowCompareEffect"));
const eui_1 = require("@elastic/eui");
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const loader_1 = require("./loader");
const defaultState = {
    isEmpty: true,
    isLoading: false,
    error: null,
};
exports.ReactExpressionRenderer = ({ className, dataAttrs, padding, renderError, expression, onEvent, reload$, ...expressionLoaderOptions }) => {
    const mountpoint = react_1.useRef(null);
    const [state, setState] = react_1.useState({ ...defaultState });
    const hasCustomRenderErrorHandler = !!renderError;
    const expressionLoaderRef = react_1.useRef(null);
    // flag to skip next render$ notification,
    // because of just handled error
    const hasHandledErrorRef = react_1.useRef(false);
    // will call done() in LayoutEffect when done with rendering custom error state
    const errorRenderHandlerRef = react_1.useRef(null);
    /* eslint-disable react-hooks/exhaustive-deps */
    // OK to ignore react-hooks/exhaustive-deps because options update is handled by calling .update()
    react_1.useEffect(() => {
        const subs = [];
        expressionLoaderRef.current = new loader_1.ExpressionLoader(mountpoint.current, expression, {
            ...expressionLoaderOptions,
            // react component wrapper provides different
            // error handling api which is easier to work with from react
            // if custom renderError is not provided then we fallback to default error handling from ExpressionLoader
            onRenderError: hasCustomRenderErrorHandler
                ? (domNode, error, handlers) => {
                    errorRenderHandlerRef.current = handlers;
                    setState(() => ({
                        ...defaultState,
                        isEmpty: false,
                        error,
                    }));
                    if (expressionLoaderOptions.onRenderError) {
                        expressionLoaderOptions.onRenderError(domNode, error, handlers);
                    }
                }
                : expressionLoaderOptions.onRenderError,
        });
        if (onEvent) {
            subs.push(expressionLoaderRef.current.events$.subscribe((event) => {
                onEvent(event);
            }));
        }
        subs.push(expressionLoaderRef.current.loading$.subscribe(() => {
            hasHandledErrorRef.current = false;
            setState((prevState) => ({ ...prevState, isLoading: true }));
        }), expressionLoaderRef.current.render$
            .pipe(operators_1.filter(() => !hasHandledErrorRef.current))
            .subscribe((item) => {
            setState(() => ({
                ...defaultState,
                isEmpty: false,
            }));
        }));
        return () => {
            subs.forEach((s) => s.unsubscribe());
            if (expressionLoaderRef.current) {
                expressionLoaderRef.current.destroy();
                expressionLoaderRef.current = null;
            }
            errorRenderHandlerRef.current = null;
        };
    }, [hasCustomRenderErrorHandler, onEvent]);
    react_1.useEffect(() => {
        const subscription = reload$?.subscribe(() => {
            if (expressionLoaderRef.current) {
                expressionLoaderRef.current.update(expression, expressionLoaderOptions);
            }
        });
        return () => subscription?.unsubscribe();
    }, [reload$, expression, ...Object.values(expressionLoaderOptions)]);
    // Re-fetch data automatically when the inputs change
    useShallowCompareEffect_1.default(() => {
        if (expressionLoaderRef.current) {
            expressionLoaderRef.current.update(expression, expressionLoaderOptions);
        }
    }, 
    // when expression is changed by reference and when any other loaderOption is changed by reference
    [{ expression, ...expressionLoaderOptions }]);
    /* eslint-enable react-hooks/exhaustive-deps */
    // call expression loader's done() handler when finished rendering custom error state
    react_1.useLayoutEffect(() => {
        if (state.error && errorRenderHandlerRef.current) {
            hasHandledErrorRef.current = true;
            errorRenderHandlerRef.current.done();
            errorRenderHandlerRef.current = null;
        }
    }, [state.error]);
    const classes = classnames_1.default('expExpressionRenderer', {
        'expExpressionRenderer-isEmpty': state.isEmpty,
        'expExpressionRenderer-hasError': !!state.error,
        className,
    });
    const expressionStyles = {};
    if (padding) {
        expressionStyles.padding = eui_theme_light_json_1.default.paddingSizes[padding];
    }
    return (react_1.default.createElement("div", Object.assign({}, dataAttrs, { className: classes }),
        state.isEmpty && react_1.default.createElement(eui_1.EuiLoadingChart, { mono: true, size: "l" }),
        state.isLoading && react_1.default.createElement(eui_1.EuiProgress, { size: "xs", color: "accent", position: "absolute" }),
        !state.isLoading && state.error && renderError && renderError(state.error.message),
        react_1.default.createElement("div", { className: "expExpressionRenderer__expression", style: expressionStyles, ref: mountpoint })));
};
