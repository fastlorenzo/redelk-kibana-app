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
exports.aggGeoTile = void 0;
const i18n_1 = require("@kbn/i18n");
const __1 = require("../");
const get_parsed_value_1 = require("../utils/get_parsed_value");
const fnName = 'aggGeoTile';
exports.aggGeoTile = () => ({
    name: fnName,
    help: i18n_1.i18n.translate('data.search.aggs.function.buckets.geoTile.help', {
        defaultMessage: 'Generates a serialized agg config for a Geo Tile agg',
    }),
    type: 'agg_type',
    args: {
        id: {
            types: ['string'],
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.id.help', {
                defaultMessage: 'ID for this aggregation',
            }),
        },
        enabled: {
            types: ['boolean'],
            default: true,
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.enabled.help', {
                defaultMessage: 'Specifies whether this aggregation should be enabled',
            }),
        },
        schema: {
            types: ['string'],
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.schema.help', {
                defaultMessage: 'Schema to use for this aggregation',
            }),
        },
        field: {
            types: ['string'],
            required: true,
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.field.help', {
                defaultMessage: 'Field to use for this aggregation',
            }),
        },
        useGeocentroid: {
            types: ['boolean'],
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.useGeocentroid.help', {
                defaultMessage: 'Specifies whether to use geocentroid for this aggregation',
            }),
        },
        precision: {
            types: ['number'],
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.precision.help', {
                defaultMessage: 'Precision to use for this aggregation.',
            }),
        },
        json: {
            types: ['string'],
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.json.help', {
                defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch',
            }),
        },
        customLabel: {
            types: ['string'],
            help: i18n_1.i18n.translate('data.search.aggs.buckets.geoTile.customLabel.help', {
                defaultMessage: 'Represents a custom label for this aggregation',
            }),
        },
    },
    fn: (input, args) => {
        const { id, enabled, schema, ...rest } = args;
        return {
            type: 'agg_type',
            value: {
                id,
                enabled,
                schema,
                type: __1.BUCKET_TYPES.GEOTILE_GRID,
                params: {
                    ...rest,
                    json: get_parsed_value_1.getParsedValue(args, 'json'),
                },
            },
        };
    },
});
