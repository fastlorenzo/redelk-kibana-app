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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePublicPlugin = void 0;
const i18n_1 = require("@kbn/i18n");
const operators_1 = require("rxjs/operators");
const services_1 = require("./services");
const kibana_services_1 = require("./application/kibana_services");
const public_1 = require("../../../core/public");
class HomePublicPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.featuresCatalogueRegistry = new services_1.FeatureCatalogueRegistry();
        this.environmentService = new services_1.EnvironmentService();
        this.tutorialService = new services_1.TutorialService();
    }
    setup(core, { kibanaLegacy, usageCollection }) {
        core.application.register({
            id: 'home',
            title: 'Home',
            navLinkStatus: public_1.AppNavLinkStatus.hidden,
            mount: async (params) => {
                const trackUiMetric = usageCollection
                    ? usageCollection.reportUiStats.bind(usageCollection, 'Kibana_home')
                    : () => { };
                const [coreStart, { telemetry, data, kibanaLegacy: kibanaLegacyStart },] = await core.getStartServices();
                kibana_services_1.setServices({
                    trackUiMetric,
                    kibanaVersion: this.initializerContext.env.packageInfo.version,
                    http: coreStart.http,
                    toastNotifications: core.notifications.toasts,
                    banners: coreStart.overlays.banners,
                    docLinks: coreStart.docLinks,
                    savedObjectsClient: coreStart.savedObjects.client,
                    chrome: coreStart.chrome,
                    application: coreStart.application,
                    telemetry,
                    uiSettings: core.uiSettings,
                    addBasePath: core.http.basePath.prepend,
                    getBasePath: core.http.basePath.get,
                    indexPatternService: data.indexPatterns,
                    environmentService: this.environmentService,
                    kibanaLegacy: kibanaLegacyStart,
                    homeConfig: this.initializerContext.config.get(),
                    tutorialService: this.tutorialService,
                    featureCatalogue: this.featuresCatalogueRegistry,
                });
                coreStart.chrome.docTitle.change(i18n_1.i18n.translate('home.pageTitle', { defaultMessage: 'Home' }));
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application')));
                return await renderApp(params.element, coreStart, params.history);
            },
        });
        kibanaLegacy.forwardApp('home', 'home');
        return {
            featureCatalogue: { ...this.featuresCatalogueRegistry.setup() },
            environment: { ...this.environmentService.setup() },
            tutorials: { ...this.tutorialService.setup() },
        };
    }
    start({ application: { capabilities, currentAppId$ }, http }, { kibanaLegacy }) {
        this.featuresCatalogueRegistry.start({ capabilities });
        // If the home app is the initial location when loading Kibana...
        if (window.location.pathname === http.basePath.prepend(`/app/home`) &&
            window.location.hash === '') {
            // ...wait for the app to mount initially and then...
            currentAppId$.pipe(operators_1.first()).subscribe((appId) => {
                if (appId === 'home') {
                    // ...navigate to default app set by `kibana.defaultAppId`.
                    // This doesn't do anything as along as the default settings are kept.
                    kibanaLegacy.navigateToDefaultApp({ overwriteHash: false });
                }
            });
        }
    }
}
exports.HomePublicPlugin = HomePublicPlugin;
