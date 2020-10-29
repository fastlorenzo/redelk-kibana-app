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
exports.InjectedMetadataService = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("../../utils/");
/**
 * Provides access to the metadata that is injected by the
 * server into the page. The metadata is actually defined
 * in the entry file for the bundle containing the new platform
 * and is read from the DOM in most cases.
 *
 * @internal
 */
class InjectedMetadataService {
    constructor(params) {
        this.params = params;
        this.state = utils_1.deepFreeze(this.params.injectedMetadata);
    }
    start() {
        return this.setup();
    }
    setup() {
        return {
            getBasePath: () => {
                return this.state.basePath;
            },
            getServerBasePath: () => {
                return this.state.serverBasePath;
            },
            getKibanaVersion: () => {
                return this.state.version;
            },
            getCspConfig: () => {
                return this.state.csp;
            },
            getPlugins: () => {
                return this.state.uiPlugins;
            },
            getLegacyMode: () => {
                return this.state.legacyMode;
            },
            getLegacyMetadata: () => {
                return this.state.legacyMetadata;
            },
            getInjectedVar: (name, defaultValue) => {
                return lodash_1.get(this.state.vars, name, defaultValue);
            },
            getInjectedVars: () => {
                return this.state.vars;
            },
            getKibanaBuildNumber: () => {
                return this.state.buildNumber;
            },
            getKibanaBranch: () => {
                return this.state.branch;
            },
        };
    }
}
exports.InjectedMetadataService = InjectedMetadataService;
