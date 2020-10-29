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
exports.LegacyInternals = void 0;
const router_1 = require("../http/router");
const merge_vars_1 = require("./merge_vars");
/**
 * @internal
 * @deprecated
 */
class LegacyInternals {
    constructor(uiExports, config, server) {
        this.uiExports = uiExports;
        this.config = config;
        this.server = server;
        this.injectors = new Map();
    }
    get defaultVars() {
        if (this.cachedDefaultVars) {
            return this.cachedDefaultVars;
        }
        const { defaultInjectedVarProviders = [] } = this.uiExports;
        return (this.cachedDefaultVars = defaultInjectedVarProviders.reduce((vars, { fn, pluginSpec }) => merge_vars_1.mergeVars(vars, fn(this.server, pluginSpec.readConfigValue(this.config, []))), {}));
    }
    replaceVars(vars, request) {
        const { injectedVarsReplacers = [] } = this.uiExports;
        return injectedVarsReplacers.reduce(async (injected, replacer) => replacer(await injected, router_1.ensureRawRequest(request), this.server), Promise.resolve(vars));
    }
    injectUiAppVars(id, injector) {
        if (!this.injectors.has(id)) {
            this.injectors.set(id, new Set());
        }
        this.injectors.get(id).add(injector);
    }
    getInjectedUiAppVars(id) {
        return [...(this.injectors.get(id) || [])].reduce(async (promise, injector) => ({
            ...(await promise),
            ...(await injector()),
        }), Promise.resolve({}));
    }
    async getVars(id, request, injected = {}) {
        return this.replaceVars(merge_vars_1.mergeVars(this.defaultVars, await this.getInjectedUiAppVars(id), injected), request);
    }
}
exports.LegacyInternals = LegacyInternals;
