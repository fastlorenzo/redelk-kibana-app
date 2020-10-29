"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisualizeUrl = exports.getMapsAppUrl = exports.isFieldVisualizable = exports.isMapsAppRegistered = void 0;
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
const v4_1 = tslib_1.__importDefault(require("uuid/v4"));
const rison_node_1 = tslib_1.__importDefault(require("rison-node"));
const query_string_1 = require("query-string");
const public_1 = require("../../../../../../data/public");
const common_1 = require("../../../../../common");
function isMapsAppRegistered(visualizations) {
    return visualizations.getAliases().some(({ name }) => {
        return name === 'maps';
    });
}
exports.isMapsAppRegistered = isMapsAppRegistered;
function isFieldVisualizable(field, visualizations) {
    if (field.name === '_id') {
        // Else you'd get a 'Fielddata access on the _id field is disallowed' error on ES side.
        return false;
    }
    if ((field.type === public_1.KBN_FIELD_TYPES.GEO_POINT || field.type === public_1.KBN_FIELD_TYPES.GEO_SHAPE) &&
        isMapsAppRegistered(visualizations)) {
        return true;
    }
    return field.visualizable;
}
exports.isFieldVisualizable = isFieldVisualizable;
function getMapsAppUrl(field, indexPattern, appState, columns) {
    const mapAppParams = new URLSearchParams();
    // Copy global state
    const locationSplit = window.location.hash.split('?');
    if (locationSplit.length > 1) {
        const discoverParams = new URLSearchParams(locationSplit[1]);
        const globalStateUrlValue = discoverParams.get('_g');
        if (globalStateUrlValue) {
            mapAppParams.set('_g', globalStateUrlValue);
        }
    }
    // Copy filters and query in app state
    const mapsAppState = {
        filters: appState.filters || [],
    };
    if (appState.query) {
        mapsAppState.query = appState.query;
    }
    // @ts-ignore
    mapAppParams.set('_a', rison_node_1.default.encode(mapsAppState));
    // create initial layer descriptor
    const hasColumns = columns && columns.length && columns[0] !== '_source';
    const supportsClustering = field.aggregatable;
    mapAppParams.set('initialLayers', 
    // @ts-ignore
    rison_node_1.default.encode_array([
        {
            id: v4_1.default(),
            label: indexPattern.title,
            sourceDescriptor: {
                id: v4_1.default(),
                type: 'ES_SEARCH',
                geoField: field.name,
                tooltipProperties: hasColumns ? columns : [],
                indexPatternId: indexPattern.id,
                scalingType: supportsClustering ? 'CLUSTERS' : 'LIMIT',
            },
            visible: true,
            type: supportsClustering ? 'BLENDED_VECTOR' : 'VECTOR',
        },
    ]));
    return {
        app: 'maps',
        path: `/map#?${mapAppParams.toString()}`,
    };
}
exports.getMapsAppUrl = getMapsAppUrl;
function getVisualizeUrl(field, indexPattern, state, columns, services) {
    const aggsTermSize = services.uiSettings.get(common_1.AGGS_TERMS_SIZE_SETTING);
    const urlParams = query_string_1.parse(services.history().location.search);
    if ((field.type === public_1.KBN_FIELD_TYPES.GEO_POINT || field.type === public_1.KBN_FIELD_TYPES.GEO_SHAPE) &&
        isMapsAppRegistered(services.visualizations)) {
        return getMapsAppUrl(field, indexPattern, state, columns);
    }
    let agg;
    const isGeoPoint = field.type === public_1.KBN_FIELD_TYPES.GEO_POINT;
    const type = isGeoPoint ? 'tile_map' : 'histogram';
    // If we're visualizing a date field, and our index is time based (and thus has a time filter),
    // then run a date histogram
    if (field.type === 'date' && indexPattern.timeFieldName === field.name) {
        agg = {
            type: 'date_histogram',
            schema: 'segment',
            params: {
                field: field.name,
                interval: 'auto',
            },
        };
    }
    else if (isGeoPoint) {
        agg = {
            type: 'geohash_grid',
            schema: 'segment',
            params: {
                field: field.name,
                precision: 3,
            },
        };
    }
    else {
        agg = {
            type: 'terms',
            schema: 'segment',
            params: {
                field: field.name,
                size: parseInt(aggsTermSize, 10),
                orderBy: '1',
            },
        };
    }
    const linkUrlParams = {
        ...urlParams,
        ...{
            indexPattern: state.index,
            type,
            _a: rison_node_1.default.encode({
                filters: state.filters || [],
                query: state.query,
                vis: {
                    type,
                    aggs: [{ schema: 'metric', type: 'count', id: '1' }, agg],
                },
            }),
        },
    };
    return {
        app: 'visualize',
        path: `#/create?${query_string_1.stringify(linkUrlParams)}`,
    };
}
exports.getVisualizeUrl = getVisualizeUrl;
