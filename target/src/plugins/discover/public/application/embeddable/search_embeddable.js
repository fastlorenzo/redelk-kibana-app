"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEmbeddable = void 0;
const tslib_1 = require("tslib");
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
require("./search_embeddable.scss");
const angular_1 = tslib_1.__importDefault(require("angular"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const Rx = tslib_1.__importStar(require("rxjs"));
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../ui_actions/public");
const public_2 = require("../../../../inspector/public");
const public_3 = require("../../../../data/public");
const public_4 = require("../../../../embeddable/public");
const columnActions = tslib_1.__importStar(require("../angular/doc_table/actions/columns"));
const search_template_html_1 = tslib_1.__importDefault(require("./search_template.html"));
const doc_table_1 = require("../angular/doc_table");
const kibana_services_1 = require("../../kibana_services");
const constants_1 = require("./constants");
const common_1 = require("../../../common");
class SearchEmbeddable extends public_4.Embeddable {
    constructor({ $rootScope, $compile, savedSearch, editUrl, editPath, indexPatterns, editable, filterManager, }, initialInput, executeTriggerActions, parent) {
        super(initialInput, {
            defaultTitle: savedSearch.title,
            editUrl,
            editPath,
            editApp: 'discover',
            indexPatterns,
            editable,
        }, parent);
        this.executeTriggerActions = executeTriggerActions;
        this.panelTitle = '';
        this.type = constants_1.SEARCH_EMBEDDABLE_TYPE;
        this.fetch = async () => {
            if (!this.searchScope)
                return;
            const { searchSource } = this.savedSearch;
            // Abort any in-progress requests
            if (this.abortController)
                this.abortController.abort();
            this.abortController = new AbortController();
            searchSource.setField('size', kibana_services_1.getServices().uiSettings.get(common_1.SAMPLE_SIZE_SETTING));
            searchSource.setField('sort', doc_table_1.getSortForSearchSource(this.searchScope.sort, this.searchScope.indexPattern, kibana_services_1.getServices().uiSettings.get(common_1.SORT_DEFAULT_ORDER_SETTING)));
            // Log request to inspector
            this.inspectorAdaptors.requests.reset();
            const title = i18n_1.i18n.translate('discover.embeddable.inspectorRequestDataTitle', {
                defaultMessage: 'Data',
            });
            const description = i18n_1.i18n.translate('discover.embeddable.inspectorRequestDescription', {
                defaultMessage: 'This request queries Elasticsearch to fetch the data for the search.',
            });
            const inspectorRequest = this.inspectorAdaptors.requests.start(title, { description });
            inspectorRequest.stats(kibana_services_1.getRequestInspectorStats(searchSource));
            searchSource.getSearchRequestBody().then((body) => {
                inspectorRequest.json(body);
            });
            this.updateOutput({ loading: true, error: undefined });
            try {
                // Make the request
                const resp = await searchSource.fetch({
                    abortSignal: this.abortController.signal,
                });
                this.updateOutput({ loading: false, error: undefined });
                // Log response to inspector
                inspectorRequest.stats(kibana_services_1.getResponseInspectorStats(searchSource, resp)).ok({ json: resp });
                // Apply the changes to the angular scope
                this.searchScope.$apply(() => {
                    this.searchScope.hits = resp.hits.hits;
                    this.searchScope.totalHitCount = resp.hits.total;
                });
            }
            catch (error) {
                this.updateOutput({ loading: false, error });
            }
        };
        this.filterManager = filterManager;
        this.savedSearch = savedSearch;
        this.$rootScope = $rootScope;
        this.$compile = $compile;
        this.inspectorAdaptors = {
            requests: new public_2.RequestAdapter(),
        };
        this.initializeSearchScope();
        this.autoRefreshFetchSubscription = kibana_services_1.getServices()
            .timefilter.getAutoRefreshFetch$()
            .subscribe(this.fetch);
        this.subscription = Rx.merge(this.getOutput$(), this.getInput$()).subscribe(() => {
            this.panelTitle = this.output.title || '';
            if (this.searchScope) {
                this.pushContainerStateParamsToScope(this.searchScope);
            }
        });
    }
    getInspectorAdapters() {
        return this.inspectorAdaptors;
    }
    getSavedSearch() {
        return this.savedSearch;
    }
    /**
     *
     * @param {Element} domNode
     */
    render(domNode) {
        if (!this.searchScope) {
            throw new Error('Search scope not defined');
        }
        this.searchInstance = this.$compile(search_template_html_1.default)(this.searchScope);
        const rootNode = angular_1.default.element(domNode);
        rootNode.append(this.searchInstance);
        this.pushContainerStateParamsToScope(this.searchScope);
    }
    destroy() {
        super.destroy();
        this.savedSearch.destroy();
        if (this.searchInstance) {
            this.searchInstance.remove();
        }
        if (this.searchScope) {
            this.searchScope.$destroy();
            delete this.searchScope;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.autoRefreshFetchSubscription) {
            this.autoRefreshFetchSubscription.unsubscribe();
        }
        if (this.abortController)
            this.abortController.abort();
    }
    initializeSearchScope() {
        const searchScope = (this.searchScope = this.$rootScope.$new());
        searchScope.description = this.savedSearch.description;
        searchScope.inspectorAdapters = this.inspectorAdaptors;
        const { searchSource } = this.savedSearch;
        const indexPattern = (searchScope.indexPattern = searchSource.getField('index'));
        const timeRangeSearchSource = searchSource.create();
        timeRangeSearchSource.setField('filter', () => {
            if (!this.searchScope || !this.input.timeRange)
                return;
            return public_3.getTime(indexPattern, this.input.timeRange);
        });
        this.filtersSearchSource = searchSource.create();
        this.filtersSearchSource.setParent(timeRangeSearchSource);
        searchSource.setParent(this.filtersSearchSource);
        this.pushContainerStateParamsToScope(searchScope);
        searchScope.setSortOrder = (sort) => {
            this.updateInput({ sort });
        };
        searchScope.addColumn = (columnName) => {
            if (!searchScope.columns) {
                return;
            }
            indexPattern.popularizeField(columnName, 1);
            const columns = columnActions.addColumn(searchScope.columns, columnName);
            this.updateInput({ columns });
        };
        searchScope.removeColumn = (columnName) => {
            if (!searchScope.columns) {
                return;
            }
            const columns = columnActions.removeColumn(searchScope.columns, columnName);
            this.updateInput({ columns });
        };
        searchScope.moveColumn = (columnName, newIndex) => {
            if (!searchScope.columns) {
                return;
            }
            const columns = columnActions.moveColumn(searchScope.columns, columnName, newIndex);
            this.updateInput({ columns });
        };
        searchScope.filter = async (field, value, operator) => {
            let filters = public_3.esFilters.generateFilters(this.filterManager, field, value, operator, indexPattern.id);
            filters = filters.map((filter) => ({
                ...filter,
                $state: { store: public_3.esFilters.FilterStateStore.APP_STATE },
            }));
            await this.executeTriggerActions(public_1.APPLY_FILTER_TRIGGER, {
                embeddable: this,
                filters,
            });
        };
    }
    reload() {
        this.fetch();
    }
    pushContainerStateParamsToScope(searchScope) {
        const isFetchRequired = !public_3.esFilters.onlyDisabledFiltersChanged(this.input.filters, this.prevFilters) ||
            !lodash_1.default.isEqual(this.prevQuery, this.input.query) ||
            !lodash_1.default.isEqual(this.prevTimeRange, this.input.timeRange) ||
            !lodash_1.default.isEqual(searchScope.sort, this.input.sort || this.savedSearch.sort);
        // If there is column or sort data on the panel, that means the original columns or sort settings have
        // been overridden in a dashboard.
        searchScope.columns = this.input.columns || this.savedSearch.columns;
        searchScope.sort = this.input.sort || this.savedSearch.sort;
        searchScope.sharedItemTitle = this.panelTitle;
        if (isFetchRequired) {
            this.filtersSearchSource.setField('filter', this.input.filters);
            this.filtersSearchSource.setField('query', this.input.query);
            this.fetch();
            this.prevFilters = this.input.filters;
            this.prevQuery = this.input.query;
            this.prevTimeRange = this.input.timeRange;
        }
        else if (this.searchScope) {
            // trigger a digest cycle to make sure non-fetch relevant changes are propagated
            this.searchScope.$applyAsync();
        }
    }
}
exports.SearchEmbeddable = SearchEmbeddable;
