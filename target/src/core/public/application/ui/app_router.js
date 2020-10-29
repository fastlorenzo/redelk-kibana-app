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
exports.AppRouter = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useObservable_1 = tslib_1.__importDefault(require("react-use/lib/useObservable"));
const types_1 = require("../types");
const app_container_1 = require("./app_container");
const scoped_history_1 = require("../scoped_history");
exports.AppRouter = ({ history, mounters, setAppLeaveHandler, appStatuses$, setIsMounting, }) => {
    const appStatuses = useObservable_1.default(appStatuses$, new Map());
    const createScopedHistory = react_1.useMemo(() => (appPath) => new scoped_history_1.ScopedHistory(history, appPath), [history]);
    return (react_1.default.createElement(react_router_dom_1.Router, { history: history },
        react_1.default.createElement(react_router_dom_1.Switch, null,
            [...mounters]
                // legacy apps can have multiple sub-apps registered with the same route
                // which needs additional logic that is handled in the catch-all route below
                .filter(([_, mounter]) => !mounter.legacy)
                .map(([appId, mounter]) => (react_1.default.createElement(react_router_dom_1.Route, { key: mounter.appRoute, path: mounter.appRoute, exact: mounter.exactRoute, render: ({ match: { url } }) => (react_1.default.createElement(app_container_1.AppContainer, Object.assign({ appPath: url, appStatus: appStatuses.get(appId) ?? types_1.AppStatus.inaccessible, createScopedHistory: createScopedHistory }, { appId, mounter, setAppLeaveHandler, setIsMounting }))) }))),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/app/:appId", render: ({ match: { params: { appId }, url, }, }) => {
                    // Find the mounter including legacy mounters with subapps:
                    const [id, mounter] = mounters.has(appId)
                        ? [appId, mounters.get(appId)]
                        : [...mounters].filter(([key]) => key.split(':')[0] === appId)[0] ?? [];
                    return (react_1.default.createElement(app_container_1.AppContainer, Object.assign({ appPath: url, appId: id, appStatus: appStatuses.get(id) ?? types_1.AppStatus.inaccessible, createScopedHistory: createScopedHistory }, { mounter, setAppLeaveHandler, setIsMounting })));
                } }))));
};
