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
exports.aggParamsMap = void 0;
const tslib_1 = require("tslib");
const controls = tslib_1.__importStar(require("./controls"));
const public_1 = require("../../../data/public");
const utils_1 = require("./controls/utils");
const { siblingPipelineType, parentPipelineType } = public_1.search.aggs;
const buckets = {
    [public_1.BUCKET_TYPES.DATE_HISTOGRAM]: {
        scaleMetricValues: controls.ScaleMetricsParamEditor,
        interval: controls.TimeIntervalParamEditor,
        drop_partials: controls.DropPartialsParamEditor,
    },
    [public_1.BUCKET_TYPES.DATE_RANGE]: {
        ranges: controls.DateRangesParamEditor,
    },
    [public_1.BUCKET_TYPES.FILTERS]: {
        filters: controls.FiltersParamEditor,
    },
    [public_1.BUCKET_TYPES.GEOHASH_GRID]: {
        autoPrecision: controls.AutoPrecisionParamEditor,
        precision: controls.PrecisionParamEditor,
        useGeocentroid: controls.UseGeocentroidParamEditor,
        isFilteredByCollar: controls.IsFilteredByCollarParamEditor,
    },
    [public_1.BUCKET_TYPES.HISTOGRAM]: {
        interval: controls.NumberIntervalParamEditor,
        min_doc_count: controls.MinDocCountParamEditor,
        has_extended_bounds: controls.HasExtendedBoundsParamEditor,
        extended_bounds: controls.ExtendedBoundsParamEditor,
    },
    [public_1.BUCKET_TYPES.IP_RANGE]: {
        ipRangeType: controls.IpRangeTypeParamEditor,
        ranges: controls.IpRangesParamEditor,
    },
    [public_1.BUCKET_TYPES.RANGE]: {
        ranges: controls.RangesControl,
    },
    [public_1.BUCKET_TYPES.SIGNIFICANT_TERMS]: {
        size: controls.SizeParamEditor,
    },
    [public_1.BUCKET_TYPES.TERMS]: {
        include: controls.IncludeExcludeParamEditor,
        exclude: controls.IncludeExcludeParamEditor,
        orderBy: controls.OrderByParamEditor,
        orderAgg: controls.OrderAggParamEditor,
        order: utils_1.wrapWithInlineComp(controls.OrderParamEditor),
        size: utils_1.wrapWithInlineComp(controls.SizeParamEditor),
        otherBucket: controls.OtherBucketParamEditor,
        missingBucket: controls.MissingBucketParamEditor,
    },
};
const metrics = {
    [public_1.METRIC_TYPES.TOP_HITS]: {
        field: controls.TopFieldParamEditor,
        aggregate: utils_1.wrapWithInlineComp(controls.TopAggregateParamEditor),
        size: utils_1.wrapWithInlineComp(controls.TopSizeParamEditor),
        sortField: controls.TopSortFieldParamEditor,
        sortOrder: controls.OrderParamEditor,
    },
    [public_1.METRIC_TYPES.PERCENTILES]: {
        percents: controls.PercentilesEditor,
    },
    [public_1.METRIC_TYPES.PERCENTILE_RANKS]: {
        values: controls.PercentileRanksEditor,
    },
};
exports.aggParamsMap = {
    common: {
        string: controls.StringParamEditor,
        json: controls.RawJsonParamEditor,
        field: controls.FieldParamEditor,
    },
    [siblingPipelineType]: {
        customBucket: controls.SubMetricParamEditor,
        customMetric: controls.SubMetricParamEditor,
    },
    [parentPipelineType]: {
        metricAgg: controls.MetricAggParamEditor,
        customMetric: controls.SubAggParamEditor,
    },
    [public_1.AggGroupNames.Buckets]: buckets,
    [public_1.AggGroupNames.Metrics]: metrics,
};
