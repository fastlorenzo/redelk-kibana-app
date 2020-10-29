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
exports.renderApp = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const url_overflow_ui_1 = require("./url_overflow_ui");
const ErrorPage = ({ title, children }) => {
    title =
        title ??
            i18n_1.i18n.translate('core.application.appRenderError.defaultTitle', {
                defaultMessage: 'Application error',
            });
    return (react_1.default.createElement(eui_1.EuiPage, { style: { minHeight: '100%' }, "data-test-subj": "appRenderErrorPageContent" },
        react_1.default.createElement(eui_1.EuiPageBody, null,
            react_1.default.createElement(eui_1.EuiPageContent, { verticalPosition: "center", horizontalPosition: "center" },
                react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "alert", iconColor: "danger", title: react_1.default.createElement("h2", null, title), body: children })))));
};
const ErrorApp = ({ basePath, history }) => {
    const [currentLocation, setCurrentLocation] = react_1.useState(history.location);
    react_1.useLayoutEffect(() => {
        return history.listen((location) => setCurrentLocation(location));
    }, [history]);
    const searchParams = new URLSearchParams(currentLocation.search);
    const errorType = searchParams.get('errorType');
    if (errorType === 'urlOverflow') {
        return (react_1.default.createElement(ErrorPage, { title: i18n_1.i18n.translate('core.ui.errorUrlOverflow.errorTitle', {
                defaultMessage: "The URL for this object is too long, and we can't display it",
            }) },
            react_1.default.createElement(url_overflow_ui_1.UrlOverflowUi, { basePath: basePath })));
    }
    return react_1.default.createElement(ErrorPage, null);
};
/**
 * Renders UI for displaying error messages.
 * @internal
 */
exports.renderApp = ({ element, history }, { basePath }) => {
    react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(ErrorApp, { history: history, basePath: basePath })), element);
    return () => {
        react_dom_1.default.unmountComponentAtNode(element);
    };
};
