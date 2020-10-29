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
exports.VisualizeEmbeddable = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importStar(require("lodash"));
const Rx = tslib_1.__importStar(require("rxjs"));
const constants_1 = require("./constants");
const public_1 = require("../../../../plugins/data/public");
const public_2 = require("../../../../plugins/embeddable/public");
const public_3 = require("../../../../plugins/kibana_utils/public");
const build_pipeline_1 = require("../legacy/build_pipeline");
const services_1 = require("../services");
const events_1 = require("./events");
const getKeys = (o) => Object.keys(o);
const visTypesWithoutInspector = ['markdown', 'input_control_vis', 'metrics', 'vega', 'timelion'];
class VisualizeEmbeddable extends public_2.Embeddable {
    constructor(timefilter, { vis, editPath, editUrl, indexPatterns, editable, deps }, initialInput, parent) {
        super(initialInput, {
            defaultTitle: vis.title,
            editPath,
            editApp: 'visualize',
            editUrl,
            indexPatterns,
            editable,
            visTypeName: vis.type.name,
        }, parent);
        this.subscriptions = [];
        this.expression = '';
        this.type = constants_1.VISUALIZE_EMBEDDABLE_TYPE;
        this.getInspectorAdapters = () => {
            if (!this.handler || visTypesWithoutInspector.includes(this.vis.type.name)) {
                return undefined;
            }
            return this.handler.inspect();
        };
        this.openInspector = () => {
            if (!this.handler)
                return;
            const adapters = this.handler.inspect();
            if (!adapters)
                return;
            return this.deps.start().plugins.inspector.open(adapters, {
                title: this.getTitle() || this.title || '',
            });
        };
        // this is a hack to make editor still work, will be removed once we clean up editor
        // @ts-ignore
        this.hasInspector = () => Boolean(this.getInspectorAdapters());
        this.onContainerLoading = () => {
            this.domNode.setAttribute('data-render-complete', 'false');
            this.updateOutput({ loading: true, error: undefined });
        };
        this.onContainerRender = (count) => {
            this.domNode.setAttribute('data-render-complete', 'true');
            this.domNode.setAttribute('data-rendering-count', count.toString());
            this.updateOutput({ loading: false, error: undefined });
            public_3.dispatchRenderComplete(this.domNode);
        };
        this.onContainerError = (error) => {
            if (this.abortController) {
                this.abortController.abort();
            }
            this.domNode.setAttribute('data-rendering-count', this.domNode.getAttribute('data-rendering-count') + 1);
            this.domNode.setAttribute('data-render-complete', 'false');
            this.updateOutput({ loading: false, error });
        };
        this.reload = () => {
            this.handleVisUpdate();
        };
        this.handleVisUpdate = async () => {
            this.updateHandler();
        };
        this.uiStateChangeHandler = () => {
            this.updateInput({
                ...this.vis.uiState.toJSON(),
            });
        };
        this.deps = deps;
        this.timefilter = timefilter;
        this.vis = vis;
        this.vis.uiState.on('change', this.uiStateChangeHandler);
        this.vis.uiState.on('reload', this.reload);
        this.autoRefreshFetchSubscription = timefilter
            .getAutoRefreshFetch$()
            .subscribe(this.updateHandler.bind(this));
        this.subscriptions.push(Rx.merge(this.getOutput$(), this.getInput$()).subscribe(() => {
            this.handleChanges();
        }));
    }
    getVisualizationDescription() {
        return this.vis.description;
    }
    /**
     * Transfers all changes in the containerState.customization into
     * the uiState of this visualization.
     */
    transferCustomizationsToUiState() {
        // Check for changes that need to be forwarded to the uiState
        // Since the vis has an own listener on the uiState we don't need to
        // pass anything from here to the handler.update method
        const visCustomizations = { vis: this.input.vis, table: this.input.table };
        if (visCustomizations.vis || visCustomizations.table) {
            if (!lodash_1.default.isEqual(visCustomizations, this.visCustomizations)) {
                this.visCustomizations = visCustomizations;
                // Turn this off or the uiStateChangeHandler will fire for every modification.
                this.vis.uiState.off('change', this.uiStateChangeHandler);
                this.vis.uiState.clearAllKeys();
                if (visCustomizations.vis) {
                    this.vis.uiState.set('vis', visCustomizations.vis);
                    getKeys(visCustomizations).forEach((key) => {
                        this.vis.uiState.set(key, visCustomizations[key]);
                    });
                }
                if (visCustomizations.table) {
                    this.vis.uiState.set('table', visCustomizations.table);
                }
                this.vis.uiState.on('change', this.uiStateChangeHandler);
            }
        }
        else if (this.parent) {
            this.vis.uiState.clearAllKeys();
        }
    }
    async handleChanges() {
        this.transferCustomizationsToUiState();
        let dirty = false;
        // Check if timerange has changed
        if (!lodash_1.default.isEqual(this.input.timeRange, this.timeRange)) {
            this.timeRange = lodash_1.default.cloneDeep(this.input.timeRange);
            dirty = true;
        }
        // Check if filters has changed
        if (!public_1.esFilters.onlyDisabledFiltersChanged(this.input.filters, this.filters)) {
            this.filters = this.input.filters;
            dirty = true;
        }
        // Check if query has changed
        if (!lodash_1.default.isEqual(this.input.query, this.query)) {
            this.query = this.input.query;
            dirty = true;
        }
        // propagate the title to the output embeddable
        // but only when the visualization is in edit/Visualize mode
        if (!this.parent && this.vis.title !== this.output.title) {
            this.updateOutput({ title: this.vis.title });
        }
        // Keep title depending on the output Embeddable to decouple the
        // visual appearance of the title and the actual title content (useful in Dashboard)
        if (this.output.title !== this.title) {
            this.title = this.output.title;
            if (this.domNode) {
                this.domNode.setAttribute('data-title', this.title || '');
            }
        }
        if (this.vis.description && this.domNode) {
            this.domNode.setAttribute('data-description', this.vis.description);
        }
        if (this.handler && dirty) {
            this.updateHandler();
        }
    }
    /**
     *
     * @param {Element} domNode
     */
    async render(domNode) {
        super.render(domNode);
        this.timeRange = lodash_1.default.cloneDeep(this.input.timeRange);
        this.transferCustomizationsToUiState();
        const div = document.createElement('div');
        div.className = `visualize panel-content panel-content--fullWidth`;
        domNode.appendChild(div);
        this.domNode = div;
        const expressions = services_1.getExpressions();
        this.handler = new expressions.ExpressionLoader(this.domNode, undefined, {
            onRenderError: (element, error) => {
                this.onContainerError(error);
            },
        });
        this.subscriptions.push(this.handler.events$.subscribe(async (event) => {
            // maps hack, remove once esaggs function is cleaned up and ready to accept variables
            if (event.name === 'bounds') {
                const agg = this.vis.data.aggs.aggs.find((a) => {
                    return lodash_1.get(a, 'type.dslName') === 'geohash_grid';
                });
                if ((agg && agg.params.precision !== event.data.precision) ||
                    (agg && !lodash_1.default.isEqual(agg.params.boundingBox, event.data.boundingBox))) {
                    agg.params.boundingBox = event.data.boundingBox;
                    agg.params.precision = event.data.precision;
                    this.reload();
                }
                return;
            }
            if (!this.input.disableTriggers) {
                const triggerId = event.name === 'brush' ? events_1.VIS_EVENT_TO_TRIGGER.brush : events_1.VIS_EVENT_TO_TRIGGER.filter;
                const context = {
                    embeddable: this,
                    data: { timeFieldName: this.vis.data.indexPattern?.timeFieldName, ...event.data },
                };
                services_1.getUiActions().getTrigger(triggerId).exec(context);
            }
        }));
        div.setAttribute('data-title', this.output.title || '');
        if (this.vis.description) {
            div.setAttribute('data-description', this.vis.description);
        }
        div.setAttribute('data-test-subj', 'visualizationLoader');
        div.setAttribute('data-shared-item', '');
        div.setAttribute('data-rendering-count', '0');
        div.setAttribute('data-render-complete', 'false');
        this.subscriptions.push(this.handler.loading$.subscribe(this.onContainerLoading));
        this.subscriptions.push(this.handler.render$.subscribe(this.onContainerRender));
        this.updateHandler();
    }
    destroy() {
        super.destroy();
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.vis.uiState.off('change', this.uiStateChangeHandler);
        this.vis.uiState.off('reload', this.reload);
        if (this.handler) {
            this.handler.destroy();
            this.handler.getElement().remove();
        }
        this.autoRefreshFetchSubscription.unsubscribe();
    }
    async updateHandler() {
        const expressionParams = {
            searchContext: {
                timeRange: this.timeRange,
                query: this.input.query,
                filters: this.input.filters,
            },
            uiState: this.vis.uiState,
        };
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();
        const abortController = this.abortController;
        this.expression = await build_pipeline_1.buildPipeline(this.vis, {
            timefilter: this.timefilter,
            timeRange: this.timeRange,
            abortSignal: this.abortController.signal,
        });
        if (this.handler && !abortController.signal.aborted) {
            this.handler.update(this.expression, expressionParams);
        }
    }
    supportedTriggers() {
        return this.vis.type.getSupportedTriggers?.() ?? [];
    }
}
exports.VisualizeEmbeddable = VisualizeEmbeddable;
