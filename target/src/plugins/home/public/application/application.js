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
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../kibana_react/public");
// @ts-ignore
const home_app_1 = require("./components/home_app");
const kibana_services_1 = require("./kibana_services");
require("./index.scss");
exports.renderApp = async (element, coreStart, history) => {
    const homeTitle = i18n_1.i18n.translate('home.breadcrumbs.homeTitle', { defaultMessage: 'Home' });
    const { featureCatalogue, chrome } = kibana_services_1.getServices();
    // all the directories could be get in "start" phase of plugin after all of the legacy plugins will be moved to a NP
    const directories = featureCatalogue.get();
    chrome.setBreadcrumbs([{ text: homeTitle }]);
    // dispatch synthetic hash change event to update hash history objects
    // this is necessary because hash updates triggered by using popState won't trigger this event naturally.
    // This must be called before the app is mounted to avoid call this after the redirect to default app logic kicks in
    const unlisten = history.listen((location) => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    react_dom_1.render(react_1.default.createElement(public_1.KibanaContextProvider, { services: { ...coreStart } },
        react_1.default.createElement(home_app_1.HomeApp, { directories: directories })), element);
    return () => {
        react_dom_1.unmountComponentAtNode(element);
        unlisten();
    };
};
