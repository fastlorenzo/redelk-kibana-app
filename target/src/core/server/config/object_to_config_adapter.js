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
exports.ObjectToConfigAdapter = void 0;
const safer_lodash_set_1 = require("@elastic/safer-lodash-set");
const lodash_1 = require("lodash");
const utils_1 = require("../../utils");
/**
 * Allows plain javascript object to behave like `RawConfig` instance.
 * @internal
 */
class ObjectToConfigAdapter {
    constructor(rawConfig) {
        this.rawConfig = rawConfig;
    }
    has(configPath) {
        return lodash_1.has(this.rawConfig, configPath);
    }
    get(configPath) {
        return lodash_1.get(this.rawConfig, configPath);
    }
    set(configPath, value) {
        safer_lodash_set_1.set(this.rawConfig, configPath, value);
    }
    getFlattenedPaths() {
        return Object.keys(utils_1.getFlattenedObject(this.rawConfig));
    }
    toRaw() {
        return lodash_1.cloneDeep(this.rawConfig);
    }
}
exports.ObjectToConfigAdapter = ObjectToConfigAdapter;
