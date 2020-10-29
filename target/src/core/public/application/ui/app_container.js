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
exports.AppContainer = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const types_1 = require("../types");
const app_not_found_screen_1 = require("./app_not_found_screen");
require("./app_container.scss");
exports.AppContainer = ({ mounter, appId, appPath, setAppLeaveHandler, createScopedHistory, appStatus, setIsMounting, }) => {
    const [showSpinner, setShowSpinner] = react_1.useState(true);
    const [appNotFound, setAppNotFound] = react_1.useState(false);
    const elementRef = react_1.useRef(null);
    const unmountRef = react_1.useRef(null);
    react_1.useLayoutEffect(() => {
        const unmount = () => {
            if (unmountRef.current) {
                unmountRef.current();
                unmountRef.current = null;
            }
        };
        if (!mounter || appStatus !== types_1.AppStatus.accessible) {
            return setAppNotFound(true);
        }
        setAppNotFound(false);
        setIsMounting(true);
        if (mounter.unmountBeforeMounting) {
            unmount();
        }
        const mount = async () => {
            setShowSpinner(true);
            try {
                unmountRef.current =
                    (await mounter.mount({
                        appBasePath: mounter.appBasePath,
                        history: createScopedHistory(appPath),
                        element: elementRef.current,
                        onAppLeave: (handler) => setAppLeaveHandler(appId, handler),
                    })) || null;
            }
            catch (e) {
                // TODO: add error UI
                // eslint-disable-next-line no-console
                console.error(e);
            }
            finally {
                setShowSpinner(false);
                setIsMounting(false);
            }
        };
        mount();
        return unmount;
    }, [appId, appStatus, mounter, createScopedHistory, setAppLeaveHandler, appPath, setIsMounting]);
    return (react_1.default.createElement(react_1.Fragment, null,
        appNotFound && react_1.default.createElement(app_not_found_screen_1.AppNotFound, null),
        showSpinner && (react_1.default.createElement("div", { className: "appContainer__loading" },
            react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "l" }))),
        react_1.default.createElement("div", { key: appId, ref: elementRef })));
};
