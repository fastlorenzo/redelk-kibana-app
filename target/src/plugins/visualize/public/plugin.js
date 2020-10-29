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
exports.VisualizePlugin = void 0;
const rxjs_1 = require("rxjs");
const i18n_1 = require("@kbn/i18n");
const operators_1 = require("rxjs/operators");
const history_1 = require("history");
const public_1 = require("../../kibana_utils/public");
const public_2 = require("../../data/public");
const visualize_constants_1 = require("./application/visualize_constants");
const public_3 = require("../../home/public");
const public_4 = require("../../../core/public");
class VisualizePlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.appStateUpdater = new rxjs_1.BehaviorSubject(() => ({}));
        this.stopUrlTracking = undefined;
        this.currentHistory = undefined;
    }
    async setup(core, { home, kibanaLegacy, data }) {
        const { appMounted, appUnMounted, stop: stopUrlTracker, setActiveUrl, restorePreviousUrl, } = public_1.createKbnUrlTracker({
            baseUrl: core.http.basePath.prepend('/app/visualize'),
            defaultSubUrl: '#/',
            storageKey: `lastUrl:${core.http.basePath.get()}:visualize`,
            navLinkUpdater$: this.appStateUpdater,
            toastNotifications: core.notifications.toasts,
            stateParams: [
                {
                    kbnUrlKey: '_g',
                    stateUpdate$: data.query.state$.pipe(operators_1.filter(({ changes }) => !!(changes.globalFilters || changes.time || changes.refreshInterval)), operators_1.map(({ state }) => ({
                        ...state,
                        filters: state.filters?.filter(public_2.esFilters.isFilterPinned),
                    }))),
                },
            ],
            getHistory: () => this.currentHistory,
        });
        this.stopUrlTracking = () => {
            stopUrlTracker();
        };
        core.application.register({
            id: 'visualize',
            title: 'Visualize',
            order: 8002,
            euiIconType: 'visualizeApp',
            defaultPath: '#/',
            category: public_4.DEFAULT_APP_CATEGORIES.kibana,
            updater$: this.appStateUpdater.asObservable(),
            // remove all references to visualize
            mount: async (params) => {
                const [coreStart, pluginsStart] = await core.getStartServices();
                this.currentHistory = params.history;
                // make sure the index pattern list is up to date
                pluginsStart.data.indexPatterns.clearCache();
                // make sure a default index pattern exists
                // if not, the page will be redirected to management and visualize won't be rendered
                await pluginsStart.data.indexPatterns.ensureDefaultIndexPattern();
                appMounted();
                // dispatch synthetic hash change event to update hash history objects
                // this is necessary because hash updates triggered by using popState won't trigger this event naturally.
                const unlistenParentHistory = params.history.listen(() => {
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                });
                /**
                 * current implementation uses 2 history objects:
                 * 1. the hash history (used for the react hash router)
                 * 2. and the scoped history (used for url tracking)
                 * this should be replaced to use only scoped history after moving legacy apps to browser routing
                 */
                const history = history_1.createHashHistory();
                const services = {
                    ...coreStart,
                    history,
                    kbnUrlStateStorage: public_1.createKbnUrlStateStorage({
                        history,
                        useHash: coreStart.uiSettings.get('state:storeInSessionStorage'),
                    }),
                    kibanaLegacy: pluginsStart.kibanaLegacy,
                    pluginInitializerContext: this.initializerContext,
                    chrome: coreStart.chrome,
                    data: pluginsStart.data,
                    localStorage: new public_1.Storage(localStorage),
                    navigation: pluginsStart.navigation,
                    savedVisualizations: pluginsStart.visualizations.savedVisualizationsLoader,
                    share: pluginsStart.share,
                    toastNotifications: coreStart.notifications.toasts,
                    visualizeCapabilities: coreStart.application.capabilities.visualize,
                    visualizations: pluginsStart.visualizations,
                    embeddable: pluginsStart.embeddable,
                    setActiveUrl,
                    createVisEmbeddableFromObject: pluginsStart.visualizations.__LEGACY.createVisEmbeddableFromObject,
                    savedObjectsPublic: pluginsStart.savedObjects,
                    scopedHistory: params.history,
                    restorePreviousUrl,
                    featureFlagConfig: this.initializerContext.config.get(),
                };
                params.element.classList.add('visAppWrapper');
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application')));
                const unmount = renderApp(params, services);
                return () => {
                    unlistenParentHistory();
                    unmount();
                    appUnMounted();
                };
            },
        });
        kibanaLegacy.forwardApp('visualize', 'visualize');
        if (home) {
            home.featureCatalogue.register({
                id: 'visualize',
                title: 'Visualize',
                description: i18n_1.i18n.translate('visualize.visualizeDescription', {
                    defaultMessage: 'Create visualizations and aggregate data stores in your Elasticsearch indices.',
                }),
                icon: 'visualizeApp',
                path: `/app/visualize#${visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH}`,
                showOnHomePage: true,
                category: public_3.FeatureCatalogueCategory.DATA,
            });
        }
    }
    start(core, plugins) { }
    stop() {
        if (this.stopUrlTracking) {
            this.stopUrlTracking();
        }
    }
}
exports.VisualizePlugin = VisualizePlugin;
