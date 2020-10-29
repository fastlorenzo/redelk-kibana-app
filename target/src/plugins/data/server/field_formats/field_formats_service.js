"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldFormatsService = void 0;
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
const lodash_1 = require("lodash");
const field_formats_1 = require("../../common/field_formats");
const converters_1 = require("./converters");
class FieldFormatsService {
    constructor() {
        this.fieldFormatClasses = [
            converters_1.DateFormat,
            converters_1.DateNanosFormat,
            ...field_formats_1.baseFormatters,
        ];
    }
    setup() {
        return {
            register: (customFieldFormat) => this.fieldFormatClasses.push(customFieldFormat),
        };
    }
    start() {
        return {
            fieldFormatServiceFactory: async (uiSettings) => {
                const fieldFormatsRegistry = new field_formats_1.FieldFormatsRegistry();
                const uiConfigs = await uiSettings.getAll();
                const registeredUiSettings = uiSettings.getRegistered();
                Object.keys(registeredUiSettings).forEach((key) => {
                    if (lodash_1.has(uiConfigs, key) && registeredUiSettings[key].type === 'json') {
                        uiConfigs[key] = JSON.parse(uiConfigs[key]);
                    }
                });
                fieldFormatsRegistry.init((key) => uiConfigs[key], {}, this.fieldFormatClasses);
                return fieldFormatsRegistry;
            },
        };
    }
}
exports.FieldFormatsService = FieldFormatsService;
