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
exports.findLegacyPluginSpecs = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const find_plugin_specs_js_1 = require("../../../../legacy/plugin_discovery/find_plugin_specs.js");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const collect_ui_exports_1 = require("../../../../legacy/ui/ui_exports/collect_ui_exports");
const get_nav_links_1 = require("./get_nav_links");
async function findLegacyPluginSpecs(settings, loggerFactory, packageInfo) {
    const configToMutate = find_plugin_specs_js_1.defaultConfig(settings);
    const { pack$, invalidDirectoryError$, invalidPackError$, otherError$, deprecation$, invalidVersionSpec$, spec$, disabledSpec$, } = find_plugin_specs_js_1.findPluginSpecs(settings, configToMutate);
    const logger = loggerFactory.get('legacy-plugins');
    const log$ = rxjs_1.merge(pack$.pipe(operators_1.tap((definition) => {
        const path = definition.getPath();
        logger.debug(`Found plugin at ${path}`, { path });
    })), invalidDirectoryError$.pipe(operators_1.tap((error) => {
        logger.warn(`Unable to scan directory for plugins "${error.path}"`, {
            err: error,
            dir: error.path,
        });
    })), invalidPackError$.pipe(operators_1.tap((error) => {
        logger.warn(`Skipping non-plugin directory at ${error.path}`, {
            path: error.path,
        });
    })), otherError$.pipe(operators_1.tap((error) => {
        // rethrow unhandled errors, which will fail the server
        throw error;
    })), invalidVersionSpec$.pipe(operators_1.map((spec) => {
        const name = spec.getId();
        const pluginVersion = spec.getExpectedKibanaVersion();
        const kibanaVersion = packageInfo.version;
        return `Plugin "${name}" was disabled because it expected Kibana version "${pluginVersion}", and found "${kibanaVersion}".`;
    }), operators_1.distinct(), operators_1.tap((message) => {
        logger.warn(message);
    })), deprecation$.pipe(operators_1.tap(({ spec, message }) => {
        const deprecationLogger = loggerFactory.get('plugins', spec.getConfigPrefix(), 'config', 'deprecation');
        deprecationLogger.warn(message);
    })));
    const [disabledPluginSpecs, pluginSpecs] = await rxjs_1.forkJoin(disabledSpec$.pipe(operators_1.toArray()), spec$.pipe(operators_1.toArray()), log$.pipe(operators_1.toArray())).toPromise();
    const uiExports = collect_ui_exports_1.collectUiExports(pluginSpecs);
    const navLinks = get_nav_links_1.getNavLinks(uiExports, pluginSpecs);
    return {
        disabledPluginSpecs,
        pluginSpecs,
        pluginExtendedConfig: configToMutate,
        uiExports,
        navLinks,
    };
}
exports.findLegacyPluginSpecs = findLegacyPluginSpecs;
