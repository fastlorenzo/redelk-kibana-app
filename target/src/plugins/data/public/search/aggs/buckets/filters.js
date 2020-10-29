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
exports.getFiltersBucketAgg = void 0;
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const filters_1 = require("./create_filter/filters");
const utils_1 = require("../utils");
const bucket_agg_type_1 = require("./bucket_agg_type");
const bucket_agg_types_1 = require("./bucket_agg_types");
const common_1 = require("../../../../common");
const filtersTitle = i18n_1.i18n.translate('data.search.aggs.buckets.filtersTitle', {
    defaultMessage: 'Filters',
    description: 'The name of an aggregation, that allows to specify multiple individual filters to group data by.',
});
exports.getFiltersBucketAgg = ({ uiSettings }) => new bucket_agg_type_1.BucketAggType({
    name: bucket_agg_types_1.BUCKET_TYPES.FILTERS,
    title: filtersTitle,
    createFilter: filters_1.createFilterFilters,
    customLabels: false,
    params: [
        {
            name: 'filters',
            default: [
                {
                    input: { query: '', language: uiSettings.get(common_1.UI_SETTINGS.SEARCH_QUERY_LANGUAGE) },
                    label: '',
                },
            ],
            write(aggConfig, output) {
                const inFilters = aggConfig.params.filters;
                if (!lodash_1.size(inFilters))
                    return;
                const outFilters = lodash_1.transform(inFilters, function (filters, filter) {
                    const input = lodash_1.cloneDeep(filter.input);
                    if (!input) {
                        console.log('malformed filter agg params, missing "input" query'); // eslint-disable-line no-console
                        return;
                    }
                    const esQueryConfigs = common_1.getEsQueryConfig(uiSettings);
                    const query = common_1.buildEsQuery(aggConfig.getIndexPattern(), [input], [], esQueryConfigs);
                    if (!query) {
                        console.log('malformed filter agg params, missing "query" on input'); // eslint-disable-line no-console
                        return;
                    }
                    const matchAllLabel = filter.input.query === '' ? '*' : '';
                    const label = filter.label ||
                        matchAllLabel ||
                        (typeof filter.input.query === 'string'
                            ? filter.input.query
                            : utils_1.toAngularJSON(filter.input.query));
                    filters[label] = query;
                }, {});
                if (!lodash_1.size(outFilters))
                    return;
                const params = output.params || (output.params = {});
                params.filters = outFilters;
            },
        },
    ],
});
