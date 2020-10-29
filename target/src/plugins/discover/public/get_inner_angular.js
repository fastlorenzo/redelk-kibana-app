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
exports.initializeInnerAngularModule = exports.getInnerAngularModuleEmbeddable = exports.getInnerAngularModule = void 0;
const tslib_1 = require("tslib");
// inner angular imports
// these are necessary to bootstrap the local angular.
// They can stay even after NP cutover
require("./application/index.scss");
const angular_1 = tslib_1.__importDefault(require("angular"));
// required for `ngSanitize` angular module
require("angular-sanitize");
const eui_1 = require("@elastic/eui");
const angular_2 = require("@kbn/i18n/angular");
const public_1 = require("../../kibana_utils/public");
const doc_table_1 = require("./application/angular/doc_table");
const table_header_1 = require("./application/angular/doc_table/components/table_header");
const pager_1 = require("./application/angular/doc_table/components/pager");
const table_row_1 = require("./application/angular/doc_table/components/table_row");
const pager_factory_1 = require("./application/angular/doc_table/lib/pager/pager_factory");
const infinite_scroll_1 = require("./application/angular/doc_table/infinite_scroll");
const doc_viewer_1 = require("./application/angular/doc_viewer");
const collapsible_sidebar_1 = require("./application/angular/directives/collapsible_sidebar/collapsible_sidebar");
// @ts-ignore
const fixed_scroll_1 = require("./application/angular/directives/fixed_scroll");
// @ts-ignore
const debounce_1 = require("./application/angular/directives/debounce/debounce");
const render_complete_1 = require("./application/angular/directives/render_complete");
const public_2 = require("../../kibana_legacy/public");
const sidebar_1 = require("./application/components/sidebar");
const hits_counter_1 = require("././application/components/hits_counter");
const loading_spinner_1 = require("././application/components/loading_spinner/loading_spinner");
const timechart_header_1 = require("./application/components/timechart_header");
const context_error_message_1 = require("./application/components/context_error_message");
const kibana_services_1 = require("./kibana_services");
const skip_bottom_button_1 = require("./application/components/skip_bottom_button");
/**
 * returns the main inner angular module, it contains all the parts of Angular Discover
 * needs to render, so in the end the current 'kibana' angular module is no longer necessary
 */
function getInnerAngularModule(name, core, deps, context) {
    public_2.initAngularBootstrap();
    const module = initializeInnerAngularModule(name, core, deps.navigation, deps.data);
    public_2.configureAppAngularModule(module, { core, env: context.env }, true, kibana_services_1.getScopedHistory);
    return module;
}
exports.getInnerAngularModule = getInnerAngularModule;
/**
 * returns a slimmer inner angular module for embeddable rendering
 */
