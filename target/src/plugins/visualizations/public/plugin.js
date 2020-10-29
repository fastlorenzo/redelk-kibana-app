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
exports.VisualizationsPlugin = void 0;
require("./index.scss");
const vis_types_1 = require("./vis_types");
const services_1 = require("./services");
const embeddable_1 = require("./embeddable");
const visualization_function_1 = require("./expressions/visualization_function");
const visualization_renderer_1 = require("./expressions/visualization_renderer");
const range_1 = require("./expression_functions/range");
const vis_dimension_1 = require("./expression_functions/vis_dimension");
const public_1 = require("../../kibana_utils/public");
const saved_visualizations_1 = require("./saved_visualizations");
const vis_1 = require("./vis");
const wizard_1 = require("./wizard");
const _saved_vis_1 = require("./saved_visualizations/_saved_vis");
const public_2 = require("../../discover/public");
/**
 * Visualizations Plugin - public
 *
 * This plugin's stateful contracts are returned from the `setup` and `start` methods
 * below. The interfaces for these contracts are provided above.
 *
 * @internal
 */
class VisualizationsPlugin {
    constructor(initializerContext) {
        this.types = new vis_types_1.TypesService();
    }
    setup(core, { expressions, embeddable, usageCollection, data }) {
        const start = (this.getStartServicesOrDie = public_1.createStartServicesGetter(core.getStartServices));
        services_1.setUISettings(core.uiSettings);
        services_1.setUsageCollector(usageCollection);
        expressions.registerFunction(visualization_function_1.visualization);
        expressions.registerRenderer(visualization_renderer_1.visualization);
        expressions.registerFunction(range_1.range);
        expressions.registerFunction(vis_dimension_1.visDimension);
        const embeddableFactory = new embeddable_1.VisualizeEmbeddableFactory({ start });
        embeddable.registerEmbeddableFactory(embeddable_1.VISUALIZE_EMBEDDABLE_TYPE, embeddableFactory);
        return {
            ...this.types.setup(),
        };
    }
    start(core, { data, expressions, uiActions, embeddable }) {
        const types = this.types.start();
        services_1.setI18n(core.i18n);
        services_1.setTypes(types);
        services_1.setEmbeddable(embeddable);
        services_1.setApplication(core.application);
        services_1.setCapabilities(core.application.capabilities);
        services_1.setHttp(core.http);
        services_1.setSavedObjects(core.savedObjects);
        services_1.setIndexPatterns(data.indexPatterns);
        services_1.setSearch(data.search);
        services_1.setFilterManager(data.query.filterManager);
        services_1.setExpressions(expressions);
        services_1.setUiActions(uiActions);
        services_1.setTimeFilter(data.query.timefilter.timefilter);
        services_1.setAggs(data.search.aggs);
        services_1.setOverlays(core.overlays);
        services_1.setChrome(core.chrome);
        const savedVisualizationsLoader = saved_visualizations_1.createSavedVisLoader({
            savedObjectsClient: core.savedObjects.client,
            indexPatterns: data.indexPatterns,
            search: data.search,
            chrome: core.chrome,
            overlays: core.overlays,
            visualizationTypes: types,
        });
        services_1.setSavedVisualizationsLoader(savedVisualizationsLoader);
        const savedSearchLoader = public_2.createSavedSearchesLoader({
            savedObjectsClient: core.savedObjects.client,
            indexPatterns: data.indexPatterns,
            search: data.search,
            chrome: core.chrome,
            overlays: core.overlays,
        });
        services_1.setSavedSearchLoader(savedSearchLoader);
        return {
            ...types,
            showNewVisModal: wizard_1.showNewVisModal,
            /**
             * creates new instance of Vis
             * @param {IIndexPattern} indexPattern - index pattern to use
             * @param {VisState} visState - visualization configuration
             */
            createVis: async (visType, visState) => {
                const vis = new vis_1.Vis(visType);
                await vis.setState(visState);
                return vis;
            },
            convertToSerializedVis: _saved_vis_1.convertToSerializedVis,
            convertFromSerializedVis: _saved_vis_1.convertFromSerializedVis,
            savedVisualizationsLoader,
            __LEGACY: {
                createVisEmbeddableFromObject: embeddable_1.createVisEmbeddableFromObject({
                    start: this.getStartServicesOrDie,
                }),
            },
        };
    }
    stop() {
        this.types.stop();
    }
}
exports.VisualizationsPlugin = VisualizationsPlugin;
