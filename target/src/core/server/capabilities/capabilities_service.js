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
exports.CapabilitiesService = void 0;
const merge_capabilities_1 = require("./merge_capabilities");
const resolve_capabilities_1 = require("./resolve_capabilities");
const routes_1 = require("./routes");
const defaultCapabilities = {
    navLinks: {},
    management: {},
    catalogue: {},
};
/** @internal */
class CapabilitiesService {
    constructor(core) {
        this.capabilitiesProviders = [];
        this.capabilitiesSwitchers = [];
        this.logger = core.logger.get('capabilities-service');
        this.resolveCapabilities = resolve_capabilities_1.getCapabilitiesResolver(() => merge_capabilities_1.mergeCapabilities(defaultCapabilities, ...this.capabilitiesProviders.map((provider) => provider())), () => this.capabilitiesSwitchers);
    }
    setup(setupDeps) {
        this.logger.debug('Setting up capabilities service');
        routes_1.registerRoutes(setupDeps.http, this.resolveCapabilities);
        return {
            registerProvider: (provider) => {
                this.capabilitiesProviders.push(provider);
            },
            registerSwitcher: (switcher) => {
                this.capabilitiesSwitchers.push(switcher);
            },
        };
    }
    start() {
        return {
            resolveCapabilities: (request) => this.resolveCapabilities(request, []),
        };
    }
}
exports.CapabilitiesService = CapabilitiesService;
