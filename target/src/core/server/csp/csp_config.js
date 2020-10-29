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
exports.CspConfig = void 0;
const config_1 = require("./config");
const DEFAULT_CONFIG = Object.freeze(config_1.config.schema.validate({}));
/**
 * CSP configuration for use in Kibana.
 * @public
 */
class CspConfig {
    /**
     * Returns the default CSP configuration when passed with no config
     * @internal
     */
    constructor(rawCspConfig = {}) {
        const source = { ...DEFAULT_CONFIG, ...rawCspConfig };
        this.rules = source.rules;
        this.strict = source.strict;
        this.warnLegacyBrowsers = source.warnLegacyBrowsers;
        this.header = source.rules.join('; ');
    }
}
exports.CspConfig = CspConfig;
CspConfig.DEFAULT = new CspConfig();
