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
exports.Vis = void 0;
/**
 * @name Vis
 *
 * @description This class consists of aggs, params, listeners, title, and type.
 *  - Aggs: Instances of IAggConfig.
 *  - Params: The settings in the Options tab.
 *
 * Not to be confused with vislib/vis.js.
 */
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const persisted_state_1 = require("./persisted_state");
const services_1 = require("./services");
const getSearchSource = async (inputSearchSource, savedSearchId) => {
    const searchSource = inputSearchSource.createCopy();
    if (savedSearchId) {
        const savedSearch = await services_1.getSavedSearchLoader().get(savedSearchId);
        searchSource.setParent(savedSearch.searchSource);
    }
    searchSource.setField('size', 0);
    return searchSource;
};
class Vis {
    constructor(visType, visState = {}) {
        this.title = '';
        this.description = '';
        this.params = {};
        // Session state is for storing information that is transitory, and will not be saved with the visualization.
        // For instance, map bounds, which depends on the view port, browser window size, etc.
        this.sessionState = {};
        this.data = {};
        this.type = this.getType(visType);
        this.params = this.getParams(visState.params);
        this.uiState = new persisted_state_1.PersistedState(visState.uiState);
        this.id = visState.id;
    }
    getType(visType) {
        const type = services_1.getTypes().get(visType);
        if (!type) {
            const errorMessage = i18n_1.i18n.translate('visualizations.visualizationTypeInvalidMessage', {
                defaultMessage: 'Invalid visualization type "{visType}"',
                values: {
                    visType,
                },
            });
            throw new Error(errorMessage);
        }
        return type;
    }
    getParams(params) {
        return lodash_1.defaults({}, lodash_1.cloneDeep(params || {}), lodash_1.cloneDeep(this.type.visConfig.defaults || {}));
    }
    async setState(state) {
        let typeChanged = false;
        if (state.type && this.type.name !== state.type) {
            // @ts-ignore
            this.type = this.getType(state.type);
            typeChanged = true;
        }
        if (state.title !== undefined) {
            this.title = state.title;
        }
        if (state.description !== undefined) {
            this.description = state.description;
        }
        if (state.params || typeChanged) {
            this.params = this.getParams(state.params);
        }
        if (state.data && state.data.searchSource) {
            this.data.searchSource = await services_1.getSearch().searchSource.create(state.data.searchSource);
            this.data.indexPattern = this.data.searchSource.getField('index');
        }
        if (state.data && state.data.savedSearchId) {
            this.data.savedSearchId = state.data.savedSearchId;
            if (this.data.searchSource) {
                this.data.searchSource = await getSearchSource(this.data.searchSource, this.data.savedSearchId);
                this.data.indexPattern = this.data.searchSource.getField('index');
            }
        }
        if (state.data && (state.data.aggs || !this.data.aggs)) {
            const aggs = state.data.aggs ? lodash_1.cloneDeep(state.data.aggs) : [];
            const configStates = this.initializeDefaultsFromSchemas(aggs, this.type.schemas.all || []);
            if (!this.data.indexPattern) {
                if (aggs.length) {
                    const errorMessage = i18n_1.i18n.translate('visualizations.initializeWithoutIndexPatternErrorMessage', {
                        defaultMessage: 'Trying to initialize aggs without index pattern',
                    });
                    throw new Error(errorMessage);
                }
                return;
            }
            this.data.aggs = services_1.getAggs().createAggConfigs(this.data.indexPattern, configStates);
        }
    }
    clone() {
        const { data, ...restOfSerialized } = this.serialize();
        const vis = new Vis(this.type.name, restOfSerialized);
        vis.setState({ ...restOfSerialized, data: {} });
        const aggs = this.data.indexPattern
            ? services_1.getAggs().createAggConfigs(this.data.indexPattern, data.aggs)
            : undefined;
        vis.data = {
            ...this.data,
            aggs,
        };
        return vis;
    }
    serialize() {
        const aggs = this.data.aggs ? this.data.aggs.aggs.map((agg) => agg.toJSON()) : [];
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            type: this.type.name,
            params: lodash_1.cloneDeep(this.params),
            uiState: this.uiState.toJSON(),
            data: {
                aggs: aggs,
                searchSource: this.data.searchSource ? this.data.searchSource.getSerializedFields() : {},
                savedSearchId: this.data.savedSearchId,
            },
        };
    }
    toAST() {
        return this.type.toAST(this.params);
    }
    // deprecated
    isHierarchical() {
        if (lodash_1.isFunction(this.type.hierarchicalData)) {
            return !!this.type.hierarchicalData(this);
        }
        else {
            return !!this.type.hierarchicalData;
        }
    }
    initializeDefaultsFromSchemas(configStates, schemas) {
        // Set the defaults for any schema which has them. If the defaults
        // for some reason has more then the max only set the max number
        // of defaults (not sure why a someone define more...
        // but whatever). Also if a schema.name is already set then don't
        // set anything.
        const newConfigs = [...configStates];
        schemas
            .filter((schema) => Array.isArray(schema.defaults) && schema.defaults.length > 0)
            .filter((schema) => !configStates.find((agg) => agg.schema && agg.schema === schema.name))
            .forEach((schema) => {
            const defaultSchemaConfig = schema.defaults.slice(0, schema.max);
            defaultSchemaConfig.forEach((d) => newConfigs.push(d));
        });
        return newConfigs;
    }
}
exports.Vis = Vis;
