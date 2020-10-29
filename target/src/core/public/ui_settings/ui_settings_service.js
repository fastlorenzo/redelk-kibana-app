"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiSettingsService = void 0;
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
const rxjs_1 = require("rxjs");
const ui_settings_api_1 = require("./ui_settings_api");
const ui_settings_client_1 = require("./ui_settings_client");
/** @internal */
class UiSettingsService {
    constructor() {
        this.done$ = new rxjs_1.Subject();
    }
    setup({ http, injectedMetadata }) {
        this.uiSettingsApi = new ui_settings_api_1.UiSettingsApi(http);
        http.addLoadingCountSource(this.uiSettingsApi.getLoadingCount$());
        // TODO: Migrate away from legacyMetadata https://github.com/elastic/kibana/issues/22779
        const legacyMetadata = injectedMetadata.getLegacyMetadata();
        this.uiSettingsClient = new ui_settings_client_1.UiSettingsClient({
            api: this.uiSettingsApi,
            defaults: legacyMetadata.uiSettings.defaults,
            initialSettings: legacyMetadata.uiSettings.user,
            done$: this.done$,
        });
        return this.uiSettingsClient;
    }
    start() {
        return this.uiSettingsClient;
    }
    stop() {
        this.done$.complete();
        if (this.uiSettingsApi) {
            this.uiSettingsApi.stop();
        }
    }
}
exports.UiSettingsService = UiSettingsService;
