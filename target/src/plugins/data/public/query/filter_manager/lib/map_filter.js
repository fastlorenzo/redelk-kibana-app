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
exports.mapFilter = void 0;
const lodash_1 = require("lodash");
const map_spatial_filter_1 = require("./mappers/map_spatial_filter");
const map_match_all_1 = require("./mappers/map_match_all");
const map_phrase_1 = require("./mappers/map_phrase");
const map_phrases_1 = require("./mappers/map_phrases");
const map_range_1 = require("./mappers/map_range");
const map_exists_1 = require("./mappers/map_exists");
const map_missing_1 = require("./mappers/map_missing");
const map_query_string_1 = require("./mappers/map_query_string");
const map_geo_bounding_box_1 = require("./mappers/map_geo_bounding_box");
const map_geo_polygon_1 = require("./mappers/map_geo_polygon");
const map_default_1 = require("./mappers/map_default");
const generate_mapping_chain_1 = require("./generate_mapping_chain");
function mapFilter(filter) {
    /** Mappers **/
    // Each mapper is a simple promise function that test if the mapper can
    // handle the mapping or not. If it handles it then it will resolve with
    // and object that has the key and value for the filter. Otherwise it will
    // reject it with the original filter. We had to go down the promise interface
    // because mapTerms and mapRange need access to the indexPatterns to format
    // the values and that's only available through the field formatters.
    // The mappers to apply. Each mapper will either return
    // a result object with a key and value attribute or
    // undefined. If undefined is return then the next
    // mapper will get the opportunity to map the filter.
    // To create a new mapper you just need to create a function
    // that either handles the mapping operation or not
    // and add it here. ProTip: These are executed in order listed
    const mappers = [
        map_spatial_filter_1.mapSpatialFilter,
        map_match_all_1.mapMatchAll,
        map_range_1.mapRange,
        map_phrase_1.mapPhrase,
        map_phrases_1.mapPhrases,
        map_exists_1.mapExists,
        map_missing_1.mapMissing,
        map_query_string_1.mapQueryString,
        map_geo_bounding_box_1.mapGeoBoundingBox,
        map_geo_polygon_1.mapGeoPolygon,
        map_default_1.mapDefault,
    ];
    const noop = () => {
        throw new Error('No mappings have been found for filter.');
    };
    // Create a chain of responsibility by reducing all the
    // mappers down into one function.
    const mapFn = lodash_1.reduceRight(mappers, (memo, map) => generate_mapping_chain_1.generateMappingChain(map, memo), noop);
    const mapped = mapFn(filter);
    // Map the filter into an object with the key and value exposed so it's
    // easier to work with in the template
    filter.meta = filter.meta || {};
    filter.meta.type = mapped.type;
    filter.meta.key = mapped.key;
    // Display value or formatter function.
    filter.meta.value = mapped.value;
    filter.meta.params = mapped.params;
    filter.meta.disabled = Boolean(filter.meta.disabled);
    filter.meta.negate = Boolean(filter.meta.negate);
    filter.meta.alias = filter.meta.alias || null;
    return filter;
}
exports.mapFilter = mapFilter;
