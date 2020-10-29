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
exports.UiSettingsService = void 0;
const operators_1 = require("rxjs/operators");
const ui_settings_config_1 = require("./ui_settings_config");
const ui_settings_client_1 = require("./ui_settings_client");
const utils_1 = require("../../utils/");
const saved_objects_1 = require("./saved_objects");
const routes_1 = require("./routes");
/** @internal */
class UiSettingsService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.uiSettingsDefaults = new Map();
        this.overrides = {};
        this.log = coreContext.logger.get('ui-settings-service');
        this.config$ = coreContext.configService.atPath(ui_settings_config_1.config.path);
    }
    async setup({ http, savedObjects }) {
        this.log.debug('Setting up ui settings service');
        savedObjects.registerType(saved_objects_1.uiSettingsType);
        routes_1.registerRoutes(http.createRouter(''));
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        this.overrides = config.overrides;
        return {
            register: this.register.bind(this),
        };
    }
    async start() {
        this.validatesDefinitions();
        this.validatesOverrides();
        return {
            asScopedToClient: this.getScopedClientFactory(),
        };
    }
    async stop() { }
    getScopedClientFactory() {
        const { version, buildNum } = this.coreContext.env.packageInfo;
        return (savedObjectsClient) => new ui_settings_client_1.UiSettingsClient({
            type: 'config',
            id: version,
            buildNum,
            savedObjectsClient,
            defaults: utils_1.mapToObject(this.uiSettingsDefaults),
            overrides: this.overrides,
            log: this.log,
        });
    }
    register(settings = {}) {
        Object.entries(settings).forEach(([key, value]) => {
            if (this.uiSettingsDefaults.has(key)) {
                throw new Error(`uiSettings for the key [${key}] has been already registered`);
            }
            this.uiSettingsDefaults.set(key, value);
        });
    }
    validatesDefinitions() {
        for (const [key, definition] of this.uiSettingsDefaults) {
            if (definition.schema) {
                definition.schema.validate(definition.value, {}, `ui settings defaults [${key}]`);
            }
        }
    }
    validatesOverrides() {
        for (const [key, value] of Object.entries(this.overrides)) {
            const definition = this.uiSettingsDefaults.get(key);
            if (definition?.schema) {
                definition.schema.validate(value, {}, `ui settings overrides [${key}]`);
            }
        }
    }
}
exports.UiSettingsService = UiSettingsService;
