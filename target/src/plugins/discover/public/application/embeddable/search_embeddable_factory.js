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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEmbeddableFactory = void 0;
const i18n_1 = require("@kbn/i18n");
const kibana_services_1 = require("../../kibana_services");
const public_1 = require("../../../../embeddable/public");
const constants_1 = require("./constants");
class SearchEmbeddableFactory {
    constructor(getStartServices, getInjector) {
        this.getStartServices = getStartServices;
        this.type = constants_1.SEARCH_EMBEDDABLE_TYPE;
        this.savedObjectMetaData = {
            name: i18n_1.i18n.translate('discover.savedSearch.savedObjectName', {
                defaultMessage: 'Saved search',
            }),
            type: 'search',
            getIconForSavedObject: () => 'search',
        };
        this.isEditable = async () => {
            return (await this.getStartServices()).isEditable();
        };
        this.createFromSavedObject = async (savedObjectId, input, parent) => {
            if (!this.$injector) {
                this.$injector = await this.getInjector();
            }
            const $injector = this.$injector;
            const $compile = $injector.get('$compile');
            const $rootScope = $injector.get('$rootScope');
            const filterManager = kibana_services_1.getServices().filterManager;
            const url = await kibana_services_1.getServices().getSavedSearchUrlById(savedObjectId);
            const editUrl = kibana_services_1.getServices().addBasePath(`/app/discover${url}`);
            try {
                const savedObject = await kibana_services_1.getServices().getSavedSearchById(savedObjectId);
                const indexPattern = savedObject.searchSource.getField('index');
                const { executeTriggerActions } = await this.getStartServices();
                const { SearchEmbeddable: SearchEmbeddableClass } = await Promise.resolve().then(() => __importStar(require('./search_embeddable')));
                return new SearchEmbeddableClass({
                    savedSearch: savedObject,
                    $rootScope,
                    $compile,
                    editUrl,
                    editPath: url,
                    filterManager,
                    editable: kibana_services_1.getServices().capabilities.discover.save,
                    indexPatterns: indexPattern ? [indexPattern] : [],
                }, input, executeTriggerActions, parent);
            }
            catch (e) {
                console.error(e); // eslint-disable-line no-console
                return new public_1.ErrorEmbeddable(e, input, parent);
            }
        };
        this.$injector = null;
        this.getInjector = getInjector;
    }
    canCreateNew() {
        return false;
    }
    getDisplayName() {
        return i18n_1.i18n.translate('discover.embeddable.search.displayName', {
            defaultMessage: 'search',
        });
    }
    async create(input) {
        return new public_1.ErrorEmbeddable('Saved searches can only be created from a saved object', input);
    }
}
exports.SearchEmbeddableFactory = SearchEmbeddableFactory;
