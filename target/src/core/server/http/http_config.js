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
exports.HttpConfig = exports.config = void 0;
const config_schema_1 = require("@kbn/config-schema");
const os_1 = require("os");
const csp_1 = require("../csp");
const ssl_config_1 = require("./ssl_config");
const validBasePathRegex = /^\/.*[^\/]$/;
const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const match = (regex, errorMsg) => (str) => regex.test(str) ? undefined : errorMsg;
// before update to make sure it's in sync with validation rules in Legacy
// https://github.com/elastic/kibana/blob/master/src/legacy/server/config/schema.js
exports.config = {
    path: 'server',
    schema: config_schema_1.schema.object({
        name: config_schema_1.schema.string({ defaultValue: () => os_1.hostname() }),
        autoListen: config_schema_1.schema.boolean({ defaultValue: true }),
        basePath: config_schema_1.schema.maybe(config_schema_1.schema.string({
            validate: match(validBasePathRegex, "must start with a slash, don't end with one"),
        })),
        cors: config_schema_1.schema.conditional(config_schema_1.schema.contextRef('dev'), true, config_schema_1.schema.object({
            origin: config_schema_1.schema.arrayOf(config_schema_1.schema.string()),
        }, {
            defaultValue: {
                origin: ['*://localhost:9876'],
            },
        }), config_schema_1.schema.boolean({ defaultValue: false })),
        customResponseHeaders: config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.any(), {
            defaultValue: {},
        }),
        host: config_schema_1.schema.string({
            defaultValue: 'localhost',
            hostname: true,
        }),
        maxPayload: config_schema_1.schema.byteSize({
            defaultValue: '1048576b',
        }),
        port: config_schema_1.schema.number({
            defaultValue: 5601,
        }),
        rewriteBasePath: config_schema_1.schema.boolean({ defaultValue: false }),
        ssl: ssl_config_1.sslSchema,
        keepaliveTimeout: config_schema_1.schema.number({
            defaultValue: 120000,
        }),
        socketTimeout: config_schema_1.schema.number({
            defaultValue: 120000,
        }),
        compression: config_schema_1.schema.object({
            enabled: config_schema_1.schema.boolean({ defaultValue: true }),
            referrerWhitelist: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.string({
                hostname: true,
            }), { minSize: 1 })),
        }),
        uuid: config_schema_1.schema.maybe(config_schema_1.schema.string({
            validate: match(uuidRegexp, 'must be a valid uuid'),
        })),
        xsrf: config_schema_1.schema.object({
            disableProtection: config_schema_1.schema.boolean({ defaultValue: false }),
            whitelist: config_schema_1.schema.arrayOf(config_schema_1.schema.string({ validate: match(/^\//, 'must start with a slash') }), { defaultValue: [] }),
        }),
    }, {
        validate: (rawConfig) => {
            if (!rawConfig.basePath && rawConfig.rewriteBasePath) {
                return 'cannot use [rewriteBasePath] when [basePath] is not specified';
            }
            if (!rawConfig.compression.enabled && rawConfig.compression.referrerWhitelist) {
                return 'cannot use [compression.referrerWhitelist] when [compression.enabled] is set to false';
            }
            if (rawConfig.ssl.enabled &&
                rawConfig.ssl.redirectHttpFromPort !== undefined &&
                rawConfig.ssl.redirectHttpFromPort === rawConfig.port) {
                return ('Kibana does not accept http traffic to [port] when ssl is ' +
                    'enabled (only https is allowed), so [ssl.redirectHttpFromPort] ' +
                    `cannot be configured to the same value. Both are [${rawConfig.port}].`);
            }
        },
    }),
};
class HttpConfig {
    /**
     * @internal
     */
    constructor(rawHttpConfig, rawCspConfig) {
        this.autoListen = rawHttpConfig.autoListen;
        this.host = rawHttpConfig.host;
        this.port = rawHttpConfig.port;
        this.cors = rawHttpConfig.cors;
        this.customResponseHeaders = Object.entries(rawHttpConfig.customResponseHeaders ?? {}).reduce((headers, [key, value]) => {
            return {
                ...headers,
                [key]: Array.isArray(value) ? value.map((e) => convertHeader(e)) : convertHeader(value),
            };
        }, {});
        this.maxPayload = rawHttpConfig.maxPayload;
        this.name = rawHttpConfig.name;
        this.basePath = rawHttpConfig.basePath;
        this.keepaliveTimeout = rawHttpConfig.keepaliveTimeout;
        this.socketTimeout = rawHttpConfig.socketTimeout;
        this.rewriteBasePath = rawHttpConfig.rewriteBasePath;
        this.ssl = new ssl_config_1.SslConfig(rawHttpConfig.ssl || {});
        this.compression = rawHttpConfig.compression;
        this.csp = new csp_1.CspConfig(rawCspConfig);
        this.xsrf = rawHttpConfig.xsrf;
    }
}
exports.HttpConfig = HttpConfig;
const convertHeader = (entry) => {
    return typeof entry === 'object' ? JSON.stringify(entry) : String(entry);
};
