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
exports.read = void 0;
/**
 * Reads the plugin's bundle declared in the global context.
 */
function read(name) {
    const coreWindow = window;
    const exportId = `plugin/${name}/public`;
    if (!coreWindow.__kbnBundles__.has(exportId)) {
        throw new Error(`Definition of plugin "${name}" not found and may have failed to load.`);
    }
    const pluginExport = coreWindow.__kbnBundles__.get(exportId);
    if (typeof pluginExport?.plugin !== 'function') {
        throw new Error(`Definition of plugin "${name}" should be a function.`);
    }
    else {
        return pluginExport.plugin;
    }
}
exports.read = read;
