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
exports.getAggTypesFunctions = exports.getAggTypes = void 0;
const count_1 = require("./metrics/count");
const avg_1 = require("./metrics/avg");
const sum_1 = require("./metrics/sum");
const median_1 = require("./metrics/median");
const min_1 = require("./metrics/min");
const max_1 = require("./metrics/max");
const top_hit_1 = require("./metrics/top_hit");
const std_deviation_1 = require("./metrics/std_deviation");
const cardinality_1 = require("./metrics/cardinality");
const percentiles_1 = require("./metrics/percentiles");
const geo_bounds_1 = require("./metrics/geo_bounds");
const geo_centroid_1 = require("./metrics/geo_centroid");
const percentile_ranks_1 = require("./metrics/percentile_ranks");
const derivative_1 = require("./metrics/derivative");
const cumulative_sum_1 = require("./metrics/cumulative_sum");
const moving_avg_1 = require("./metrics/moving_avg");
const serial_diff_1 = require("./metrics/serial_diff");
const date_histogram_1 = require("./buckets/date_histogram");
const histogram_1 = require("./buckets/histogram");
const range_1 = require("./buckets/range");
const date_range_1 = require("./buckets/date_range");
const ip_range_1 = require("./buckets/ip_range");
const terms_1 = require("./buckets/terms");
const filter_1 = require("./buckets/filter");
const filters_1 = require("./buckets/filters");
const significant_terms_1 = require("./buckets/significant_terms");
const geo_hash_1 = require("./buckets/geo_hash");
const geo_tile_1 = require("./buckets/geo_tile");
const bucket_sum_1 = require("./metrics/bucket_sum");
const bucket_avg_1 = require("./metrics/bucket_avg");
const bucket_min_1 = require("./metrics/bucket_min");
const bucket_max_1 = require("./metrics/bucket_max");
exports.getAggTypes = ({ calculateBounds, getInternalStartServices, uiSettings, }) => ({
    metrics: [
        count_1.getCountMetricAgg(),
        avg_1.getAvgMetricAgg(),
        sum_1.getSumMetricAgg(),
        median_1.getMedianMetricAgg(),
        min_1.getMinMetricAgg(),
        max_1.getMaxMetricAgg(),
        std_deviation_1.getStdDeviationMetricAgg(),
        cardinality_1.getCardinalityMetricAgg(),
        percentiles_1.getPercentilesMetricAgg(),
        percentile_ranks_1.getPercentileRanksMetricAgg({ getInternalStartServices }),
        top_hit_1.getTopHitMetricAgg(),
        derivative_1.getDerivativeMetricAgg(),
        cumulative_sum_1.getCumulativeSumMetricAgg(),
        moving_avg_1.getMovingAvgMetricAgg(),
        serial_diff_1.getSerialDiffMetricAgg(),
        bucket_avg_1.getBucketAvgMetricAgg(),
        bucket_sum_1.getBucketSumMetricAgg(),
        bucket_min_1.getBucketMinMetricAgg(),
        bucket_max_1.getBucketMaxMetricAgg(),
        geo_bounds_1.getGeoBoundsMetricAgg(),
        geo_centroid_1.getGeoCentroidMetricAgg(),
    ],
    buckets: [
        date_histogram_1.getDateHistogramBucketAgg({ calculateBounds, uiSettings }),
        histogram_1.getHistogramBucketAgg({ uiSettings, getInternalStartServices }),
        range_1.getRangeBucketAgg({ getInternalStartServices }),
        date_range_1.getDateRangeBucketAgg({ uiSettings }),
        ip_range_1.getIpRangeBucketAgg(),
        terms_1.getTermsBucketAgg(),
        filter_1.getFilterBucketAgg(),
        filters_1.getFiltersBucketAgg({ uiSettings }),
        significant_terms_1.getSignificantTermsBucketAgg(),
        geo_hash_1.getGeoHashBucketAgg(),
        geo_tile_1.getGeoTitleBucketAgg(),
    ],
});
/** Buckets: **/
const filter_fn_1 = require("./buckets/filter_fn");
const filters_fn_1 = require("./buckets/filters_fn");
const significant_terms_fn_1 = require("./buckets/significant_terms_fn");
const ip_range_fn_1 = require("./buckets/ip_range_fn");
const date_range_fn_1 = require("./buckets/date_range_fn");
const range_fn_1 = require("./buckets/range_fn");
const geo_tile_fn_1 = require("./buckets/geo_tile_fn");
const geo_hash_fn_1 = require("./buckets/geo_hash_fn");
const histogram_fn_1 = require("./buckets/histogram_fn");
const date_histogram_fn_1 = require("./buckets/date_histogram_fn");
const terms_fn_1 = require("./buckets/terms_fn");
/** Metrics: **/
const avg_fn_1 = require("./metrics/avg_fn");
const bucket_avg_fn_1 = require("./metrics/bucket_avg_fn");
const bucket_max_fn_1 = require("./metrics/bucket_max_fn");
const bucket_min_fn_1 = require("./metrics/bucket_min_fn");
const bucket_sum_fn_1 = require("./metrics/bucket_sum_fn");
const cardinality_fn_1 = require("./metrics/cardinality_fn");
const count_fn_1 = require("./metrics/count_fn");
const cumulative_sum_fn_1 = require("./metrics/cumulative_sum_fn");
const derivative_fn_1 = require("./metrics/derivative_fn");
const geo_bounds_fn_1 = require("./metrics/geo_bounds_fn");
const geo_centroid_fn_1 = require("./metrics/geo_centroid_fn");
const max_fn_1 = require("./metrics/max_fn");
const median_fn_1 = require("./metrics/median_fn");
const min_fn_1 = require("./metrics/min_fn");
const moving_avg_fn_1 = require("./metrics/moving_avg_fn");
const percentile_ranks_fn_1 = require("./metrics/percentile_ranks_fn");
const percentiles_fn_1 = require("./metrics/percentiles_fn");
const serial_diff_fn_1 = require("./metrics/serial_diff_fn");
const std_deviation_fn_1 = require("./metrics/std_deviation_fn");
const sum_fn_1 = require("./metrics/sum_fn");
const top_hit_fn_1 = require("./metrics/top_hit_fn");
exports.getAggTypesFunctions = () => [
    avg_fn_1.aggAvg,
    bucket_avg_fn_1.aggBucketAvg,
    bucket_max_fn_1.aggBucketMax,
    bucket_min_fn_1.aggBucketMin,
    bucket_sum_fn_1.aggBucketSum,
    cardinality_fn_1.aggCardinality,
    count_fn_1.aggCount,
    cumulative_sum_fn_1.aggCumulativeSum,
    derivative_fn_1.aggDerivative,
    geo_bounds_fn_1.aggGeoBounds,
    geo_centroid_fn_1.aggGeoCentroid,
    max_fn_1.aggMax,
    median_fn_1.aggMedian,
    min_fn_1.aggMin,
    moving_avg_fn_1.aggMovingAvg,
    percentile_ranks_fn_1.aggPercentileRanks,
    percentiles_fn_1.aggPercentiles,
    serial_diff_fn_1.aggSerialDiff,
    std_deviation_fn_1.aggStdDeviation,
    sum_fn_1.aggSum,
    top_hit_fn_1.aggTopHit,
    filter_fn_1.aggFilter,
    filters_fn_1.aggFilters,
    significant_terms_fn_1.aggSignificantTerms,
    ip_range_fn_1.aggIpRange,
    date_range_fn_1.aggDateRange,
    range_fn_1.aggRange,
    geo_tile_fn_1.aggGeoTile,
    geo_hash_fn_1.aggGeoHash,
    date_histogram_fn_1.aggDateHistogram,
    histogram_fn_1.aggHistogram,
    terms_fn_1.aggTerms,
];
