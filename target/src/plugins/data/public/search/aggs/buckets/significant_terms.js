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
exports.getSignificantTermsBucketAgg = void 0;
const i18n_1 = require("@kbn/i18n");
const bucket_agg_type_1 = require("./bucket_agg_type");
const terms_1 = require("./create_filter/terms");
const migrate_include_exclude_format_1 = require("./migrate_include_exclude_format");
const bucket_agg_types_1 = require("./bucket_agg_types");
const common_1 = require("../../../../common");
const significantTermsTitle = i18n_1.i18n.translate('data.search.aggs.buckets.significantTermsTitle', {
    defaultMessage: 'Significant Terms',
});
exports.getSignificantTermsBucketAgg = () => new bucket_agg_type_1.BucketAggType({
    name: bucket_agg_types_1.BUCKET_TYPES.SIGNIFICANT_TERMS,
    title: significantTermsTitle,
    makeLabel(aggConfig) {
        return i18n_1.i18n.translate('data.search.aggs.buckets.significantTermsLabel', {
            defaultMessage: 'Top {size} unusual terms in {fieldName}',
            values: {
                size: aggConfig.params.size,
                fieldName: aggConfig.getFieldDisplayName(),
            },
        });
    },
    createFilter: terms_1.createFilterTerms,
    params: [
        {
            name: 'field',
            type: 'field',
            scriptable: false,
            filterFieldTypes: common_1.KBN_FIELD_TYPES.STRING,
        },
        {
            name: 'size',
            default: '',
        },
        {
            name: 'exclude',
            displayName: i18n_1.i18n.translate('data.search.aggs.buckets.significantTerms.excludeLabel', {
                defaultMessage: 'Exclude',
            }),
            type: 'string',
            advanced: true,
            shouldShow: migrate_include_exclude_format_1.isStringType,
            ...migrate_include_exclude_format_1.migrateIncludeExcludeFormat,
        },
        {
            name: 'include',
            displayName: i18n_1.i18n.translate('data.search.aggs.buckets.significantTerms.includeLabel', {
                defaultMessage: 'Include',
            }),
            type: 'string',
            advanced: true,
            shouldShow: migrate_include_exclude_format_1.isStringType,
            ...migrate_include_exclude_format_1.migrateIncludeExcludeFormat,
        },
    ],
});
