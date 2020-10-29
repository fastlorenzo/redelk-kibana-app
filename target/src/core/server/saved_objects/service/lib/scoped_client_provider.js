"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedObjectsClientProvider = void 0;
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
const priority_collection_1 = require("./priority_collection");
/**
 * Provider for the Scoped Saved Objects Client.
 *
 * @internal
 */
class SavedObjectsClientProvider {
    constructor({ defaultClientFactory, typeRegistry, }) {
        this._wrapperFactories = new priority_collection_1.PriorityCollection();
        this._originalClientFactory = this._clientFactory = defaultClientFactory;
        this._typeRegistry = typeRegistry;
    }
    addClientWrapperFactory(priority, id, factory) {
        if (this._wrapperFactories.has((entry) => entry.id === id)) {
            throw new Error(`wrapper factory with id ${id} is already defined`);
        }
        this._wrapperFactories.add(priority, { id, factory });
    }
    setClientFactory(customClientFactory) {
        if (this._clientFactory !== this._originalClientFactory) {
            throw new Error(`custom client factory is already set, unable to replace the current one`);
        }
        this._clientFactory = customClientFactory;
    }
    getClient(request, { includedHiddenTypes, excludedWrappers = [] } = {}) {
        const client = this._clientFactory({
            request,
            includedHiddenTypes,
        });
        return this._wrapperFactories
            .toPrioritizedArray()
            .reduceRight((clientToWrap, { id, factory }) => {
            if (excludedWrappers.includes(id)) {
                return clientToWrap;
            }
            return factory({
                request,
                client: clientToWrap,
                typeRegistry: this._typeRegistry,
            });
        }, client);
    }
}
exports.SavedObjectsClientProvider = SavedObjectsClientProvider;
