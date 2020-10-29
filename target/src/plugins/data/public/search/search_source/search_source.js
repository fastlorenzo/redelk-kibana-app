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
exports.SearchSource = void 0;
/**
 * @name SearchSource
 *
 * @description A promise-based stream of search results that can inherit from other search sources.
 *
 * Because filters/queries in Kibana have different levels of persistence and come from different
 * places, it is important to keep track of where filters come from for when they are saved back to
 * the savedObject store in the Kibana index. To do this, we create trees of searchSource objects
 * that can have associated query parameters (index, query, filter, etc) which can also inherit from
 * other searchSource objects.
 *
 * At query time, all of the searchSource objects that have subscribers are "flattened", at which
 * point the query params from the searchSource are collected while traversing up the inheritance
 * chain. At each link in the chain a decision about how to merge the query params is made until a
 * single set of query parameters is created for each active searchSource (a searchSource with
 * subscribers).
 *
 * That set of query parameters is then sent to elasticsearch. This is how the filter hierarchy
 * works in Kibana.
 *
 * Visualize, starting from a new search:
 *
 *  - the `savedVis.searchSource` is set as the `appSearchSource`.
 *  - The `savedVis.searchSource` would normally inherit from the `appSearchSource`, but now it is
 *    upgraded to inherit from the `rootSearchSource`.
 *  - Any interaction with the visualization will still apply filters to the `appSearchSource`, so
 *    they will be stored directly on the `savedVis.searchSource`.
 *  - Any interaction with the time filter will be written to the `rootSearchSource`, so those
 *    filters will not be saved by the `savedVis`.
 *  - When the `savedVis` is saved to elasticsearch, it takes with it all the filters that are
 *    defined on it directly, but none of the ones that it inherits from other places.
 *
 * Visualize, starting from an existing search:
 *
 *  - The `savedVis` loads the `savedSearch` on which it is built.
 *  - The `savedVis.searchSource` is set to inherit from the `saveSearch.searchSource` and set as
 *    the `appSearchSource`.
 *  - The `savedSearch.searchSource`, is set to inherit from the `rootSearchSource`.
 *  - Then the `savedVis` is written to elasticsearch it will be flattened and only include the
 *    filters created in the visualize application and will reconnect the filters from the
 *    `savedSearch` at runtime to prevent losing the relationship
 *
 * Dashboard search sources:
 *
 *  - Each panel in a dashboard has a search source.
 *  - The `savedDashboard` also has a searchsource, and it is set as the `appSearchSource`.
 *  - Each panel's search source inherits from the `appSearchSource`, meaning that they inherit from
 *    the dashboard search source.
 *  - When a filter is added to the search box, or via a visualization, it is written to the
 *    `appSearchSource`.
 */
