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
exports.IndexPattern = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importStar(require("lodash"));
const i18n_1 = require("@kbn/i18n");
const common_1 = require("../../../../kibana_utils/common");
const common_2 = require("../../../common");
const utils_1 = require("../utils");
const lib_1 = require("../lib");
const fields_1 = require("../fields");
const _fields_fetcher_1 = require("./_fields_fetcher");
const format_hit_1 = require("./format_hit");
const flatten_hit_1 = require("./flatten_hit");
const field_mapping_1 = require("../../field_mapping");
const MAX_ATTEMPTS_TO_RESOLVE_CONFLICTS = 3;
const savedObjectType = 'index-pattern';
class IndexPattern {
    constructor(id, { getConfig, savedObjectsClient, apiClient, patternCache, fieldFormats, onNotification, onError, onUnsupportedTimePattern, uiSettingsValues, }) {
        this.title = '';
        this.originalBody = {};
        this.shortDotsEnable = false;
        this.mapping = field_mapping_1.expandShorthand({
            title: common_2.ES_FIELD_TYPES.TEXT,
            timeFieldName: common_2.ES_FIELD_TYPES.KEYWORD,
            intervalName: common_2.ES_FIELD_TYPES.KEYWORD,
            fields: 'json',
            sourceFilters: 'json',
            fieldFormatMap: {
                type: common_2.ES_FIELD_TYPES.TEXT,
                _serialize: (map = {}) => {
                    const serialized = lodash_1.default.transform(map, this.serializeFieldFormatMap);
                    return lodash_1.default.isEmpty(serialized) ? undefined : JSON.stringify(serialized);
                },
                _deserialize: (map = '{}') => {
                    return lodash_1.default.mapValues(JSON.parse(map), (mapping) => {
                        return this.deserializeFieldFormatMap(mapping);
                    });
                },
            },
            type: common_2.ES_FIELD_TYPES.KEYWORD,
            typeMeta: 'json',
        });
        this.id = id;
        this.savedObjectsClient = savedObjectsClient;
        this.patternCache = patternCache;
        // instead of storing config we rather store the getter only as np uiSettingsClient has circular references
        // which cause problems when being consumed from angular
        this.getConfig = getConfig;
        this.fieldFormats = fieldFormats;
        this.onNotification = onNotification;
        this.onError = onError;
        this.onUnsupportedTimePattern = onUnsupportedTimePattern;
        this.uiSettingsValues = uiSettingsValues;
        this.shortDotsEnable = uiSettingsValues.shortDotsEnable;
        this.metaFields = uiSettingsValues.metaFields;
        this.createFieldList = fields_1.getIndexPatternFieldListCreator({
            fieldFormats,
            onNotification,
        });
        this.fields = this.createFieldList(this, [], this.shortDotsEnable);
        this.apiClient = apiClient;
        this.fieldsFetcher = _fields_fetcher_1.createFieldsFetcher(this, apiClient, uiSettingsValues.metaFields);
        this.flattenHit = flatten_hit_1.flattenHitWrapper(this, uiSettingsValues.metaFields);
        this.formatHit = format_hit_1.formatHitProvider(this, fieldFormats.getDefaultInstance(common_2.KBN_FIELD_TYPES.STRING));
        this.formatField = this.formatHit.formatField;
    }
    serializeFieldFormatMap(flat, format, field) {
        if (format && field) {
            flat[field] = format;
        }
    }
    deserializeFieldFormatMap(mapping) {
        const FieldFormat = this.fieldFormats.getType(mapping.id);
        return (FieldFormat &&
            new FieldFormat(mapping.params, (key) => this.uiSettingsValues[key]?.userValue || this.uiSettingsValues[key]?.value));
    }
    initFields(input) {
        const newValue = input || this.fields;
        this.fields = this.createFieldList(this, newValue, this.shortDotsEnable);
    }
    isFieldRefreshRequired() {
        if (!this.fields) {
            return true;
        }
        return this.fields.every((field) => {
            // See https://github.com/elastic/kibana/pull/8421
            const hasFieldCaps = 'aggregatable' in field && 'searchable' in field;
            // See https://github.com/elastic/kibana/pull/11969
            const hasDocValuesFlag = 'readFromDocValues' in field;
            return !hasFieldCaps || !hasDocValuesFlag;
        });
    }
    async indexFields(forceFieldRefresh = false) {
        if (!this.id) {
            return;
        }
        if (forceFieldRefresh || this.isFieldRefreshRequired()) {
            await this.refreshFields();
        }
        this.initFields();
    }
    initFromSpec(spec) {
        // create fieldFormatMap from field list
        const fieldFormatMap = {};
        if (lodash_1.default.isArray(spec.fields)) {
            spec.fields.forEach((field) => {
                if (field.format) {
                    fieldFormatMap[field.name] = { ...field.format };
                }
            });
        }
        this.version = spec.version;
        this.title = spec.title || '';
        this.timeFieldName = spec.timeFieldName;
        this.sourceFilters = spec.sourceFilters;
        // ignoring this because the same thing happens elsewhere but via _.assign
        // @ts-expect-error
        this.fields = spec.fields || [];
        this.typeMeta = spec.typeMeta;
        this.fieldFormatMap = lodash_1.default.mapValues(fieldFormatMap, (mapping) => {
            return this.deserializeFieldFormatMap(mapping);
        });
        this.initFields();
        return this;
    }
    async updateFromElasticSearch(response, forceFieldRefresh = false) {
        if (!response.found) {
            throw new common_1.SavedObjectNotFound(savedObjectType, this.id, 'management/kibana/indexPatterns');
        }
        lodash_1.default.forOwn(this.mapping, (fieldMapping, name) => {
            if (!fieldMapping._deserialize || !name) {
                return;
            }
            response[name] = fieldMapping._deserialize(response[name]);
        });
        // give index pattern all of the values
        lodash_1.default.assign(this, response);
        if (!this.title && this.id) {
            this.title = this.id;
        }
        this.version = response.version;
        if (this.isUnsupportedTimePattern()) {
            this.onUnsupportedTimePattern({
                id: this.id,
                title: this.title,
                index: this.getIndex(),
            });
        }
        return this.indexFields(forceFieldRefresh);
    }
    getComputedFields() {
        const scriptFields = {};
        if (!this.fields) {
            return {
                storedFields: ['*'],
                scriptFields,
                docvalueFields: [],
            };
        }
        // Date value returned in "_source" could be in any number of formats
        // Use a docvalue for each date field to ensure standardized formats when working with date fields
        // indexPattern.flattenHit will override "_source" values when the same field is also defined in "fields"
        const docvalueFields = lodash_1.reject(this.fields.getByType('date'), 'scripted').map((dateField) => {
            return {
                field: dateField.name,
                format: dateField.esTypes && dateField.esTypes.indexOf('date_nanos') !== -1
                    ? 'strict_date_time'
                    : 'date_time',
            };
        });
        lodash_1.each(this.getScriptedFields(), function (field) {
            scriptFields[field.name] = {
                script: {
                    source: field.script,
                    lang: field.lang,
                },
            };
        });
        return {
            storedFields: ['*'],
            scriptFields,
            docvalueFields,
        };
    }
    async init(forceFieldRefresh = false) {
        if (!this.id) {
            return this; // no id === no elasticsearch document
        }
        const savedObject = await this.savedObjectsClient.get(savedObjectType, this.id);
        const response = {
            version: savedObject.version,
            found: savedObject.version ? true : false,
            title: savedObject.attributes.title,
            timeFieldName: savedObject.attributes.timeFieldName,
            intervalName: savedObject.attributes.intervalName,
            fields: savedObject.attributes.fields,
            sourceFilters: savedObject.attributes.sourceFilters,
            fieldFormatMap: savedObject.attributes.fieldFormatMap,
            typeMeta: savedObject.attributes.typeMeta,
            type: savedObject.attributes.type,
        };
        // Do this before we attempt to update from ES since that call can potentially perform a save
        this.originalBody = this.prepBody();
        await this.updateFromElasticSearch(response, forceFieldRefresh);
        // Do it after to ensure we have the most up to date information
        this.originalBody = this.prepBody();
        return this;
    }
    migrate(newTitle) {
        return this.savedObjectsClient
            .update(savedObjectType, this.id, {
            title: newTitle,
            intervalName: null,
        }, {
            version: this.version,
        })
            .then(({ attributes: { title, intervalName } }) => {
            this.title = title;
            this.intervalName = intervalName;
        })
            .then(() => this);
    }
    toSpec() {
        return {
            id: this.id,
            version: this.version,
            title: this.title,
            timeFieldName: this.timeFieldName,
            sourceFilters: this.sourceFilters,
            fields: this.fields.toSpec(),
            typeMeta: this.typeMeta,
        };
    }
    // Get the source filtering configuration for that index.
    getSourceFiltering() {
        return {
            excludes: (this.sourceFilters && this.sourceFilters.map((filter) => filter.value)) || [],
        };
    }
    async addScriptedField(name, script, fieldType = 'string', lang) {
        const scriptedFields = this.getScriptedFields();
        const names = lodash_1.default.map(scriptedFields, 'name');
        if (lodash_1.default.includes(names, name)) {
            throw new common_1.DuplicateField(name);
        }
        this.fields.add(new fields_1.Field(this, {
            name,
            script,
            fieldType,
            scripted: true,
            lang,
            aggregatable: true,
            filterable: true,
            searchable: true,
        }, false, {
            fieldFormats: this.fieldFormats,
            onNotification: this.onNotification,
        }));
        await this.save();
    }
    removeScriptedField(field) {
        this.fields.remove(field);
        return this.save();
    }
    async popularizeField(fieldName, unit = 1) {
        /**
         * This function is just used by Discover and it's high likely to be removed in the near future
         * It doesn't use the save function to skip the error message that's displayed when
         * a user adds several columns in a higher frequency that the changes can be persisted to ES
         * resulting in 409 errors
         */
        if (!this.id)
            return;
        const field = this.fields.getByName(fieldName);
        if (!field) {
            return;
        }
        const count = Math.max((field.count || 0) + unit, 0);
        if (field.count === count) {
            return;
        }
        field.count = count;
        try {
            const res = await this.savedObjectsClient.update(savedObjectType, this.id, this.prepBody(), {
                version: this.version,
            });
            this.version = res.version;
        }
        catch (e) {
            // no need for an error message here
        }
    }
    getNonScriptedFields() {
        return lodash_1.default.filter(this.fields, { scripted: false });
    }
    getScriptedFields() {
        return lodash_1.default.filter(this.fields, { scripted: true });
    }
    getIndex() {
        if (!this.isUnsupportedTimePattern()) {
            return this.title;
        }
        // Take a time-based interval index pattern title (like [foo-]YYYY.MM.DD[-bar]) and turn it
        // into the actual index (like foo-*-bar) by replacing anything not inside square brackets
        // with a *.
        const regex = /\[[^\]]*]/g; // Matches text inside brackets
        const splits = this.title.split(regex); // e.g. ['', 'YYYY.MM.DD', ''] from the above example
        const matches = this.title.match(regex) || []; // e.g. ['[foo-]', '[-bar]'] from the above example
        return splits
            .map((split, i) => {
            const match = i >= matches.length ? '' : matches[i].replace(/[\[\]]/g, '');
            return `${split.length ? '*' : ''}${match}`;
        })
            .join('');
    }
    isUnsupportedTimePattern() {
        return !!this.intervalName;
    }
    isTimeBased() {
        return !!this.timeFieldName && (!this.fields || !!this.getTimeField());
    }
    isTimeNanosBased() {
        const timeField = this.getTimeField();
        return timeField && timeField.esTypes && timeField.esTypes.indexOf('date_nanos') !== -1;
    }
    isTimeBasedWildcard() {
        return this.isTimeBased() && this.isWildcard();
    }
    getTimeField() {
        if (!this.timeFieldName || !this.fields || !this.fields.getByName)
            return;
        return this.fields.getByName(this.timeFieldName);
    }
    getFieldByName(name) {
        if (!this.fields || !this.fields.getByName)
            return;
        return this.fields.getByName(name);
    }
    getAggregationRestrictions() {
        return this.typeMeta?.aggs;
    }
    isWildcard() {
        return lodash_1.default.includes(this.title, '*');
    }
    prepBody() {
        const body = {};
        // serialize json fields
        lodash_1.default.forOwn(this.mapping, (fieldMapping, fieldName) => {
            if (!fieldName || this[fieldName] == null)
                return;
            body[fieldName] = fieldMapping._serialize
                ? fieldMapping._serialize(this[fieldName])
                : this[fieldName];
        });
        return body;
    }
    async create(allowOverride = false) {
        const _create = async (duplicateId) => {
            if (duplicateId) {
                this.patternCache.clear(duplicateId);
                await this.savedObjectsClient.delete(savedObjectType, duplicateId);
            }
            const body = this.prepBody();
            const response = await this.savedObjectsClient.create(savedObjectType, body, { id: this.id });
            this.id = response.id;
            return response.id;
        };
        const potentialDuplicateByTitle = await utils_1.findByTitle(this.savedObjectsClient, this.title);
        // If there is potentially duplicate title, just create it
        if (!potentialDuplicateByTitle) {
            return await _create();
        }
        // We found a duplicate but we aren't allowing override, show the warn modal
        if (!allowOverride) {
            return false;
        }
        return await _create(potentialDuplicateByTitle.id);
    }
    async save(saveAttempts = 0) {
        if (!this.id)
            return;
        const body = this.prepBody();
        // What keys changed since they last pulled the index pattern
        const originalChangedKeys = Object.keys(body).filter((key) => body[key] !== this.originalBody[key]);
        return this.savedObjectsClient
            .update(savedObjectType, this.id, body, { version: this.version })
            .then((resp) => {
            this.id = resp.id;
            this.version = resp.version;
        })
            .catch((err) => {
            if (lodash_1.default.get(err, 'res.status') === 409 &&
                saveAttempts++ < MAX_ATTEMPTS_TO_RESOLVE_CONFLICTS) {
                const samePattern = new IndexPattern(this.id, {
                    getConfig: this.getConfig,
                    savedObjectsClient: this.savedObjectsClient,
                    apiClient: this.apiClient,
                    patternCache: this.patternCache,
                    fieldFormats: this.fieldFormats,
                    onNotification: this.onNotification,
                    onError: this.onError,
                    onUnsupportedTimePattern: this.onUnsupportedTimePattern,
                    uiSettingsValues: {
                        shortDotsEnable: this.shortDotsEnable,
                        metaFields: this.metaFields,
                    },
                });
                return samePattern.init().then(() => {
                    // What keys changed from now and what the server returned
                    const updatedBody = samePattern.prepBody();
                    // Build a list of changed keys from the server response
                    // and ensure we ignore the key if the server response
                    // is the same as the original response (since that is expected
                    // if we made a change in that key)
                    const serverChangedKeys = Object.keys(updatedBody).filter((key) => {
                        return updatedBody[key] !== body[key] && this.originalBody[key] !== updatedBody[key];
                    });
                    let unresolvedCollision = false;
                    for (const originalKey of originalChangedKeys) {
                        for (const serverKey of serverChangedKeys) {
                            if (originalKey === serverKey) {
                                unresolvedCollision = true;
                                break;
                            }
                        }
                    }
                    if (unresolvedCollision) {
                        const title = i18n_1.i18n.translate('data.indexPatterns.unableWriteLabel', {
                            defaultMessage: 'Unable to write index pattern! Refresh the page to get the most up to date changes for this index pattern.',
                        });
                        this.onNotification({ title, color: 'danger' });
                        throw err;
                    }
                    // Set the updated response on this object
                    serverChangedKeys.forEach((key) => {
                        this[key] = samePattern[key];
                    });
                    this.version = samePattern.version;
                    // Clear cache
                    this.patternCache.clear(this.id);
                    // Try the save again
                    return this.save(saveAttempts);
                });
            }
            throw err;
        });
    }
    async _fetchFields() {
        const fields = await this.fieldsFetcher.fetch(this);
        const scripted = this.getScriptedFields();
        const all = fields.concat(scripted);
        await this.initFields(all);
    }
    refreshFields() {
        return this._fetchFields()
            .then(() => this.save())
            .catch((err) => {
            // https://github.com/elastic/kibana/issues/9224
            // This call will attempt to remap fields from the matching
            // ES index which may not actually exist. In that scenario,
            // we still want to notify the user that there is a problem
            // but we do not want to potentially make any pages unusable
            // so do not rethrow the error here
            if (err instanceof lib_1.IndexPatternMissingIndices) {
                this.onNotification({ title: err.message, color: 'danger', iconType: 'alert' });
                return [];
            }
            this.onError(err, {
                title: i18n_1.i18n.translate('data.indexPatterns.fetchFieldErrorTitle', {
                    defaultMessage: 'Error fetching fields for index pattern {title} (ID: {id})',
                    values: {
                        id: this.id,
                        title: this.title,
                    },
                }),
            });
        });
    }
    toJSON() {
        return this.id;
    }
    toString() {
        return '' + this.toJSON();
    }
}
exports.IndexPattern = IndexPattern;
