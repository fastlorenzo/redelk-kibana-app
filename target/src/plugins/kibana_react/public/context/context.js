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
exports.KibanaContextProvider = exports.createKibanaReactContext = exports.UseKibana = exports.withKibana = exports.useKibana = exports.context = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const overlays_1 = require("../overlays");
const notifications_1 = require("../notifications");
const { useMemo, useContext, createElement, createContext } = React;
const defaultContextValue = {
    services: {},
    overlays: overlays_1.createReactOverlays({}),
    notifications: notifications_1.createNotifications({}),
};
exports.context = createContext(defaultContextValue);
exports.useKibana = () => useContext(exports.context);
exports.withKibana = (type) => {
    const EnhancedType = (props) => {
        const kibana = exports.useKibana();
        return React.createElement(type, { ...props, kibana });
    };
    return EnhancedType;
};
exports.UseKibana = ({ children }) => React.createElement(React.Fragment, null, children(exports.useKibana()));
exports.createKibanaReactContext = (services) => {
    const value = {
        services,
        overlays: overlays_1.createReactOverlays(services),
        notifications: notifications_1.createNotifications(services),
    };
    const Provider = ({ services: newServices = {}, children, }) => {
        const oldValue = exports.useKibana();
        const { value: newValue } = useMemo(() => exports.createKibanaReactContext({ ...services, ...oldValue.services, ...newServices }), [services, oldValue, newServices]);
        return createElement(exports.context.Provider, {
            value: newValue,
            children,
        });
    };
    return {
        value,
        Provider,
        Consumer: exports.context.Consumer,
    };
};
exports.KibanaContextProvider = exports.createKibanaReactContext({}).Provider;