const safer_lodash_set_1 = require("@elastic/safer-lodash-set");
const lodash_1 = require("lodash");
const operators_1 = require("rxjs/operators");
const normalize_sort_request_1 = require("./normalize_sort_request");
const filter_docvalue_fields_1 = require("./filter_docvalue_fields");
const public_1 = require("../../../../kibana_utils/public");
const fetch_1 = require("../fetch");
const common_1 = require("../../../common");
const field_formats_1 = require("../../../common/field_formats");
const legacy_1 = require("../legacy");
const extract_references_1 = require("./extract_references");
/** @public **/
class SearchSource {
    constructor(fields = {}, dependencies) {
        this.id = lodash_1.uniqueId('data_source');
        this.requestStartHandlers = [];
        this.inheritOptions = {};
        this.history = [];
        this.fields = fields;
        this.dependencies = dependencies;
    }
    /** ***
     * PUBLIC API
     *****/
    setPreferredSearchStrategyId(searchStrategyId) {
        this.searchStrategyId = searchStrategyId;
    }
    setFields(newFields) {
        this.fields = newFields;
        return this;
    }
    setField(field, value) {
        if (value == null) {
            delete this.fields[field];
        }
        else {
            this.fields[field] = value;
        }
        return this;
    }
    getId() {
        return this.id;
    }
    getFields() {
        return { ...this.fields };
    }
    /**
     * Get fields from the fields
     */
    getField(field, recurse = true) {
        if (!recurse || this.fields[field] !== void 0) {
            return this.fields[field];
        }
        const parent = this.getParent();
        return parent && parent.getField(field);
    }
    /**
     * Get the field from our own fields, don't traverse up the chain
     */
    getOwnField(field) {
        return this.getField(field, false);
    }
    create() {
        return new SearchSource({}, this.dependencies);
    }
    createCopy() {
        const newSearchSource = new SearchSource({}, this.dependencies);
        newSearchSource.setFields({ ...this.fields });
        // when serializing the internal fields we lose the internal classes used in the index
        // pattern, so we have to set it again to workaround this behavior
        newSearchSource.setField('index', this.getField('index'));
        newSearchSource.setParent(this.getParent());
        return newSearchSource;
    }
    createChild(options = {}) {
        const childSearchSource = new SearchSource({}, this.dependencies);
        childSearchSource.setParent(this, options);
        return childSearchSource;
    }
    /**
     * Set a searchSource that this source should inherit from
     * @param  {SearchSource} parent - the parent searchSource
     * @param  {SearchSourceOptions} options - the inherit options
     * @return {this} - chainable
     */
    setParent(parent, options = {}) {
        this.parent = parent;
        this.inheritOptions = options;
        return this;
    }
    /**
     * Get the parent of this SearchSource
     * @return {undefined|searchSource}
     */
    getParent() {
        return this.parent;
    }
    /**
     * Run a search using the search service
     * @return {Observable<SearchResponse<unknown>>}
     */
    fetch$(searchRequest, signal) {
        const { search, injectedMetadata, uiSettings } = this.dependencies;
        const params = fetch_1.getSearchParamsFromRequest(searchRequest, {
            injectedMetadata,
            uiSettings,
        });
        return search({ params, indexType: searchRequest.indexType }, { signal }).pipe(operators_1.map(({ rawResponse }) => fetch_1.handleResponse(searchRequest, rawResponse)));
    }
    /**
     * Run a search using the search service
     * @return {Promise<SearchResponse<unknown>>}
     */
    async legacyFetch(searchRequest, options) {
        const { injectedMetadata, legacySearch, uiSettings } = this.dependencies;
        const esShardTimeout = injectedMetadata.getInjectedVar('esShardTimeout');
        return await legacy_1.fetchSoon(searchRequest, {
            ...(this.searchStrategyId && { searchStrategyId: this.searchStrategyId }),
            ...options,
        }, {
            legacySearchService: legacySearch,
            config: uiSettings,
            esShardTimeout,
        });
    }
    /**
     * Fetch this source and reject the returned Promise on error
     *
     * @async
     */
    async fetch(options = {}) {
        const { uiSettings } = this.dependencies;
        await this.requestIsStarting(options);
        const searchRequest = await this.flatten();
        this.history = [searchRequest];
        let response;
        if (uiSettings.get(common_1.UI_SETTINGS.COURIER_BATCH_SEARCHES)) {
            response = await this.legacyFetch(searchRequest, options);
        }
        else {
            response = this.fetch$(searchRequest, options.abortSignal).toPromise();
        }
        if (response.error) {
            throw new fetch_1.RequestFailure(null, response);
        }
        return response;
    }
    /**
     *  Add a handler that will be notified whenever requests start
     *  @param  {Function} handler
     *  @return {undefined}
     */
    onRequestStart(handler) {
        this.requestStartHandlers.push(handler);
    }
    async getSearchRequestBody() {
        const searchRequest = await this.flatten();
        return searchRequest.body;
    }
    /**
     * Completely destroy the SearchSource.
     * @return {undefined}
     */
    destroy() {
        this.requestStartHandlers.length = 0;
    }
    /** ****
     * PRIVATE APIS
     ******/
    /**
     *  Called by requests of this search source when they are started
     *  @param options
     *  @return {Promise<undefined>}
     */
    requestIsStarting(options = {}) {
        const handlers = [...this.requestStartHandlers];
        // If callParentStartHandlers has been set to true, we also call all
        // handlers of parent search sources.
        if (this.inheritOptions.callParentStartHandlers) {
            let searchSource = this.getParent();
            while (searchSource) {
                handlers.push(...searchSource.requestStartHandlers);
                searchSource = searchSource.getParent();
            }
        }
        return Promise.all(handlers.map((fn) => fn(this, options)));
    }
    /**
     * Used to merge properties into the data within ._flatten().
     * The data is passed in and modified by the function
     *
     * @param  {object} data - the current merged data
     * @param  {*} val - the value at `key`
     * @param  {*} key - The key of `val`
     * @return {undefined}
     */
    mergeProp(data, val, key) {
        val = typeof val === 'function' ? val(this) : val;
        if (val == null || !key)
            return;
        const addToRoot = (rootKey, value) => {
            data[rootKey] = value;
        };
        /**
         * Add the key and val to the body of the request
         */
        const addToBody = (bodyKey, value) => {
            // ignore if we already have a value
            if (data.body[bodyKey] == null) {
                data.body[bodyKey] = value;
            }
        };
        const { uiSettings } = this.dependencies;
        switch (key) {
            case 'filter':
                return addToRoot('filters', (data.filters || []).concat(val));
            case 'query':
                return addToRoot(key, (data[key] || []).concat(val));
            case 'fields':
                const fields = lodash_1.uniq((data[key] || []).concat(val));
                return addToRoot(key, fields);
            case 'index':
            case 'type':
            case 'highlightAll':
                return key && data[key] == null && addToRoot(key, val);
            case 'searchAfter':
                return addToBody('search_after', val);
            case 'source':
                return addToBody('_source', val);
            case 'sort':
                const sort = normalize_sort_request_1.normalizeSortRequest(val, this.getField('index'), uiSettings.get(common_1.UI_SETTINGS.SORT_OPTIONS));
                return addToBody(key, sort);
            default:
                return addToBody(key, val);
        }
    }
    /**
     * Walk the inheritance chain of a source and return its
     * flat representation (taking into account merging rules)
     * @returns {Promise}
     * @resolved {Object|null} - the flat data of the SearchSource
     */
    mergeProps(root = this, searchRequest = { body: {} }) {
        Object.entries(this.fields).forEach(([key, value]) => {
            this.mergeProp(searchRequest, value, key);
        });
        if (this.parent) {
            this.parent.mergeProps(root, searchRequest);
        }
        return searchRequest;
    }
    getIndexType(index) {
        if (this.searchStrategyId) {
            return this.searchStrategyId === 'default' ? undefined : this.searchStrategyId;
        }
        else {
            return index?.type;
        }
    }
    flatten() {
        const searchRequest = this.mergeProps();
        searchRequest.body = searchRequest.body || {};
        const { body, index, fields, query, filters, highlightAll } = searchRequest;
        searchRequest.indexType = this.getIndexType(index);
        const computedFields = index ? index.getComputedFields() : {};
        body.stored_fields = computedFields.storedFields;
        body.script_fields = body.script_fields || {};
        lodash_1.extend(body.script_fields, computedFields.scriptFields);
        const defaultDocValueFields = computedFields.docvalueFields
            ? computedFields.docvalueFields
            : [];
        body.docvalue_fields = body.docvalue_fields || defaultDocValueFields;
        if (!body.hasOwnProperty('_source') && index) {
            body._source = index.getSourceFiltering();
        }
        const { uiSettings } = this.dependencies;
        if (body._source) {
            // exclude source fields for this index pattern specified by the user
            const filter = public_1.fieldWildcardFilter(body._source.excludes, uiSettings.get(common_1.UI_SETTINGS.META_FIELDS));
            body.docvalue_fields = body.docvalue_fields.filter((docvalueField) => filter(docvalueField.field));
        }
        // if we only want to search for certain fields
        if (fields) {
            // filter out the docvalue_fields, and script_fields to only include those that we are concerned with
            body.docvalue_fields = filter_docvalue_fields_1.filterDocvalueFields(body.docvalue_fields, fields);
            body.script_fields = lodash_1.pick(body.script_fields, fields);
            // request the remaining fields from both stored_fields and _source
            const remainingFields = lodash_1.difference(fields, lodash_1.keys(body.script_fields));
            body.stored_fields = remainingFields;
            safer_lodash_set_1.setWith(body, '_source.includes', remainingFields, (nsValue) => lodash_1.isObject(nsValue) ? {} : nsValue);
        }
        const esQueryConfigs = common_1.getEsQueryConfig(uiSettings);
        body.query = common_1.buildEsQuery(index, query, filters, esQueryConfigs);
        if (highlightAll && body.query) {
            body.highlight = field_formats_1.getHighlightRequest(body.query, uiSettings.get(common_1.UI_SETTINGS.DOC_HIGHLIGHT));
            delete searchRequest.highlightAll;
        }
        return searchRequest;
    }
    getSerializedFields() {
        const { filter: originalFilters, ...searchSourceFields } = lodash_1.omit(this.getFields(), [
            'sort',
            'size',
        ]);
        let serializedSearchSourceFields = {
            ...searchSourceFields,
            index: (searchSourceFields.index ? searchSourceFields.index.id : undefined),
        };
        if (originalFilters) {
            const filters = this.getFilters(originalFilters);
            serializedSearchSourceFields = {
                ...serializedSearchSourceFields,
                filter: filters,
            };
        }
        return serializedSearchSourceFields;
    }
    /**
     * Serializes the instance to a JSON string and a set of referenced objects.
     * Use this method to get a representation of the search source which can be stored in a saved object.
     *
     * The references returned by this function can be mixed with other references in the same object,
     * however make sure there are no name-collisions. The references will be named `kibanaSavedObjectMeta.searchSourceJSON.index`
     * and `kibanaSavedObjectMeta.searchSourceJSON.filter[<number>].meta.index`.
     *
     * Using `createSearchSource`, the instance can be re-created.
     * @public */
    serialize() {
        const [searchSourceFields, references] = extract_references_1.extractReferences(this.getSerializedFields());
        return { searchSourceJSON: JSON.stringify(searchSourceFields), references };
    }
    getFilters(filterField) {
        if (!filterField) {
            return [];
        }
        if (Array.isArray(filterField)) {
            return filterField;
        }
        if (lodash_1.isFunction(filterField)) {
            return this.getFilters(filterField());
        }
        return [filterField];
    }
}
exports.SearchSource = SearchSource;
