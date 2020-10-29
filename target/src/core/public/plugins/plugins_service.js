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
exports.PluginsService = void 0;
const plugin_1 = require("./plugin");
const plugin_context_1 = require("./plugin_context");
const utils_1 = require("../../utils");
const Sec = 1000;
/**
 * Service responsible for loading plugin bundles, initializing plugins, and managing the lifecycle
 * of all plugins.
 *
 * @internal
 */
class PluginsService {
    constructor(coreContext, plugins) {
        this.coreContext = coreContext;
        /** Plugin wrappers in topological order. */
        this.plugins = new Map();
        this.pluginDependencies = new Map();
        this.satupPlugins = [];
        // Generate opaque ids
        const opaqueIds = new Map(plugins.map((p) => [p.id, Symbol(p.id)]));
        // Setup dependency map and plugin wrappers
        plugins.forEach(({ id, plugin, config = {} }) => {
            // Setup map of dependencies
            this.pluginDependencies.set(id, [
                ...plugin.requiredPlugins,
                ...plugin.optionalPlugins.filter((optPlugin) => opaqueIds.has(optPlugin)),
            ]);
            // Construct plugin wrappers, depending on the topological order set by the server.
            this.plugins.set(id, new plugin_1.PluginWrapper(plugin, opaqueIds.get(id), plugin_context_1.createPluginInitializerContext(this.coreContext, opaqueIds.get(id), plugin, config)));
        });
    }
    getOpaqueIds() {
        // Return dependency map of opaque ids
        return new Map([...this.pluginDependencies].map(([id, deps]) => [
            this.plugins.get(id).opaqueId,
            deps.map((depId) => this.plugins.get(depId).opaqueId),
        ]));
    }
    async setup(deps) {
        // Setup each plugin with required and optional plugin contracts
        const contracts = new Map();
        for (const [pluginName, plugin] of this.plugins.entries()) {
            const pluginDepContracts = [...this.pluginDependencies.get(pluginName)].reduce((depContracts, dependencyName) => {
                // Only set if present. Could be absent if plugin does not have client-side code or is a
                // missing optional plugin.
                if (contracts.has(dependencyName)) {
                    depContracts[dependencyName] = contracts.get(dependencyName);
                }
                return depContracts;
            }, {});
            const contract = await utils_1.withTimeout({
                promise: plugin.setup(plugin_context_1.createPluginSetupContext(this.coreContext, deps, plugin), pluginDepContracts),
                timeout: 30 * Sec,
                errorMessage: `Setup lifecycle of "${pluginName}" plugin wasn't completed in 30sec. Consider disabling the plugin and re-start.`,
            });
            contracts.set(pluginName, contract);
            this.satupPlugins.push(pluginName);
        }
        // Expose setup contracts
        return { contracts };
    }
    async start(deps) {
        // Setup each plugin with required and optional plugin contracts
        const contracts = new Map();
        for (const [pluginName, plugin] of this.plugins.entries()) {
            const pluginDepContracts = [...this.pluginDependencies.get(pluginName)].reduce((depContracts, dependencyName) => {
                // Only set if present. Could be absent if plugin does not have client-side code or is a
                // missing optional plugin.
                if (contracts.has(dependencyName)) {
                    depContracts[dependencyName] = contracts.get(dependencyName);
                }
                return depContracts;
            }, {});
            const contract = await utils_1.withTimeout({
                promise: plugin.start(plugin_context_1.createPluginStartContext(this.coreContext, deps, plugin), pluginDepContracts),
                timeout: 30 * Sec,
                errorMessage: `Start lifecycle of "${pluginName}" plugin wasn't completed in 30sec. Consider disabling the plugin and re-start.`,
            });
            contracts.set(pluginName, contract);
        }
        // Expose start contracts
        return { contracts };
    }
    async stop() {
        // Stop plugins in reverse topological order.
        for (const pluginName of this.satupPlugins.reverse()) {
            this.plugins.get(pluginName).stop();
        }
    }
}
exports.PluginsService = PluginsService;
