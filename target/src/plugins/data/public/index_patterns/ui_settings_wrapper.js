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
exports.UiSettingsPublicToCommon = void 0;
class UiSettingsPublicToCommon {
    constructor(uiSettings) {
        this.uiSettings = uiSettings;
    }
    get(key) {
        return Promise.resolve(this.uiSettings.get(key));
    }
    getAll() {
        return Promise.resolve(this.uiSettings.getAll());
    }
    set(key, value) {
        this.uiSettings.set(key, value);
        return Promise.resolve();
    }
    remove(key) {
        this.uiSettings.remove(key);
        return Promise.resolve();
    }
}
exports.UiSettingsPublicToCommon = UiSettingsPublicToCommon;
