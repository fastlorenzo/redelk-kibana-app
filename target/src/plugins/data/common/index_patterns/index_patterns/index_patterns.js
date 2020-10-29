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
exports.IndexPatternsService = void 0;
const _1 = require(".");
const index_pattern_1 = require("./index_pattern");
const ensure_default_index_pattern_1 = require("./ensure_default_index_pattern");
const fields_1 = require("../fields");
const common_1 = require("../../../common");
const indexPatternCache = _1.createIndexPatternCache();
class IndexPatternsService {
    constructor({ uiSettings, savedObjectsClient, apiClient, fieldFormats, onNotification, onError, onUnsupportedTimePattern, onRedirectNoIndexPattern = () => { }, }) {
        this.getIds = async (refresh = false) => {
            if (!this.savedObjectsCache || refresh) {
                await this.refreshSavedObjectsCache();
            }
            if (!this.savedObjectsCache) {
                return [];
            }
            return this.savedObjectsCache.map((obj) => obj?.id);
        };
        this.getTitles = async (refresh = false) => {
            if (!this.savedObjectsCache || refresh) {
                await this.refreshSavedObjectsCache();
            }
            if (!this.savedObjectsCache) {
                return [];
            }
            return this.savedObjectsCache.map((obj) => obj?.attributes?.title);
        };
        this.getFields = async (fields, refresh = false) => {
            if (!this.savedObjectsCache || refresh) {
                await this.refreshSavedObjectsCache();
            }
            if (!this.savedObjectsCache) {
                return [];
            }
            return this.savedObjectsCache.map((obj) => {
                const result = {};
                fields.forEach((f) => (result[f] = obj[f] || obj?.attributes?.[f]));
                return result;
            });
        };
        this.getFieldsForTimePattern = (options = {}) => {
            return this.apiClient.getFieldsForTimePattern(options);
        };
        this.getFieldsForWildcard = (options = {}) => {
            return this.apiClient.getFieldsForWildcard(options);
        };
        this.clearCache = (id) => {
            this.savedObjectsCache = null;
            if (id) {
                indexPatternCache.clear(id);
            }
            else {
                indexPatternCache.clearAll();
            }
        };
        this.getCache = async () => {
            if (!this.savedObjectsCache) {
                await this.refreshSavedObjectsCache();
            }
            return this.savedObjectsCache;
        };
        this.getDefault = async () => {
            const defaultIndexPatternId = await this.config.get('defaultIndex');
            if (defaultIndexPatternId) {
                return await this.get(defaultIndexPatternId);
            }
            return null;
        };
        this.get = async (id) => {
            const cache = indexPatternCache.get(id);
            if (cache) {
                return cache;
            }
            const indexPattern = await this.make(id);
            return indexPatternCache.set(id, indexPattern);
        };
        this.apiClient = apiClient;
        this.config = uiSettings;
        this.savedObjectsClient = savedObjectsClient;
        this.fieldFormats = fieldFormats;
        this.onNotification = onNotification;
        this.onError = onError;
        this.onUnsupportedTimePattern = onUnsupportedTimePattern;
        this.ensureDefaultIndexPattern = ensure_default_index_pattern_1.createEnsureDefaultIndexPattern(uiSettings, onRedirectNoIndexPattern);
        this.createFieldList = fields_1.getIndexPatternFieldListCreator({
            fieldFormats,
            onNotification,
        });
        this.createField = (indexPattern, spec, shortDotsEnable) => {
            return new fields_1.Field(indexPattern, spec, shortDotsEnable, {
                fieldFormats,
                onNotification,
            });
        };
    }
    async refreshSavedObjectsCache() {
        this.savedObjectsCache = await this.savedObjectsClient.find({
            type: 'index-pattern',
            fields: ['title'],
            perPage: 10000,
        });
    }
    async specToIndexPattern(spec) {
        const shortDotsEnable = await this.config.get(common_1.UI_SETTINGS.SHORT_DOTS_ENABLE);
        const metaFields = await this.config.get(common_1.UI_SETTINGS.META_FIELDS);
        const uiSettingsValues = await this.config.getAll();
        const indexPattern = new index_pattern_1.IndexPattern(spec.id, {
            getConfig: (cfg) => this.config.get(cfg),
            savedObjectsClient: this.savedObjectsClient,
            apiClient: this.apiClient,
            patternCache: indexPatternCache,
            fieldFormats: this.fieldFormats,
            onNotification: this.onNotification,
            onError: this.onError,
            onUnsupportedTimePattern: this.onUnsupportedTimePattern,
            uiSettingsValues: { ...uiSettingsValues, shortDotsEnable, metaFields },
        });
        indexPattern.initFromSpec(spec);
        return indexPattern;
    }
    async make(id) {
        const shortDotsEnable = await this.config.get(common_1.UI_SETTINGS.SHORT_DOTS_ENABLE);
        const metaFields = await this.config.get(common_1.UI_SETTINGS.META_FIELDS);
        const uiSettingsValues = await this.config.getAll();
        const indexPattern = new index_pattern_1.IndexPattern(id, {
            getConfig: (cfg) => this.config.get(cfg),
            savedObjectsClient: this.savedObjectsClient,
            apiClient: this.apiClient,
            patternCache: indexPatternCache,
            fieldFormats: this.fieldFormats,
            onNotification: this.onNotification,
            onError: this.onError,
            onUnsupportedTimePattern: this.onUnsupportedTimePattern,
            uiSettingsValues: { ...uiSettingsValues, shortDotsEnable, metaFields },
        });
        return indexPattern.init();
    }
    /**
     * Deletes an index pattern from .kibana index
     * @param indexPatternId: Id of kibana Index Pattern to delete
     */
    async delete(indexPatternId) {
        indexPatternCache.clear(indexPatternId);
        return this.savedObjectsClient.delete('index-pattern', indexPatternId);
    }
}
exports.IndexPatternsService = IndexPatternsService;
