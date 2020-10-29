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
exports.esaggs = void 0;
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../plugins/kibana_utils/public");
const tabify_1 = require("../tabify");
const common_1 = require("../../../common");
const services_1 = require("../../services");
const build_tabular_inspector_data_1 = require("./build_tabular_inspector_data");
const utils_1 = require("./utils");
const name = 'esaggs';
const handleCourierRequest = async ({ searchSource, aggs, timeRange, timeFields, indexPattern, query, filters, forceFetch, partialRows, metricsAtAllLevels, inspectorAdapters, filterManager, abortSignal, }) => {
    // Create a new search source that inherits the original search source
    // but has the appropriate timeRange applied via a filter.
    // This is a temporary solution until we properly pass down all required
    // information for the request to the request handler (https://github.com/elastic/kibana/issues/16641).
    // Using callParentStartHandlers: true we make sure, that the parent searchSource
    // onSearchRequestStart will be called properly even though we use an inherited
    // search source.
    const timeFilterSearchSource = searchSource.createChild({ callParentStartHandlers: true });
    const requestSearchSource = timeFilterSearchSource.createChild({ callParentStartHandlers: true });
    aggs.setTimeRange(timeRange);
    // For now we need to mirror the history of the passed search source, since
    // the request inspector wouldn't work otherwise.
    Object.defineProperty(requestSearchSource, 'history', {
        get() {
            return searchSource.history;
        },
        set(history) {
            return (searchSource.history = history);
        },
    });
    requestSearchSource.setField('aggs', function () {
        return aggs.toDsl(metricsAtAllLevels);
    });
    requestSearchSource.onRequestStart((paramSearchSource, options) => {
        return aggs.onSearchRequestStart(paramSearchSource, options);
    });
    // If timeFields have been specified, use the specified ones, otherwise use primary time field of index
    // pattern if it's available.
    const defaultTimeField = indexPattern?.getTimeField?.();
    const defaultTimeFields = defaultTimeField ? [defaultTimeField.name] : [];
    const allTimeFields = timeFields && timeFields.length > 0 ? timeFields : defaultTimeFields;
    // If a timeRange has been specified and we had at least one timeField available, create range
    // filters for that those time fields
    if (timeRange && allTimeFields.length > 0) {
        timeFilterSearchSource.setField('filter', () => {
            return allTimeFields
                .map((fieldName) => common_1.getTime(indexPattern, timeRange, { fieldName }))
                .filter(common_1.isRangeFilter);
        });
    }
    requestSearchSource.setField('filter', filters);
    requestSearchSource.setField('query', query);
    const reqBody = await requestSearchSource.getSearchRequestBody();
    const queryHash = public_1.calculateObjectHash(reqBody);
    // We only need to reexecute the query, if forceFetch was true or the hash of the request body has changed
    // since the last request
    const shouldQuery = forceFetch || searchSource.lastQuery !== queryHash;
    if (shouldQuery) {
        inspectorAdapters.requests.reset();
        const request = inspectorAdapters.requests.start(i18n_1.i18n.translate('data.functions.esaggs.inspector.dataRequest.title', {
            defaultMessage: 'Data',
        }), {
            description: i18n_1.i18n.translate('data.functions.esaggs.inspector.dataRequest.description', {
                defaultMessage: 'This request queries Elasticsearch to fetch the data for the visualization.',
            }),
        });
        request.stats(utils_1.getRequestInspectorStats(requestSearchSource));
        try {
            const response = await requestSearchSource.fetch({ abortSignal });
            searchSource.lastQuery = queryHash;
            request.stats(utils_1.getResponseInspectorStats(searchSource, response)).ok({ json: response });
            searchSource.rawResponse = response;
        }
        catch (e) {
            // Log any error during request to the inspector
            request.error({ json: e });
            throw e;
        }
        finally {
            // Add the request body no matter if things went fine or not
            requestSearchSource.getSearchRequestBody().then((req) => {
                request.json(req);
            });
        }
    }
    // Note that rawResponse is not deeply cloned here, so downstream applications using courier
    // must take care not to mutate it, or it could have unintended side effects, e.g. displaying
    // response data incorrectly in the inspector.
    let resp = searchSource.rawResponse;
    for (const agg of aggs.aggs) {
        if (lodash_1.hasIn(agg, 'type.postFlightRequest')) {
            resp = await agg.type.postFlightRequest(resp, aggs, agg, requestSearchSource, inspectorAdapters.requests, abortSignal);
        }
    }
    searchSource.finalResponse = resp;
    const parsedTimeRange = timeRange ? common_1.calculateBounds(timeRange) : null;
    const tabifyParams = {
        metricsAtAllLevels,
        partialRows,
        timeRange: parsedTimeRange
            ? { from: parsedTimeRange.min, to: parsedTimeRange.max, timeFields: allTimeFields }
            : undefined,
    };
    const tabifyCacheHash = public_1.calculateObjectHash({ tabifyAggs: aggs, ...tabifyParams });
    // We only need to reexecute tabify, if either we did a new request or some input params to tabify changed
    const shouldCalculateNewTabify = shouldQuery || searchSource.lastTabifyHash !== tabifyCacheHash;
    if (shouldCalculateNewTabify) {
        searchSource.lastTabifyHash = tabifyCacheHash;
        searchSource.tabifiedResponse = tabify_1.tabifyAggResponse(aggs, searchSource.finalResponse, tabifyParams);
    }
    inspectorAdapters.data.setTabularLoader(() => build_tabular_inspector_data_1.buildTabularInspectorData(searchSource.tabifiedResponse, {
        queryFilter: filterManager,
        deserializeFieldFormat: services_1.getFieldFormats().deserialize,
    }), { returnsFormattedValues: true });
    return searchSource.tabifiedResponse;
};
exports.esaggs = () => ({
    name,
    type: 'kibana_datatable',
    inputTypes: ['kibana_context', 'null'],
    help: i18n_1.i18n.translate('data.functions.esaggs.help', {
        defaultMessage: 'Run AggConfig aggregation',
    }),
    args: {
        index: {
            types: ['string'],
            help: '',
        },
        metricsAtAllLevels: {
            types: ['boolean'],
            default: false,
            help: '',
        },
        partialRows: {
            types: ['boolean'],
            default: false,
            help: '',
        },
        includeFormatHints: {
            types: ['boolean'],
            default: false,
            help: '',
        },
        aggConfigs: {
            types: ['string'],
            default: '""',
            help: '',
        },
        timeFields: {
            types: ['string'],
            help: '',
            multi: true,
        },
    },
    async fn(input, args, { inspectorAdapters, abortSignal }) {
        const indexPatterns = services_1.getIndexPatterns();
        const { filterManager } = services_1.getQueryService();
        const searchService = services_1.getSearchService();
        const aggConfigsState = JSON.parse(args.aggConfigs);
        const indexPattern = await indexPatterns.get(args.index);
        const aggs = searchService.aggs.createAggConfigs(indexPattern, aggConfigsState);
        // we should move searchSource creation inside courier request handler
        const searchSource = await searchService.searchSource.create();
        searchSource.setField('index', indexPattern);
        searchSource.setField('size', 0);
        const response = await handleCourierRequest({
            searchSource,
            aggs,
            indexPattern,
            timeRange: lodash_1.get(input, 'timeRange', undefined),
            query: lodash_1.get(input, 'query', undefined),
            filters: lodash_1.get(input, 'filters', undefined),
            timeFields: args.timeFields,
            forceFetch: true,
            metricsAtAllLevels: args.metricsAtAllLevels,
            partialRows: args.partialRows,
            inspectorAdapters: inspectorAdapters,
            filterManager,
            abortSignal: abortSignal,
        });
        const table = {
            type: 'kibana_datatable',
            rows: response.rows,
            columns: response.columns.map((column) => {
                const cleanedColumn = {
                    id: column.id,
                    name: column.name,
                    meta: utils_1.serializeAggConfig(column.aggConfig),
                };
                if (args.includeFormatHints) {
                    cleanedColumn.formatHint = column.aggConfig.toSerializedFieldFormat();
                }
                return cleanedColumn;
            }),
        };
        return table;
    },
});
