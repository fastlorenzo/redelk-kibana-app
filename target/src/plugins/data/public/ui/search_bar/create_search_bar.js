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
exports.createSearchBar = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_1 = tslib_1.__importStar(require("react"));
const public_1 = require("../../../../kibana_react/public");
const search_bar_1 = require("./search_bar");
const use_filter_manager_1 = require("./lib/use_filter_manager");
const use_timefilter_1 = require("./lib/use_timefilter");
const use_saved_query_1 = require("./lib/use_saved_query");
const common_1 = require("../../../common");
// Respond to user changing the filters
const defaultFiltersUpdated = (queryService) => {
    return (filters) => {
        queryService.filterManager.setFilters(filters);
    };
};
// Respond to user changing the refresh settings
const defaultOnRefreshChange = (queryService) => {
    const { timefilter } = queryService.timefilter;
    return (options) => {
        timefilter.setRefreshInterval({
            value: options.refreshInterval,
            pause: options.isPaused,
        });
    };
};
// Respond to user changing the query string or time settings
const defaultOnQuerySubmit = (props, queryService, currentQuery, setQueryStringState) => {
    if (!props.useDefaultBehaviors)
        return props.onQuerySubmit;
    const { timefilter } = queryService.timefilter;
    return (payload) => {
        const isUpdate = !lodash_1.default.isEqual(timefilter.getTime(), payload.dateRange) ||
            !lodash_1.default.isEqual(payload.query, currentQuery);
        if (isUpdate) {
            timefilter.setTime(payload.dateRange);
            setQueryStringState(payload.query);
        }
        else {
            // Refresh button triggered for an update
            if (props.onQuerySubmit)
                props.onQuerySubmit({
                    dateRange: timefilter.getTime(),
                    query: currentQuery,
                }, false);
        }
    };
};
// Respond to user clearing a saved query
const defaultOnClearSavedQuery = (props, clearSavedQuery) => {
    if (!props.useDefaultBehaviors)
        return props.onClearSavedQuery;
    return () => {
        clearSavedQuery();
        if (props.onSavedQueryIdChange)
            props.onSavedQueryIdChange();
    };
};
// Respond to user saving or updating a saved query
const defaultOnSavedQueryUpdated = (props, setSavedQuery) => {
    if (!props.useDefaultBehaviors)
        return props.onSavedQueryUpdated;
    return (savedQuery) => {
        setSavedQuery(savedQuery);
        if (props.onSavedQueryIdChange)
            props.onSavedQueryIdChange(savedQuery.id);
    };
};
const overrideDefaultBehaviors = (props) => {
    return props.useDefaultBehaviors ? {} : props;
};
function createSearchBar({ core, storage, data }) {
    // App name should come from the core application service.
    // Until it's available, we'll ask the user to provide it for the pre-wired component.
    return (props) => {
        const { useDefaultBehaviors } = props;
        // Handle queries
        const queryRef = react_1.useRef(props.query);
        const onQuerySubmitRef = react_1.useRef(props.onQuerySubmit);
        const defaultQuery = {
            query: '',
            language: storage.get('kibana.userQueryLanguage') ||
                core.uiSettings.get(common_1.UI_SETTINGS.SEARCH_QUERY_LANGUAGE),
        };
        const [query, setQuery] = react_1.useState(props.query || defaultQuery);
        react_1.useEffect(() => {
            if (props.query !== queryRef.current) {
                queryRef.current = props.query;
                setQuery(props.query || defaultQuery);
            }
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }, [defaultQuery, props.query]);
        react_1.useEffect(() => {
            if (props.onQuerySubmit !== onQuerySubmitRef.current) {
                onQuerySubmitRef.current = props.onQuerySubmit;
            }
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }, [props.onQuerySubmit]);
        // handle service state updates.
        // i.e. filters being added from a visualization directly to filterManager.
        const { filters } = use_filter_manager_1.useFilterManager({
            filters: props.filters,
            filterManager: data.query.filterManager,
        });
        const { timeRange, refreshInterval } = use_timefilter_1.useTimefilter({
            dateRangeFrom: props.dateRangeFrom,
            dateRangeTo: props.dateRangeTo,
            refreshInterval: props.refreshInterval,
            isRefreshPaused: props.isRefreshPaused,
            timefilter: data.query.timefilter.timefilter,
        });
        // Fetch and update UI from saved query
        const { savedQuery, setSavedQuery, clearSavedQuery } = use_saved_query_1.useSavedQuery({
            queryService: data.query,
            setQuery,
            savedQueryId: props.savedQueryId,
            notifications: core.notifications,
            defaultLanguage: defaultQuery.language,
        });
        // Fire onQuerySubmit on query or timerange change
        react_1.useEffect(() => {
            if (!useDefaultBehaviors || !onQuerySubmitRef.current)
                return;
            onQuerySubmitRef.current({
                dateRange: timeRange,
                query,
            }, true);
        }, [query, timeRange, useDefaultBehaviors]);
        return (react_1.default.createElement(public_1.KibanaContextProvider, { services: {
                appName: props.appName,
                data,
                storage,
                ...core,
            } },
            react_1.default.createElement(search_bar_1.SearchBar, Object.assign({ showAutoRefreshOnly: props.showAutoRefreshOnly, showDatePicker: props.showDatePicker, showFilterBar: props.showFilterBar, showQueryBar: props.showQueryBar, showQueryInput: props.showQueryInput, showSaveQuery: props.showSaveQuery, screenTitle: props.screenTitle, indexPatterns: props.indexPatterns, indicateNoData: props.indicateNoData, timeHistory: data.query.timefilter.history, dateRangeFrom: timeRange.from, dateRangeTo: timeRange.to, refreshInterval: refreshInterval.value, isRefreshPaused: refreshInterval.pause, filters: filters, query: query, onFiltersUpdated: defaultFiltersUpdated(data.query), onRefreshChange: defaultOnRefreshChange(data.query), savedQuery: savedQuery, onQuerySubmit: defaultOnQuerySubmit(props, data.query, query, setQuery), onClearSavedQuery: defaultOnClearSavedQuery(props, clearSavedQuery), onSavedQueryUpdated: defaultOnSavedQueryUpdated(props, setSavedQuery), onSaved: defaultOnSavedQueryUpdated(props, setSavedQuery) }, overrideDefaultBehaviors(props)))));
    };
}
exports.createSearchBar = createSearchBar;
