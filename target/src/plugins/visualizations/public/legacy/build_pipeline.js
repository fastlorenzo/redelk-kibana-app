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
exports.buildPipeline = exports.buildVislibDimensions = exports.buildPipelineVisFunction = exports.prepareDimension = exports.prepareValue = exports.prepareString = exports.escapeString = exports.prepareJson = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const public_1 = require("../../../../plugins/data/public");
const { isDateHistogramBucketAggConfig } = public_1.search.aggs;
const vislibCharts = [
    'area',
    'gauge',
    'goal',
    'heatmap',
    'histogram',
    'horizontal_bar',
    'line',
];
const getSchemas = (vis, opts) => {
    const { timeRange, timefilter } = opts;
    const createSchemaConfig = (accessor, agg) => {
        if (isDateHistogramBucketAggConfig(agg)) {
            agg.params.timeRange = timeRange;
            const bounds = agg.params.timeRange && agg.fieldIsTimeField()
                ? timefilter.calculateBounds(agg.params.timeRange)
                : undefined;
            agg.buckets.setBounds(bounds);
            agg.buckets.setInterval(agg.params.interval);
        }
        const hasSubAgg = [
            'derivative',
            'moving_avg',
            'serial_diff',
            'cumulative_sum',
            'sum_bucket',
            'avg_bucket',
            'min_bucket',
            'max_bucket',
        ].includes(agg.type.name);
        const formatAgg = hasSubAgg
            ? agg.params.customMetric || agg.aggConfigs.getRequestAggById(agg.params.metricAgg)
            : agg;
        const params = {};
        if (agg.type.name === 'geohash_grid') {
            params.precision = agg.params.precision;
            params.useGeocentroid = agg.params.useGeocentroid;
        }
        const label = agg.makeLabel && agg.makeLabel();
        return {
            accessor,
            format: formatAgg.toSerializedFieldFormat(),
            params,
            label,
            aggType: agg.type.name,
        };
    };
    let cnt = 0;
    const schemas = {
        metric: [],
    };
    if (!vis.data.aggs) {
        return schemas;
    }
    const responseAggs = vis.data.aggs.getResponseAggs().filter((agg) => agg.enabled);
    const isHierarchical = vis.isHierarchical();
    const metrics = responseAggs.filter((agg) => agg.type.type === 'metrics');
    responseAggs.forEach((agg) => {
        let skipMetrics = false;
        let schemaName = agg.schema;
        if (!schemaName) {
            if (agg.type.name === 'geo_centroid') {
                schemaName = 'geo_centroid';
            }
            else {
                cnt++;
                return;
            }
        }
        if (schemaName === 'split') {
            schemaName = `split_${vis.params.row ? 'row' : 'column'}`;
            skipMetrics = responseAggs.length - metrics.length > 1;
        }
        if (!schemas[schemaName]) {
            schemas[schemaName] = [];
        }
        if (!isHierarchical || agg.type.type !== 'metrics') {
            schemas[schemaName].push(createSchemaConfig(cnt++, agg));
        }
        if (isHierarchical && (agg.type.type !== 'metrics' || metrics.length === responseAggs.length)) {
            metrics.forEach((metric) => {
                const schemaConfig = createSchemaConfig(cnt++, metric);
                if (!skipMetrics) {
                    schemas.metric.push(schemaConfig);
                }
            });
        }
    });
    return schemas;
};
exports.prepareJson = (variable, data) => {
    if (data === undefined) {
        return '';
    }
    return `${variable}='${JSON.stringify(data).replace(/\\/g, `\\\\`).replace(/'/g, `\\'`)}' `;
};
exports.escapeString = (data) => {
    return data.replace(/\\/g, `\\\\`).replace(/'/g, `\\'`);
};
exports.prepareString = (variable, data) => {
    if (data === undefined) {
        return '';
    }
    return `${variable}='${exports.escapeString(data)}' `;
};
exports.prepareValue = (variable, data, raw = false) => {
    if (data === undefined) {
        return '';
    }
    if (raw) {
        return `${variable}=${data} `;
    }
    switch (typeof data) {
        case 'string':
            return exports.prepareString(variable, data);
        case 'object':
            return exports.prepareJson(variable, data);
        default:
            return `${variable}=${data} `;
    }
};
exports.prepareDimension = (variable, data) => {
    if (data === undefined) {
        return '';
    }
    let expr = `${variable}={visdimension ${data.accessor} `;
    if (data.format) {
        expr += exports.prepareValue('format', data.format.id);
        expr += exports.prepareJson('formatParams', data.format.params);
    }
    expr += '} ';
    return expr;
};
const adjustVislibDimensionFormmaters = (vis, dimensions) => {
    const visConfig = vis.params;
    const responseAggs = vis.data.aggs.getResponseAggs().filter((agg) => agg.enabled);
    (dimensions.y || []).forEach((yDimension) => {
        const yAgg = responseAggs[yDimension.accessor];
        const seriesParam = (visConfig.seriesParams || []).find((param) => param.data.id === yAgg.id);
        if (seriesParam) {
            const usedValueAxis = (visConfig.valueAxes || []).find((valueAxis) => valueAxis.id === seriesParam.valueAxis);
            if (lodash_1.get(usedValueAxis, 'scale.mode') === 'percentage') {
                yDimension.format = { id: 'percent' };
            }
        }
        if (lodash_1.get(visConfig, 'gauge.percentageMode') === true) {
            yDimension.format = { id: 'percent' };
        }
    });
};
exports.buildPipelineVisFunction = {
    vega: (params) => {
        return `vega ${exports.prepareString('spec', params.spec)}`;
    },
    input_control_vis: (params) => {
        return `input_control_vis ${exports.prepareJson('visConfig', params)}`;
    },
    metrics: ({ title, ...params }, schemas, uiState = {}) => {
        const paramsJson = exports.prepareJson('params', params);
        const uiStateJson = exports.prepareJson('uiState', uiState);
        const paramsArray = [paramsJson, uiStateJson].filter((param) => Boolean(param));
        return `tsvb ${paramsArray.join(' ')}`;
    },
    timelion: (params) => {
        const expression = exports.prepareString('expression', params.expression);
        const interval = exports.prepareString('interval', params.interval);
        return `timelion_vis ${expression}${interval}`;
    },
    markdown: (params) => {
        const { markdown, fontSize, openLinksInNewTab } = params;
        let escapedMarkdown = '';
        if (typeof markdown === 'string' || markdown instanceof String) {
            escapedMarkdown = exports.escapeString(markdown.toString());
        }
        let expr = `markdownvis '${escapedMarkdown}' `;
        expr += exports.prepareValue('font', `{font size=${fontSize}}`, true);
        expr += exports.prepareValue('openLinksInNewTab', openLinksInNewTab);
        return expr;
    },
    table: (params, schemas) => {
        const visConfig = {
            ...params,
            ...buildVisConfig.table(schemas, params),
        };
        return `kibana_table ${exports.prepareJson('visConfig', visConfig)}`;
    },
    metric: (params, schemas) => {
        const { percentageMode, useRanges, colorSchema, metricColorMode, colorsRange, labels, invertColors, style, } = params.metric;
        const { metrics, bucket } = buildVisConfig.metric(schemas).dimensions;
        // fix formatter for percentage mode
        if (lodash_1.get(params, 'metric.percentageMode') === true) {
            metrics.forEach((metric) => {
                metric.format = { id: 'percent' };
            });
        }
        let expr = `metricvis `;
        expr += exports.prepareValue('percentageMode', percentageMode);
        expr += exports.prepareValue('colorSchema', colorSchema);
        expr += exports.prepareValue('colorMode', metricColorMode);
        expr += exports.prepareValue('useRanges', useRanges);
        expr += exports.prepareValue('invertColors', invertColors);
        expr += exports.prepareValue('showLabels', labels && labels.show);
        if (style) {
            expr += exports.prepareValue('bgFill', style.bgFill);
            expr += exports.prepareValue('font', `{font size=${style.fontSize}}`, true);
            expr += exports.prepareValue('subText', style.subText);
            expr += exports.prepareDimension('bucket', bucket);
        }
        if (colorsRange) {
            colorsRange.forEach((range) => {
                expr += exports.prepareValue('colorRange', `{range from=${range.from} to=${range.to}}`, true);
            });
        }
        metrics.forEach((metric) => {
            expr += exports.prepareDimension('metric', metric);
        });
        return expr;
    },
    tagcloud: (params, schemas) => {
        const { scale, orientation, minFontSize, maxFontSize, showLabel } = params;
        const { metric, bucket } = buildVisConfig.tagcloud(schemas);
        let expr = `tagcloud metric={visdimension ${metric.accessor}} `;
        expr += exports.prepareValue('scale', scale);
        expr += exports.prepareValue('orientation', orientation);
        expr += exports.prepareValue('minFontSize', minFontSize);
        expr += exports.prepareValue('maxFontSize', maxFontSize);
        expr += exports.prepareValue('showLabel', showLabel);
        expr += exports.prepareDimension('bucket', bucket);
        return expr;
    },
    region_map: (params, schemas) => {
        const visConfig = {
            ...params,
            ...buildVisConfig.region_map(schemas),
        };
        return `regionmap ${exports.prepareJson('visConfig', visConfig)}`;
    },
    tile_map: (params, schemas) => {
        const visConfig = {
            ...params,
            ...buildVisConfig.tile_map(schemas),
        };
        return `tilemap ${exports.prepareJson('visConfig', visConfig)}`;
    },
    pie: (params, schemas) => {
        const visConfig = {
            ...params,
            ...buildVisConfig.pie(schemas),
        };
        return `kibana_pie ${exports.prepareJson('visConfig', visConfig)}`;
    },
};
const buildVisConfig = {
    table: (schemas, visParams = {}) => {
        const visConfig = {};
        const metrics = schemas.metric;
        const buckets = schemas.bucket || [];
        visConfig.dimensions = {
            metrics,
            buckets,
            splitRow: schemas.split_row,
            splitColumn: schemas.split_column,
        };
        if (visParams.showMetricsAtAllLevels === false && visParams.showPartialRows === true) {
            // Handle case where user wants to see partial rows but not metrics at all levels.
            // This requires calculating how many metrics will come back in the tabified response,
            // and removing all metrics from the dimensions except the last set.
            const metricsPerBucket = metrics.length / buckets.length;
            visConfig.dimensions.metrics.splice(0, metricsPerBucket * buckets.length - metricsPerBucket);
        }
        return visConfig;
    },
    metric: (schemas) => {
        const visConfig = { dimensions: {} };
        visConfig.dimensions.metrics = schemas.metric;
        if (schemas.group) {
            visConfig.dimensions.bucket = schemas.group[0];
        }
        return visConfig;
    },
    tagcloud: (schemas) => {
        const visConfig = {};
        visConfig.metric = schemas.metric[0];
        if (schemas.segment) {
            visConfig.bucket = schemas.segment[0];
        }
        return visConfig;
    },
    region_map: (schemas) => {
        const visConfig = {};
        visConfig.metric = schemas.metric[0];
        if (schemas.segment) {
            visConfig.bucket = schemas.segment[0];
        }
        return visConfig;
    },
    tile_map: (schemas) => {
        const visConfig = {};
        visConfig.dimensions = {
            metric: schemas.metric[0],
            geohash: schemas.segment ? schemas.segment[0] : null,
            geocentroid: schemas.geo_centroid ? schemas.geo_centroid[0] : null,
        };
        return visConfig;
    },
    pie: (schemas) => {
        const visConfig = {};
        visConfig.dimensions = {
            metric: schemas.metric[0],
            buckets: schemas.segment,
            splitRow: schemas.split_row,
            splitColumn: schemas.split_column,
        };
        return visConfig;
    },
};
exports.buildVislibDimensions = async (vis, params) => {
    const schemas = getSchemas(vis, {
        timeRange: params.timeRange,
        timefilter: params.timefilter,
    });
    const dimensions = {
        x: schemas.segment ? schemas.segment[0] : null,
        y: schemas.metric,
        z: schemas.radius,
        width: schemas.width,
        series: schemas.group,
        splitRow: schemas.split_row,
        splitColumn: schemas.split_column,
    };
    if (schemas.segment) {
        const xAgg = vis.data.aggs.getResponseAggs()[dimensions.x.accessor];
        if (xAgg.type.name === 'date_histogram') {
            dimensions.x.params.date = true;
            const { esUnit, esValue } = xAgg.buckets.getInterval();
            dimensions.x.params.interval = moment_1.default.duration(esValue, esUnit);
            dimensions.x.params.intervalESValue = esValue;
            dimensions.x.params.intervalESUnit = esUnit;
            dimensions.x.params.format = xAgg.buckets.getScaledDateFormat();
            dimensions.x.params.bounds = xAgg.buckets.getBounds();
        }
        else if (xAgg.type.name === 'histogram') {
            const intervalParam = xAgg.type.paramByName('interval');
            const output = { params: {} };
            await intervalParam.modifyAggConfigOnSearchRequestStart(xAgg, vis.data.searchSource, {
                abortSignal: params.abortSignal,
            });
            intervalParam.write(xAgg, output);
            dimensions.x.params.interval = output.params.interval;
        }
    }
    adjustVislibDimensionFormmaters(vis, dimensions);
    return dimensions;
};
exports.buildPipeline = async (vis, params) => {
    const { indexPattern, searchSource } = vis.data;
    const query = searchSource.getField('query');
    const filters = searchSource.getField('filter');
    const { uiState, title } = vis;
    // context
    let pipeline = `kibana | kibana_context `;
    if (query) {
        pipeline += exports.prepareJson('query', query);
    }
    if (filters) {
        pipeline += exports.prepareJson('filters', filters);
    }
    if (vis.data.savedSearchId) {
        pipeline += exports.prepareString('savedSearchId', vis.data.savedSearchId);
    }
    pipeline += '| ';
    // request handler
    if (vis.type.requestHandler === 'courier') {
        pipeline += `esaggs
    ${exports.prepareString('index', indexPattern.id)}
    metricsAtAllLevels=${vis.isHierarchical()}
    partialRows=${vis.type.requiresPartialRows || vis.params.showPartialRows || false}
    ${exports.prepareJson('aggConfigs', vis.data.aggs.aggs)} | `;
    }
    const schemas = getSchemas(vis, {
        timeRange: params.timeRange,
        timefilter: params.timefilter,
    });
    if (exports.buildPipelineVisFunction[vis.type.name]) {
        pipeline += exports.buildPipelineVisFunction[vis.type.name]({ title, ...vis.params }, schemas, uiState);
    }
    else if (vislibCharts.includes(vis.type.name)) {
        const visConfig = { ...vis.params };
        visConfig.dimensions = await exports.buildVislibDimensions(vis, params);
        pipeline += `vislib type='${vis.type.name}' ${exports.prepareJson('visConfig', visConfig)}`;
    }
    else if (vis.type.toExpression) {
        pipeline += await vis.type.toExpression(vis, params);
    }
    else {
        const visConfig = { ...vis.params };
        visConfig.dimensions = schemas;
        pipeline += `visualization type='${vis.type.name}'
    ${exports.prepareJson('visConfig', visConfig)}
    metricsAtAllLevels=${vis.isHierarchical()}
    partialRows=${vis.type.requiresPartialRows || vis.params.showPartialRows || false} `;
        if (indexPattern) {
            pipeline += `${exports.prepareString('index', indexPattern.id)} `;
            if (vis.data.aggs) {
                pipeline += `${exports.prepareJson('aggConfigs', vis.data.aggs.aggs)}`;
            }
        }
    }
    return pipeline;
};
