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
exports.config = exports.Plugin = exports.plugin = exports.search = exports.indexPatterns = exports.fieldFormats = exports.esQuery = exports.esKuery = exports.esFilters = void 0;
const config_1 = require("../config");
const plugin_1 = require("./plugin");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return plugin_1.DataServerPlugin; } });
const common_1 = require("../common");
/*
 * Filter helper namespace:
 */
exports.esFilters = {
    buildQueryFilter: common_1.buildQueryFilter,
    buildCustomFilter: common_1.buildCustomFilter,
    buildEmptyFilter: common_1.buildEmptyFilter,
    buildExistsFilter: common_1.buildExistsFilter,
    buildFilter: common_1.buildFilter,
    buildPhraseFilter: common_1.buildPhraseFilter,
    buildPhrasesFilter: common_1.buildPhrasesFilter,
    buildRangeFilter: common_1.buildRangeFilter,
    isFilterDisabled: common_1.isFilterDisabled,
};
/*
 * esQuery and esKuery:
 */
const common_2 = require("../common");
exports.esKuery = {
    nodeTypes: common_2.nodeTypes,
    fromKueryExpression: common_2.fromKueryExpression,
    toElasticsearchQuery: common_2.toElasticsearchQuery,
};
exports.esQuery = {
    buildQueryFromFilters: common_2.buildQueryFromFilters,
    getEsQueryConfig: common_2.getEsQueryConfig,
    buildEsQuery: common_2.buildEsQuery,
};
/*
 * Field Formats:
 */
const field_formats_1 = require("../common/field_formats");
exports.fieldFormats = {
    FieldFormatsRegistry: field_formats_1.FieldFormatsRegistry,
    FieldFormat: field_formats_1.FieldFormat,
    BoolFormat: field_formats_1.BoolFormat,
    BytesFormat: field_formats_1.BytesFormat,
    ColorFormat: field_formats_1.ColorFormat,
    DurationFormat: field_formats_1.DurationFormat,
    IpFormat: field_formats_1.IpFormat,
    NumberFormat: field_formats_1.NumberFormat,
    PercentFormat: field_formats_1.PercentFormat,
    RelativeDateFormat: field_formats_1.RelativeDateFormat,
    SourceFormat: field_formats_1.SourceFormat,
    StaticLookupFormat: field_formats_1.StaticLookupFormat,
    UrlFormat: field_formats_1.UrlFormat,
    StringFormat: field_formats_1.StringFormat,
    TruncateFormat: field_formats_1.TruncateFormat,
};
/*
 * Index patterns:
 */
const common_3 = require("../common");
exports.indexPatterns = {
    isFilterable: common_3.isFilterable,
    isNestedField: common_3.isNestedField,
};
var index_patterns_1 = require("./index_patterns");
Object.defineProperty(exports, "IndexPatternsFetcher", { enumerable: true, get: function () { return index_patterns_1.IndexPatternsFetcher; } });
Object.defineProperty(exports, "shouldReadFieldFromDocValues", { enumerable: true, get: function () { return index_patterns_1.shouldReadFieldFromDocValues; } });
var common_4 = require("../common");
Object.defineProperty(exports, "ES_FIELD_TYPES", { enumerable: true, get: function () { return common_4.ES_FIELD_TYPES; } });
Object.defineProperty(exports, "KBN_FIELD_TYPES", { enumerable: true, get: function () { return common_4.KBN_FIELD_TYPES; } });
Object.defineProperty(exports, "UI_SETTINGS", { enumerable: true, get: function () { return common_4.UI_SETTINGS; } });
/**
 * Search
 */
const common_5 = require("../common");
var search_1 = require("./search");
Object.defineProperty(exports, "getDefaultSearchParams", { enumerable: true, get: function () { return search_1.getDefaultSearchParams; } });
Object.defineProperty(exports, "getTotalLoaded", { enumerable: true, get: function () { return search_1.getTotalLoaded; } });
Object.defineProperty(exports, "usageProvider", { enumerable: true, get: function () { return search_1.usageProvider; } });
// Search namespace
exports.search = {
    aggs: {
        dateHistogramInterval: common_5.dateHistogramInterval,
        InvalidEsCalendarIntervalError: common_5.InvalidEsCalendarIntervalError,
        InvalidEsIntervalFormatError: common_5.InvalidEsIntervalFormatError,
        Ipv4Address: common_5.Ipv4Address,
        isValidEsInterval: common_5.isValidEsInterval,
        isValidInterval: common_5.isValidInterval,
        parseEsInterval: common_5.parseEsInterval,
        parseInterval: common_5.parseInterval,
        toAbsoluteDates: common_5.toAbsoluteDates,
    },
};
/**
 * Types to be shared externally
 * @public
 */
var common_6 = require("../common");
// kbn field types
Object.defineProperty(exports, "castEsToKbnFieldTypeName", { enumerable: true, get: function () { return common_6.castEsToKbnFieldTypeName; } });
Object.defineProperty(exports, "getTime", { enumerable: true, get: function () { return common_6.getTime; } });
// utils
Object.defineProperty(exports, "parseInterval", { enumerable: true, get: function () { return common_6.parseInterval; } });
/**
 * Static code to be shared externally
 * @public
 */
function plugin(initializerContext) {
    return new plugin_1.DataServerPlugin(initializerContext);
}
exports.plugin = plugin;
exports.config = {
    exposeToBrowser: {
        autocomplete: true,
    },
    schema: config_1.configSchema,
};
