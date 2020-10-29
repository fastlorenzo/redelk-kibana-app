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
exports.DiscoverPlugin = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const angular_1 = tslib_1.__importDefault(require("angular"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const public_1 = require("../../data/public");
const public_2 = require("../../kibana_utils/public");
const public_3 = require("../../../core/public");
const doc_views_registry_1 = require("./application/doc_views/doc_views_registry");
const table_1 = require("./application/components/table/table");
const json_code_block_1 = require("./application/components/json_code_block/json_code_block");
const kibana_services_1 = require("./kibana_services");
const saved_searches_1 = require("./saved_searches");
const register_feature_1 = require("./register_feature");
const build_services_1 = require("./build_services");
const url_generator_1 = require("./url_generator");
const embeddable_1 = require("./application/embeddable");
const innerAngularName = 'app/discover';
const embeddableAngularName = 'app/discoverEmbeddable';
/**
 * Contains Discover, one of the oldest parts of Kibana
 * There are 2 kinds of Angular bootstrapped for rendering, additionally to the main Angular
 * Discover provides embeddables, those contain a slimmer Angular
 */
class DiscoverPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.appStateUpdater = new rxjs_1.BehaviorSubject(() => ({}));
        this.docViewsRegistry = null;
        this.embeddableInjector = null;
        this.stopUrlTracking = undefined;
        this.servicesInitialized = false;
        this.innerAngularInitialized = false;
        this.getEmbeddableInjector = async () => {
            if (!this.embeddableInjector) {
                if (!this.initializeServices) {
                    throw Error('Discover plugin getEmbeddableInjector:  initializeServices is undefined');
                }
                const { core, plugins } = await this.initializeServices();
                kibana_services_1.getServices().kibanaLegacy.loadFontAwesome();
                const { getInnerAngularModuleEmbeddable } = await Promise.resolve().then(() => tslib_1.__importStar(require('./get_inner_angular')));
                getInnerAngularModuleEmbeddable(embeddableAngularName, core, plugins, this.initializerContext);
                const mountpoint = document.createElement('div');
                this.embeddableInjector = angular_1.default.bootstrap(mountpoint, [embeddableAngularName]);
            }
            return this.embeddableInjector;
        };
    }
    setup(core, plugins) {
        const baseUrl = core.http.basePath.prepend('/app/discover');
        if (plugins.share) {
            this.urlGenerator = plugins.share.urlGenerators.registerUrlGenerator(new url_generator_1.DiscoverUrlGenerator({
                appBasePath: baseUrl,
                useHash: core.uiSettings.get('state:storeInSessionStorage'),
            }));
        }
        this.docViewsRegistry = new doc_views_registry_1.DocViewsRegistry();
        kibana_services_1.setDocViewsRegistry(this.docViewsRegistry);
        this.docViewsRegistry.addDocView({
            title: i18n_1.i18n.translate('discover.docViews.table.tableTitle', {
                defaultMessage: 'Table',
            }),
            order: 10,
            component: table_1.DocViewTable,
        });
        this.docViewsRegistry.addDocView({
            title: i18n_1.i18n.translate('discover.docViews.json.jsonTitle', {
                defaultMessage: 'JSON',
            }),
            order: 20,
            component: json_code_block_1.JsonCodeBlock,
        });
        const { appMounted, appUnMounted, stop: stopUrlTracker, setActiveUrl: setTrackedUrl, restorePreviousUrl, } = public_2.createKbnUrlTracker({
            // we pass getter here instead of plain `history`,
            // so history is lazily created (when app is mounted)
            // this prevents redundant `#` when not in discover app
            getHistory: kibana_services_1.getScopedHistory,
            baseUrl,
            defaultSubUrl: '#/',
            storageKey: `lastUrl:${core.http.basePath.get()}:discover`,
            navLinkUpdater$: this.appStateUpdater,
            toastNotifications: core.notifications.toasts,
            stateParams: [
                {
                    kbnUrlKey: '_g',
                    stateUpdate$: plugins.data.query.state$.pipe(operators_1.filter(({ changes }) => !!(changes.globalFilters || changes.time || changes.refreshInterval)), operators_1.map(({ state }) => ({
                        ...state,
                        filters: state.filters?.filter(public_1.esFilters.isFilterPinned),
                    }))),
                },
            ],
        });
        kibana_services_1.setUrlTracker({ setTrackedUrl, restorePreviousUrl });
        this.stopUrlTracking = () => {
            stopUrlTracker();
        };
        this.docViewsRegistry.setAngularInjectorGetter(this.getEmbeddableInjector);
        core.application.register({
            id: 'discover',
            title: 'Discover',
            updater$: this.appStateUpdater.asObservable(),
            order: -1004,
            euiIconType: 'discoverApp',
            defaultPath: '#/',
            category: public_3.DEFAULT_APP_CATEGORIES.kibana,
            mount: async (params) => {
                if (!this.initializeServices) {
                    throw Error('Discover plugin method initializeServices is undefined');
                }
                if (!this.initializeInnerAngular) {
                    throw Error('Discover plugin method initializeInnerAngular is undefined');
                }
                kibana_services_1.setScopedHistory(params.history);
                kibana_services_1.syncHistoryLocations();
                appMounted();
                const { plugins: { data: dataStart }, } = await this.initializeServices();
                await this.initializeInnerAngular();
                // make sure the index pattern list is up to date
                await dataStart.indexPatterns.clearCache();
                const { renderApp } = await Promise.resolve().then(() => tslib_1.__importStar(require('./application/application')));
                params.element.classList.add('dscAppWrapper');
                const unmount = await renderApp(innerAngularName, params.element);
                return () => {
                    unmount();
                    appUnMounted();
                };
            },
        });
        plugins.kibanaLegacy.forwardApp('doc', 'discover', (path) => {
            return `#${path}`;
        });
        plugins.kibanaLegacy.forwardApp('context', 'discover', (path) => {
            return `#${path}`;
        });
        plugins.kibanaLegacy.forwardApp('discover', 'discover', (path) => {
            const [, id, tail] = /discover\/([^\?]+)(.*)/.exec(path) || [];
            if (!id) {
                return `#${path.replace('/discover', '') || '/'}`;
            }
            return `#/view/${id}${tail || ''}`;
        });
        if (plugins.home) {
            register_feature_1.registerFeature(plugins.home);
        }
        this.registerEmbeddable(core, plugins);
        return {
            docViews: {
                addDocView: this.docViewsRegistry.addDocView.bind(this.docViewsRegistry),
            },
        };
    }
    start(core, plugins) {
        // we need to register the application service at setup, but to render it
        // there are some start dependencies necessary, for this reason
        // initializeInnerAngular + initializeServices are assigned at start and used
        // when the application/embeddable is mounted
        this.initializeInnerAngular = async () => {
            if (this.innerAngularInitialized) {
                return;
            }
            // this is used by application mount and tests
            const { getInnerAngularModule } = await Promise.resolve().then(() => tslib_1.__importStar(require('./get_inner_angular')));
            const module = getInnerAngularModule(innerAngularName, core, plugins, this.initializerContext);
            kibana_services_1.setAngularModule(module);
            this.innerAngularInitialized = true;
        };
        this.initializeServices = async () => {
            if (this.servicesInitialized) {
                return { core, plugins };
            }
            const services = await build_services_1.buildServices(core, plugins, this.initializerContext);
            kibana_services_1.setServices(services);
            this.servicesInitialized = true;
            return { core, plugins };
        };
        return {
            urlGenerator: this.urlGenerator,
            savedSearchLoader: saved_searches_1.createSavedSearchesLoader({
                savedObjectsClient: core.savedObjects.client,
                indexPatterns: plugins.data.indexPatterns,
                search: plugins.data.search,
                chrome: core.chrome,
                overlays: core.overlays,
            }),
        };
    }
    stop() {
        if (this.stopUrlTracking) {
            this.stopUrlTracking();
        }
    }
    /**
     * register embeddable with a slimmer embeddable version of inner angular
     */
    registerEmbeddable(core, plugins) {
        if (!this.getEmbeddableInjector) {
            throw Error('Discover plugin method getEmbeddableInjector is undefined');
        }
        const getStartServices = async () => {
            const [coreStart, deps] = await core.getStartServices();
            return {
                executeTriggerActions: deps.uiActions.executeTriggerActions,
                isEditable: () => coreStart.application.capabilities.discover.save,
            };
        };
        const factory = new embeddable_1.SearchEmbeddableFactory(getStartServices, this.getEmbeddableInjector);
        plugins.embeddable.registerEmbeddableFactory(factory.type, factory);
    }
}
exports.DiscoverPlugin = DiscoverPlugin;
