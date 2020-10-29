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
exports.Env = void 0;
const path_1 = require("path");
// `require` is necessary for this to work inside x-pack code as well
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../../package.json');
class Env {
    /**
     * @internal
     */
    constructor(homeDir, options) {
        this.homeDir = homeDir;
        this.configDir = path_1.resolve(this.homeDir, 'config');
        this.binDir = path_1.resolve(this.homeDir, 'bin');
        this.logDir = path_1.resolve(this.homeDir, 'log');
        /**
         * BEWARE: this needs to stay roughly synchronized with the @kbn/optimizer
         * `packages/kbn-optimizer/src/optimizer_config.ts` determines the paths
         * that should be searched for plugins to build
         */
        this.pluginSearchPaths = [
            path_1.resolve(this.homeDir, 'src', 'plugins'),
            ...(options.cliArgs.oss ? [] : [path_1.resolve(this.homeDir, 'x-pack', 'plugins')]),
            path_1.resolve(this.homeDir, 'plugins'),
            ...(options.cliArgs.runExamples
                ? [path_1.resolve(this.homeDir, 'examples'), path_1.resolve(this.homeDir, 'x-pack', 'examples')]
                : []),
            path_1.resolve(this.homeDir, '..', 'kibana-extra'),
        ];
        this.cliArgs = Object.freeze(options.cliArgs);
        this.configs = Object.freeze(options.configs);
        this.isDevClusterMaster = options.isDevClusterMaster;
        const isDevMode = this.cliArgs.dev || this.cliArgs.envName === 'development';
        this.mode = Object.freeze({
            dev: isDevMode,
            name: isDevMode ? 'development' : 'production',
            prod: !isDevMode,
        });
        const isKibanaDistributable = Boolean(pkg.build && pkg.build.distributable === true);
        this.packageInfo = Object.freeze({
            branch: pkg.branch,
            buildNum: isKibanaDistributable ? pkg.build.number : Number.MAX_SAFE_INTEGER,
            buildSha: isKibanaDistributable ? pkg.build.sha : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            version: pkg.version,
            dist: isKibanaDistributable,
        });
    }
    /**
     * @internal
     */
    static createDefault(options) {
        const repoRoot = path_1.dirname(require.resolve('../../../../package.json'));
        return new Env(repoRoot, options);
    }
}
exports.Env = Env;
