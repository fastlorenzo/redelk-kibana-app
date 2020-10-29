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
require("./index.scss");
const angular_1 = tslib_1.__importDefault(require("angular"));
const kibana_services_1 = require("../kibana_services");
/**
 * Here's where Discover's inner angular is mounted and rendered
 */
async function renderApp(moduleName, element) {
    // do not wait for fontawesome
    kibana_services_1.getServices().kibanaLegacy.loadFontAwesome();
    await Promise.resolve().then(() => tslib_1.__importStar(require('./angular')));
    const $injector = mountDiscoverApp(moduleName, element);
    return () => $injector.get('$rootScope').$destroy();
}
exports.renderApp = renderApp;
function mountDiscoverApp(moduleName, element) {
    const mountpoint = document.createElement('div');
    const appWrapper = document.createElement('div');
    appWrapper.setAttribute('ng-view', '');
    mountpoint.appendChild(appWrapper);
    // bootstrap angular into detached element and attach it later to
    // make angular-within-angular possible
    const $injector = angular_1.default.bootstrap(mountpoint, [moduleName]);
    element.appendChild(mountpoint);
    return $injector;
}
