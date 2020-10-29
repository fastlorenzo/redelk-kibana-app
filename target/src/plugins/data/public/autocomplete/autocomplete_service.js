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
exports.AutocompleteService = void 0;
const value_suggestion_provider_1 = require("./providers/value_suggestion_provider");
class AutocompleteService {
    constructor(initializerContext) {
        this.querySuggestionProviders = new Map();
        this.addQuerySuggestionProvider = (language, provider) => {
            if (language && provider && this.autocompleteConfig.querySuggestions.enabled) {
                this.querySuggestionProviders.set(language, provider);
            }
        };
        this.getQuerySuggestions = (args) => {
            const { language } = args;
            const provider = this.querySuggestionProviders.get(language);
            if (provider) {
                return provider(args);
            }
        };
        this.hasQuerySuggestions = (language) => this.querySuggestionProviders.has(language);
        const { autocomplete } = initializerContext.config.get();
        this.autocompleteConfig = autocomplete;
    }
    /** @public **/
    setup(core) {
        this.getValueSuggestions = this.autocompleteConfig.valueSuggestions.enabled
            ? value_suggestion_provider_1.setupValueSuggestionProvider(core)
            : value_suggestion_provider_1.getEmptyValueSuggestions;
        return {
            addQuerySuggestionProvider: this.addQuerySuggestionProvider,
            /** @obsolete **/
            /** please use "getProvider" only from the start contract **/
            getQuerySuggestions: this.getQuerySuggestions,
        };
    }
    /** @public **/
    start() {
        return {
            getQuerySuggestions: this.getQuerySuggestions,
            hasQuerySuggestions: this.hasQuerySuggestions,
            getValueSuggestions: this.getValueSuggestions,
        };
    }
    /** @internal **/
    clearProviders() {
        this.querySuggestionProviders.clear();
    }
}
exports.AutocompleteService = AutocompleteService;