function getInnerAngularModuleEmbeddable(name, core, deps, context) {
    const module = initializeInnerAngularModule(name, core, deps.navigation, deps.data, true);
    return module;
}
exports.getInnerAngularModuleEmbeddable = getInnerAngularModuleEmbeddable;
let initialized = false;
function initializeInnerAngularModule(name = 'app/discover', core, navigation, data, embeddable = false) {
    if (!initialized) {
        createLocalI18nModule();
        createLocalPrivateModule();
        createLocalPromiseModule();
        createLocalTopNavModule(navigation);
        createLocalStorageModule();
        createElasticSearchModule(data);
        createPagerFactoryModule();
        createDocTableModule();
        initialized = true;
    }
    if (embeddable) {
        return angular_1.default
            .module(name, [
            'ngSanitize',
            'react',
            'ui.bootstrap',
            'discoverI18n',
            'discoverPrivate',
            'discoverDocTable',
            'discoverPagerFactory',
            'discoverPromise',
        ])
            .config(public_2.watchMultiDecorator)
            .directive('icon', (reactDirective) => reactDirective(eui_1.EuiIcon))
            .directive('renderComplete', render_complete_1.createRenderCompleteDirective)
            .service('debounce', ['$timeout', debounce_1.DebounceProviderTimeout]);
    }
    return angular_1.default
        .module(name, [
        'ngSanitize',
        'ngRoute',
        'react',
        'ui.bootstrap',
        'discoverI18n',
        'discoverPrivate',
        'discoverPromise',
        'discoverTopNav',
        'discoverLocalStorageProvider',
        'discoverEs',
        'discoverDocTable',
        'discoverPagerFactory',
    ])
        .config(public_2.watchMultiDecorator)
        .run(public_2.registerListenEventListener)
        .directive('icon', (reactDirective) => reactDirective(eui_1.EuiIcon))
        .directive('kbnAccessibleClick', public_2.KbnAccessibleClickProvider)
        .directive('collapsibleSidebar', collapsible_sidebar_1.CollapsibleSidebarProvider)
        .directive('fixedScroll', fixed_scroll_1.FixedScrollProvider)
        .directive('renderComplete', render_complete_1.createRenderCompleteDirective)
        .directive('discoverSidebar', sidebar_1.createDiscoverSidebarDirective)
        .directive('skipBottomButton', skip_bottom_button_1.createSkipBottomButtonDirective)
        .directive('hitsCounter', hits_counter_1.createHitsCounterDirective)
        .directive('loadingSpinner', loading_spinner_1.createLoadingSpinnerDirective)
        .directive('timechartHeader', timechart_header_1.createTimechartHeaderDirective)
        .directive('contextErrorMessage', context_error_message_1.createContextErrorMessageDirective)
        .service('debounce', ['$timeout', debounce_1.DebounceProviderTimeout]);
}
exports.initializeInnerAngularModule = initializeInnerAngularModule;
function createLocalPromiseModule() {
    angular_1.default.module('discoverPromise', []).service('Promise', public_2.PromiseServiceCreator);
}
function createLocalPrivateModule() {
    angular_1.default.module('discoverPrivate', []).provider('Private', public_2.PrivateProvider);
}
function createLocalTopNavModule(navigation) {
    angular_1.default
        .module('discoverTopNav', ['react'])
        .directive('kbnTopNav', public_2.createTopNavDirective)
        .directive('kbnTopNavHelper', public_2.createTopNavHelper(navigation.ui));
}
function createLocalI18nModule() {
    angular_1.default
        .module('discoverI18n', [])
        .provider('i18n', angular_2.I18nProvider)
        .filter('i18n', angular_2.i18nFilter)
        .directive('i18nId', angular_2.i18nDirective);
}
function createLocalStorageModule() {
    angular_1.default
        .module('discoverLocalStorageProvider', ['discoverPrivate'])
        .service('localStorage', createLocalStorageService('localStorage'))
        .service('sessionStorage', createLocalStorageService('sessionStorage'));
}
const createLocalStorageService = function (type) {
    return function ($window) {
        return new public_1.Storage($window[type]);
    };
};
function createElasticSearchModule(data) {
    angular_1.default
        .module('discoverEs', [])
        // Elasticsearch client used for requesting data.  Connects to the /elasticsearch proxy
        // have to be written as function expression, because it's not compiled in dev mode
        .service('es', function () {
        return data.search.__LEGACY.esClient;
    });
}
function createPagerFactoryModule() {
    angular_1.default.module('discoverPagerFactory', []).factory('pagerFactory', pager_factory_1.createPagerFactory);
}
function createDocTableModule() {
    angular_1.default
        .module('discoverDocTable', ['discoverPagerFactory', 'react'])
        .directive('docTable', doc_table_1.createDocTableDirective)
        .directive('kbnTableHeader', table_header_1.createTableHeaderDirective)
        .directive('toolBarPagerText', pager_1.createToolBarPagerTextDirective)
        .directive('kbnTableRow', table_row_1.createTableRowDirective)
        .directive('toolBarPagerButtons', pager_1.createToolBarPagerButtonsDirective)
        .directive('kbnInfiniteScroll', infinite_scroll_1.createInfiniteScrollDirective)
        .directive('docViewer', doc_viewer_1.createDocViewerDirective);
}
