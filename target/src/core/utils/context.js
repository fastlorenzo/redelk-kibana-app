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
exports.ContextContainer = void 0;
const lodash_1 = require("lodash");
const _1 = require(".");
/** @internal */
class ContextContainer {
    /**
     * @param pluginDependencies - A map of plugins to an array of their dependencies.
     */
    constructor(pluginDependencies, coreId) {
        this.pluginDependencies = pluginDependencies;
        this.coreId = coreId;
        /**
         * Used to map contexts to their providers and associated plugin. In registration order which is tightly coupled to
         * plugin load order.
         */
        this.contextProviders = new Map();
        this.registerContext = (source, contextName, provider) => {
            if (this.contextProviders.has(contextName)) {
                throw new Error(`Context provider for ${contextName} has already been registered.`);
            }
            if (source !== this.coreId && !this.pluginDependencies.has(source)) {
                throw new Error(`Cannot register context for unknown plugin: ${source.toString()}`);
            }
            this.contextProviders.set(contextName, { provider, source });
            this.contextNamesBySource.set(source, [
                ...(this.contextNamesBySource.get(source) || []),
                contextName,
            ]);
            return this;
        };
        this.createHandler = (source, handler) => {
            if (source !== this.coreId && !this.pluginDependencies.has(source)) {
                throw new Error(`Cannot create handler for unknown plugin: ${source.toString()}`);
            }
            return (async (...args) => {
                const context = await this.buildContext(source, ...args);
                return handler(context, ...args);
            });
        };
        this.contextNamesBySource = new Map([
            [coreId, []],
        ]);
    }
    async buildContext(source, ...contextArgs) {
        const contextsToBuild = new Set(this.getContextNamesForSource(source));
        return [...this.contextProviders]
            .sort(sortByCoreFirst(this.coreId))
            .filter(([contextName]) => contextsToBuild.has(contextName))
            .reduce(async (contextPromise, [contextName, { provider, source: providerSource }]) => {
            const resolvedContext = await contextPromise;
            // For the next provider, only expose the context available based on the dependencies of the plugin that
            // registered that provider.
            const exposedContext = _1.pick(resolvedContext, [
                ...this.getContextNamesForSource(providerSource),
            ]);
            return {
                ...resolvedContext,
                [contextName]: await provider(exposedContext, ...contextArgs),
            };
        }, Promise.resolve({}));
    }
    getContextNamesForSource(source) {
        if (source === this.coreId) {
            return this.getContextNamesForCore();
        }
        else {
            return this.getContextNamesForPluginId(source);
        }
    }
    getContextNamesForCore() {
        return new Set(this.contextNamesBySource.get(this.coreId));
    }
    getContextNamesForPluginId(pluginId) {
        // If the source is a plugin...
        const pluginDeps = this.pluginDependencies.get(pluginId);
        if (!pluginDeps) {
            // This case should never be hit, but let's be safe.
            throw new Error(`Cannot create context for unknown plugin: ${pluginId.toString()}`);
        }
        return new Set([
            // Core contexts
            ...this.contextNamesBySource.get(this.coreId),
            // Contexts source created
            ...(this.contextNamesBySource.get(pluginId) || []),
            // Contexts sources's dependencies created
            ...lodash_1.flatten(pluginDeps.map((p) => this.contextNamesBySource.get(p) || [])),
        ]);
    }
}
exports.ContextContainer = ContextContainer;
/** Sorts context provider pairs by core pairs first. */
const sortByCoreFirst = (coreId) => ([leftName, leftProvider], [rightName, rightProvider]) => {
    if (leftProvider.source === coreId) {
        return rightProvider.source === coreId ? 0 : -1;
    }
    else {
        return rightProvider.source === coreId ? 1 : 0;
    }
};
