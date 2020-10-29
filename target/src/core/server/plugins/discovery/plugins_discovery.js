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
exports.discover = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const plugin_1 = require("../plugin");
const plugin_context_1 = require("../plugin_context");
const plugin_discovery_error_1 = require("./plugin_discovery_error");
const plugin_manifest_parser_1 = require("./plugin_manifest_parser");
const fsReadDir$ = rxjs_1.bindNodeCallback(fs_1.readdir);
const fsStat$ = rxjs_1.bindNodeCallback(fs_1.stat);
const maxScanDepth = 5;
/**
 * Tries to discover all possible plugins based on the provided plugin config.
 * Discovery result consists of two separate streams, the one (`plugin$`) is
 * for the successfully discovered plugins and the other one (`error$`) is for
 * all the errors that occurred during discovery process.
 *
 * @param config Plugin config instance.
 * @param coreContext Kibana core values.
 * @internal
 */
function discover(config, coreContext) {
    const log = coreContext.logger.get('plugins-discovery');
    log.debug('Discovering plugins...');
    if (config.additionalPluginPaths.length && coreContext.env.mode.dev) {
        log.warn(`Explicit plugin paths [${config.additionalPluginPaths}] should only be used in development. Relative imports may not work properly in production.`);
    }
    const discoveryResults$ = rxjs_1.merge(rxjs_1.from(config.additionalPluginPaths), processPluginSearchPaths$(config.pluginSearchPaths, log)).pipe(operators_1.mergeMap((pluginPathOrError) => {
        return typeof pluginPathOrError === 'string'
            ? createPlugin$(pluginPathOrError, log, coreContext)
            : [pluginPathOrError];
    }), operators_1.shareReplay());
    return {
        plugin$: discoveryResults$.pipe(operators_1.filter((entry) => entry instanceof plugin_1.PluginWrapper)),
        error$: discoveryResults$.pipe(operators_1.filter((entry) => !(entry instanceof plugin_1.PluginWrapper))),
    };
}
exports.discover = discover;
/**
 * Recursively iterates over every plugin search path and returns a merged stream of all
 * sub-directories containing a manifest file. If directory cannot be read or it's impossible to get stat
 * for any of the nested entries then error is added into the stream instead.
 *
 * @param pluginDirs List of the top-level directories to process.
 * @param log Plugin discovery logger instance.
 */
function processPluginSearchPaths$(pluginDirs, log) {
    function recursiveScanFolder(ent) {
        return rxjs_1.from([ent]).pipe(operators_1.mergeMap((entry) => {
            return findManifestInFolder(entry.dir, () => {
                if (entry.depth > maxScanDepth) {
                    return [];
                }
                return mapSubdirectories(entry.dir, (subDir) => recursiveScanFolder({ dir: subDir, depth: entry.depth + 1 }));
            });
        }));
    }
    return rxjs_1.from(pluginDirs.map((dir) => ({ dir, depth: 0 }))).pipe(operators_1.mergeMap((entry) => {
        log.debug(`Scanning "${entry.dir}" for plugin sub-directories...`);
        return fsReadDir$(entry.dir).pipe(operators_1.mergeMap(() => recursiveScanFolder(entry)), operators_1.catchError((err) => [plugin_discovery_error_1.PluginDiscoveryError.invalidSearchPath(entry.dir, err)]));
    }));
}
/**
 * Attempts to read manifest file in specified directory or calls `notFound` and returns results if not found. For any
 * manifest files that cannot be read, a PluginDiscoveryError is added.
 * @param dir
 * @param notFound
 */
function findManifestInFolder(dir, notFound) {
    return fsStat$(path_1.resolve(dir, 'kibana.json')).pipe(operators_1.mergeMap((stats) => {
        // `kibana.json` exists in given directory, we got a plugin
        if (stats.isFile()) {
            return [dir];
        }
        return [];
    }), operators_1.catchError((manifestStatError) => {
        // did not find manifest. recursively process sub directories until we reach max depth.
        if (manifestStatError.code !== 'ENOENT') {
            return [plugin_discovery_error_1.PluginDiscoveryError.invalidPluginPath(dir, manifestStatError)];
        }
        return notFound();
    }));
}
/**
 * Finds all subdirectories in `dir` and executed `mapFunc` for each one. For any directories that cannot be read,
 * a PluginDiscoveryError is added.
 * @param dir
 * @param mapFunc
 */
function mapSubdirectories(dir, mapFunc) {
    return fsReadDir$(dir).pipe(operators_1.mergeMap((subDirs) => subDirs.map((subDir) => path_1.resolve(dir, subDir))), operators_1.mergeMap((subDir) => fsStat$(subDir).pipe(operators_1.mergeMap((pathStat) => (pathStat.isDirectory() ? mapFunc(subDir) : [])), operators_1.catchError((subDirStatError) => [
        plugin_discovery_error_1.PluginDiscoveryError.invalidPluginPath(subDir, subDirStatError),
    ]))));
}
/**
 * Tries to load and parse the plugin manifest file located at the provided plugin
 * directory path and produces an error result if it fails to do so or plugin manifest
 * isn't valid.
 * @param path Path to the plugin directory where manifest should be loaded from.
 * @param log Plugin discovery logger instance.
 * @param coreContext Kibana core context.
 */
function createPlugin$(path, log, coreContext) {
    return rxjs_1.from(plugin_manifest_parser_1.parseManifest(path, coreContext.env.packageInfo, log)).pipe(operators_1.map((manifest) => {
        log.debug(`Successfully discovered plugin "${manifest.id}" at "${path}"`);
        const opaqueId = Symbol(manifest.id);
        return new plugin_1.PluginWrapper({
            path,
            manifest,
            opaqueId,
            initializerContext: plugin_context_1.createPluginInitializerContext(coreContext, opaqueId, manifest),
        });
    }), operators_1.catchError((err) => [err]));
}
