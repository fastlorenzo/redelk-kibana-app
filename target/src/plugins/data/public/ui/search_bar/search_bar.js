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
exports.SearchBar = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = require("@kbn/i18n/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_2 = tslib_1.__importStar(require("react"));
const resize_observer_polyfill_1 = tslib_1.__importDefault(require("resize-observer-polyfill"));
const lodash_2 = require("lodash");
const public_1 = require("../../../../kibana_react/public");
const query_bar_top_row_1 = require("../query_string_input/query_bar_top_row");
const __1 = require("..");
class SearchBarUI extends react_2.Component {
    constructor() {
        super(...arguments);
        this.services = this.props.kibana.services;
        this.savedQueryService = this.services.data.query.savedQueries;
        this.filterBarRef = null;
        this.filterBarWrapperRef = null;
        /*
         Keep the "draft" value in local state until the user actually submits the query. There are a couple advantages:
      
          1. Each app doesn't have to maintain its own "draft" value if it wants to put off updating the query in app state
          until the user manually submits their changes. Most apps have watches on the query value in app state so we don't
          want to trigger those on every keypress. Also, some apps (e.g. dashboard) already juggle multiple query values,
          each with slightly different semantics and I'd rather not add yet another variable to the mix.
      
          2. Changes to the local component state won't trigger an Angular digest cycle. Triggering digest cycles on every
          keypress has been a major source of performance issues for us in previous implementations of the query bar.
          See https://github.com/elastic/kibana/issues/14086
        */
        this.state = {
            isFiltersVisible: true,
            showSaveQueryModal: false,
            showSaveNewQueryModal: false,
            showSavedQueryPopover: false,
            currentProps: this.props,
            query: this.props.query ? { ...this.props.query } : undefined,
            dateRangeFrom: lodash_2.get(this.props, 'dateRangeFrom', 'now-15m'),
            dateRangeTo: lodash_2.get(this.props, 'dateRangeTo', 'now'),
        };
        this.isDirty = () => {
            if (!this.props.showDatePicker && this.state.query && this.props.query) {
                return this.state.query.query !== this.props.query.query;
            }
            return ((this.state.query && this.props.query && this.state.query.query !== this.props.query.query) ||
                this.state.dateRangeFrom !== this.props.dateRangeFrom ||
                this.state.dateRangeTo !== this.props.dateRangeTo);
        };
        this.setFilterBarHeight = () => {
            requestAnimationFrame(() => {
                const height = this.filterBarRef && this.state.isFiltersVisible ? this.filterBarRef.clientHeight : 0;
                if (this.filterBarWrapperRef) {
                    this.filterBarWrapperRef.setAttribute('style', `height: ${height}px`);
                }
            });
        };
        // member-ordering rules conflict with use-before-declaration rules
        /* eslint-disable */
        this.ro = new resize_observer_polyfill_1.default(this.setFilterBarHeight);
        /* eslint-enable */
        this.onSave = async (savedQueryMeta, saveAsNew = false) => {
            if (!this.state.query)
                return;
            const savedQueryAttributes = {
                title: savedQueryMeta.title,
                description: savedQueryMeta.description,
                query: this.state.query,
            };
            if (savedQueryMeta.shouldIncludeFilters) {
                savedQueryAttributes.filters = this.props.filters;
            }
            if (savedQueryMeta.shouldIncludeTimefilter &&
                this.state.dateRangeTo !== undefined &&
                this.state.dateRangeFrom !== undefined &&
                this.props.refreshInterval !== undefined &&
                this.props.isRefreshPaused !== undefined) {
                savedQueryAttributes.timefilter = {
                    from: this.state.dateRangeFrom,
                    to: this.state.dateRangeTo,
                    refreshInterval: {
                        value: this.props.refreshInterval,
                        pause: this.props.isRefreshPaused,
                    },
                };
            }
            try {
                let response;
                if (this.props.savedQuery && !saveAsNew) {
                    response = await this.savedQueryService.saveQuery(savedQueryAttributes, {
                        overwrite: true,
                    });
                }
                else {
                    response = await this.savedQueryService.saveQuery(savedQueryAttributes);
                }
                this.services.notifications.toasts.addSuccess(`Your query "${response.attributes.title}" was saved`);
                this.setState({
                    showSaveQueryModal: false,
                    showSaveNewQueryModal: false,
                });
                if (this.props.onSaved) {
                    this.props.onSaved(response);
                }
            }
            catch (error) {
                this.services.notifications.toasts.addDanger(`An error occured while saving your query: ${error.message}`);
                throw error;
            }
        };
        this.onInitiateSave = () => {
            this.setState({
                showSaveQueryModal: true,
            });
        };
        this.onInitiateSaveNew = () => {
            this.setState({
                showSaveNewQueryModal: true,
            });
        };
        this.onQueryBarChange = (queryAndDateRange) => {
            this.setState({
                query: queryAndDateRange.query,
                dateRangeFrom: queryAndDateRange.dateRange.from,
                dateRangeTo: queryAndDateRange.dateRange.to,
            });
            if (this.props.onQueryChange) {
                this.props.onQueryChange(queryAndDateRange);
            }
        };
        this.onQueryBarSubmit = (queryAndDateRange) => {
            this.setState({
                query: queryAndDateRange.query,
                dateRangeFrom: (queryAndDateRange.dateRange && queryAndDateRange.dateRange.from) ||
                    this.state.dateRangeFrom,
                dateRangeTo: (queryAndDateRange.dateRange && queryAndDateRange.dateRange.to) || this.state.dateRangeTo,
            }, () => {
                if (this.props.onQuerySubmit) {
                    this.props.onQuerySubmit({
                        query: this.state.query,
                        dateRange: {
                            from: this.state.dateRangeFrom,
                            to: this.state.dateRangeTo,
                        },
                    });
                }
            });
        };
        this.onLoadSavedQuery = (savedQuery) => {
            const dateRangeFrom = lodash_2.get(savedQuery, 'attributes.timefilter.from', this.state.dateRangeFrom);
            const dateRangeTo = lodash_2.get(savedQuery, 'attributes.timefilter.to', this.state.dateRangeTo);
            this.setState({
                query: savedQuery.attributes.query,
                dateRangeFrom,
                dateRangeTo,
            });
            if (this.props.onSavedQueryUpdated) {
                this.props.onSavedQueryUpdated(savedQuery);
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (lodash_2.isEqual(prevState.currentProps, nextProps)) {
            return null;
        }
        let nextQuery = null;
        if (nextProps.query && nextProps.query.query !== lodash_2.get(prevState, 'currentProps.query.query')) {
            nextQuery = {
                query: nextProps.query.query,
                language: nextProps.query.language,
            };
        }
        else if (nextProps.query &&
            prevState.query &&
            nextProps.query.language !== prevState.query.language) {
            nextQuery = {
                query: '',
                language: nextProps.query.language,
            };
        }
        let nextDateRange = null;
        if (nextProps.dateRangeFrom !== lodash_2.get(prevState, 'currentProps.dateRangeFrom') ||
            nextProps.dateRangeTo !== lodash_2.get(prevState, 'currentProps.dateRangeTo')) {
            nextDateRange = {
                dateRangeFrom: nextProps.dateRangeFrom,
                dateRangeTo: nextProps.dateRangeTo,
            };
        }
        const nextState = {
            currentProps: nextProps,
        };
        if (nextQuery) {
            nextState.query = nextQuery;
        }
        if (nextDateRange) {
            nextState.dateRangeFrom = nextDateRange.dateRangeFrom;
            nextState.dateRangeTo = nextDateRange.dateRangeTo;
        }
        return nextState;
    }
    shouldRenderQueryBar() {
        const showDatePicker = this.props.showDatePicker || this.props.showAutoRefreshOnly;
        const showQueryInput = this.props.showQueryInput && this.props.indexPatterns && this.state.query;
        return this.props.showQueryBar && (showDatePicker || showQueryInput);
    }
    shouldRenderFilterBar() {
        return (this.props.showFilterBar &&
            this.props.filters &&
            this.props.indexPatterns &&
            lodash_1.compact(this.props.indexPatterns).length > 0);
    }
    /*
     * This Function is here to show the toggle in saved query form
     * in case you the date range (from/to)
     */
    shouldRenderTimeFilterInSavedQueryForm() {
        const { dateRangeFrom, dateRangeTo, showDatePicker } = this.props;
        return (showDatePicker ||
            (!showDatePicker && dateRangeFrom !== undefined && dateRangeTo !== undefined));
    }
    componentDidMount() {
        if (this.filterBarRef) {
            this.setFilterBarHeight();
            this.ro.observe(this.filterBarRef);
        }
    }
    componentDidUpdate() {
        if (this.filterBarRef) {
            this.setFilterBarHeight();
            this.ro.unobserve(this.filterBarRef);
        }
    }
    render() {
        const savedQueryManagement = this.state.query && this.props.onClearSavedQuery && (react_2.default.createElement(__1.SavedQueryManagementComponent, { showSaveQuery: this.props.showSaveQuery, loadedSavedQuery: this.props.savedQuery, onSave: this.onInitiateSave, onSaveAsNew: this.onInitiateSaveNew, onLoad: this.onLoadSavedQuery, savedQueryService: this.savedQueryService, onClearSavedQuery: this.props.onClearSavedQuery }));
        let queryBar;
        if (this.shouldRenderQueryBar()) {
            queryBar = (react_2.default.createElement(query_bar_top_row_1.QueryBarTopRow, { timeHistory: this.props.timeHistory, query: this.state.query, screenTitle: this.props.screenTitle, onSubmit: this.onQueryBarSubmit, indexPatterns: this.props.indexPatterns, isLoading: this.props.isLoading, prepend: this.props.showFilterBar ? savedQueryManagement : undefined, showDatePicker: this.props.showDatePicker, dateRangeFrom: this.state.dateRangeFrom, dateRangeTo: this.state.dateRangeTo, isRefreshPaused: this.props.isRefreshPaused, refreshInterval: this.props.refreshInterval, showAutoRefreshOnly: this.props.showAutoRefreshOnly, showQueryInput: this.props.showQueryInput, onRefresh: this.props.onRefresh, onRefreshChange: this.props.onRefreshChange, onChange: this.onQueryBarChange, isDirty: this.isDirty(), customSubmitButton: this.props.customSubmitButton ? this.props.customSubmitButton : undefined, dataTestSubj: this.props.dataTestSubj, indicateNoData: this.props.indicateNoData }));
        }
        let filterBar;
        if (this.shouldRenderFilterBar()) {
            const filterGroupClasses = classnames_1.default('globalFilterGroup__wrapper', {
                'globalFilterGroup__wrapper-isVisible': this.state.isFiltersVisible,
            });
            filterBar = (react_2.default.createElement("div", { id: "GlobalFilterGroup", ref: (node) => {
                    this.filterBarWrapperRef = node;
                }, className: filterGroupClasses },
                react_2.default.createElement("div", { ref: (node) => {
                        this.filterBarRef = node;
                    } },
                    react_2.default.createElement(__1.FilterBar, { className: "globalFilterGroup__filterBar", filters: this.props.filters, onFiltersUpdated: this.props.onFiltersUpdated, indexPatterns: this.props.indexPatterns }))));
        }
        return (react_2.default.createElement("div", { className: "globalQueryBar" },
            queryBar,
            filterBar,
            this.state.showSaveQueryModal ? (react_2.default.createElement(__1.SaveQueryForm, { savedQuery: this.props.savedQuery ? this.props.savedQuery.attributes : undefined, savedQueryService: this.savedQueryService, onSave: this.onSave, onClose: () => this.setState({ showSaveQueryModal: false }), showFilterOption: this.props.showFilterBar, showTimeFilterOption: this.shouldRenderTimeFilterInSavedQueryForm() })) : null,
            this.state.showSaveNewQueryModal ? (react_2.default.createElement(__1.SaveQueryForm, { savedQueryService: this.savedQueryService, onSave: (savedQueryMeta) => this.onSave(savedQueryMeta, true), onClose: () => this.setState({ showSaveNewQueryModal: false }), showFilterOption: this.props.showFilterBar, showTimeFilterOption: this.shouldRenderTimeFilterInSavedQueryForm() })) : null));
    }
}
SearchBarUI.defaultProps = {
    showQueryBar: true,
    showFilterBar: true,
    showDatePicker: true,
    showAutoRefreshOnly: false,
};
exports.SearchBar = react_1.injectI18n(public_1.withKibana(SearchBarUI));
