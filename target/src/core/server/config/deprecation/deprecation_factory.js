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
exports.configDeprecationFactory = void 0;
const safer_lodash_set_1 = require("@elastic/safer-lodash-set");
const lodash_1 = require("lodash");
const utils_1 = require("../../../utils");
const _rename = (config, rootPath, log, oldKey, newKey, silent) => {
    const fullOldPath = getPath(rootPath, oldKey);
    const oldValue = lodash_1.get(config, fullOldPath);
    if (oldValue === undefined) {
        return config;
    }
    utils_1.unset(config, fullOldPath);
    const fullNewPath = getPath(rootPath, newKey);
    const newValue = lodash_1.get(config, fullNewPath);
    if (newValue === undefined) {
        safer_lodash_set_1.set(config, fullNewPath, oldValue);
        if (!silent) {
            log(`"${fullOldPath}" is deprecated and has been replaced by "${fullNewPath}"`);
        }
    }
    else {
        if (!silent) {
            log(`"${fullOldPath}" is deprecated and has been replaced by "${fullNewPath}". However both key are present, ignoring "${fullOldPath}"`);
        }
    }
    return config;
};
const _unused = (config, rootPath, log, unusedKey) => {
    const fullPath = getPath(rootPath, unusedKey);
    if (lodash_1.get(config, fullPath) === undefined) {
        return config;
    }
    utils_1.unset(config, fullPath);
    log(`${fullPath} is deprecated and is no longer used`);
    return config;
};
const rename = (oldKey, newKey) => (config, rootPath, log) => _rename(config, rootPath, log, oldKey, newKey);
const renameFromRoot = (oldKey, newKey, silent) => (config, rootPath, log) => _rename(config, '', log, oldKey, newKey, silent);
const unused = (unusedKey) => (config, rootPath, log) => _unused(config, rootPath, log, unusedKey);
const unusedFromRoot = (unusedKey) => (config, rootPath, log) => _unused(config, '', log, unusedKey);
const getPath = (rootPath, subPath) => rootPath !== '' ? `${rootPath}.${subPath}` : subPath;
/**
 * The actual platform implementation of {@link ConfigDeprecationFactory}
 *
 * @internal
 */
exports.configDeprecationFactory = {
    rename,
    renameFromRoot,
    unused,
    unusedFromRoot,
};
