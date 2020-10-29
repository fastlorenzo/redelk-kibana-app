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
exports.FieldFormatsService = void 0;
const common_1 = require("../../common");
const deserialize_1 = require("./utils/deserialize");
const constants_1 = require("./constants");
class FieldFormatsService {
    constructor() {
        this.fieldFormatsRegistry = new common_1.FieldFormatsRegistry();
    }
    setup(core) {
        core.uiSettings.getUpdate$().subscribe(({ key, newValue }) => {
            if (key === common_1.UI_SETTINGS.FORMAT_DEFAULT_TYPE_MAP) {
                this.fieldFormatsRegistry.parseDefaultTypeMap(newValue);
            }
        });
        const getConfig = core.uiSettings.get.bind(core.uiSettings);
        this.fieldFormatsRegistry.init(getConfig, {
            parsedUrl: {
                origin: window.location.origin,
                pathname: window.location.pathname,
                basePath: core.http.basePath.get(),
            },
        }, constants_1.baseFormattersPublic);
        return this.fieldFormatsRegistry;
    }
    start() {
        this.fieldFormatsRegistry.deserialize = deserialize_1.deserializeFieldFormat.bind(this.fieldFormatsRegistry);
        return this.fieldFormatsRegistry;
    }
}
exports.FieldFormatsService = FieldFormatsService;
