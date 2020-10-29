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
exports.ElasticsearchConfig = exports.config = exports.configSchema = exports.DEFAULT_API_VERSION = void 0;
const config_schema_1 = require("@kbn/config-schema");
const fs_1 = require("fs");
const utils_1 = require("../utils");
const hostURISchema = config_schema_1.schema.uri({ scheme: ['http', 'https'] });
exports.DEFAULT_API_VERSION = '7.x';
/**
 * Validation schema for elasticsearch service config. It can be reused when plugins allow users
 * to specify a local elasticsearch config.
 * @public
 */
exports.configSchema = config_schema_1.schema.object({
    sniffOnStart: config_schema_1.schema.boolean({ defaultValue: false }),
    sniffInterval: config_schema_1.schema.oneOf([config_schema_1.schema.duration(), config_schema_1.schema.literal(false)], {
        defaultValue: false,
    }),
    sniffOnConnectionFault: config_schema_1.schema.boolean({ defaultValue: false }),
    hosts: config_schema_1.schema.oneOf([hostURISchema, config_schema_1.schema.arrayOf(hostURISchema, { minSize: 1 })], {
        defaultValue: 'http://localhost:9200',
    }),
    preserveHost: config_schema_1.schema.boolean({ defaultValue: true }),
    username: config_schema_1.schema.maybe(config_schema_1.schema.conditional(config_schema_1.schema.contextRef('dist'), false, config_schema_1.schema.string({
        validate: (rawConfig) => {
            if (rawConfig === 'elastic') {
                return ('value of "elastic" is forbidden. This is a superuser account that can obfuscate ' +
                    'privilege-related issues. You should use the "kibana_system" user instead.');
            }
        },
    }), config_schema_1.schema.string())),
    password: config_schema_1.schema.maybe(config_schema_1.schema.string()),
    requestHeadersWhitelist: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())], {
        defaultValue: ['authorization'],
    }),
    customHeaders: config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.string(), { defaultValue: {} }),
    shardTimeout: config_schema_1.schema.duration({ defaultValue: '30s' }),
    requestTimeout: config_schema_1.schema.duration({ defaultValue: '30s' }),
    pingTimeout: config_schema_1.schema.duration({ defaultValue: config_schema_1.schema.siblingRef('requestTimeout') }),
    startupTimeout: config_schema_1.schema.duration({ defaultValue: '5s' }),
    logQueries: config_schema_1.schema.boolean({ defaultValue: false }),
    ssl: config_schema_1.schema.object({
        verificationMode: config_schema_1.schema.oneOf([config_schema_1.schema.literal('none'), config_schema_1.schema.literal('certificate'), config_schema_1.schema.literal('full')], { defaultValue: 'full' }),
        certificateAuthorities: config_schema_1.schema.maybe(config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string(), { minSize: 1 })])),
        certificate: config_schema_1.schema.maybe(config_schema_1.schema.string()),
        key: config_schema_1.schema.maybe(config_schema_1.schema.string()),
        keyPassphrase: config_schema_1.schema.maybe(config_schema_1.schema.string()),
        keystore: config_schema_1.schema.object({
            path: config_schema_1.schema.maybe(config_schema_1.schema.string()),
            password: config_schema_1.schema.maybe(config_schema_1.schema.string()),
        }),
        truststore: config_schema_1.schema.object({
            path: config_schema_1.schema.maybe(config_schema_1.schema.string()),
            password: config_schema_1.schema.maybe(config_schema_1.schema.string()),
        }),
        alwaysPresentCertificate: config_schema_1.schema.boolean({ defaultValue: false }),
    }, {
        validate: (rawConfig) => {
            if (rawConfig.key && rawConfig.keystore.path) {
                return 'cannot use [key] when [keystore.path] is specified';
            }
            if (rawConfig.certificate && rawConfig.keystore.path) {
                return 'cannot use [certificate] when [keystore.path] is specified';
            }
        },
    }),
    apiVersion: config_schema_1.schema.string({ defaultValue: exports.DEFAULT_API_VERSION }),
    healthCheck: config_schema_1.schema.object({ delay: config_schema_1.schema.duration({ defaultValue: 2500 }) }),
    ignoreVersionMismatch: config_schema_1.schema.conditional(config_schema_1.schema.contextRef('dev'), false, config_schema_1.schema.boolean({
        validate: (rawValue) => {
            if (rawValue === true) {
                return '"ignoreVersionMismatch" can only be set to true in development mode';
            }
        },
        defaultValue: false,
    }), config_schema_1.schema.boolean({ defaultValue: false })),
});
const deprecations = () => [
    (settings, fromPath, log) => {
        const es = settings[fromPath];
        if (!es) {
            return settings;
        }
        if (es.username === 'elastic') {
            log(`Setting [${fromPath}.username] to "elastic" is deprecated. You should use the "kibana_system" user instead.`);
        }
        else if (es.username === 'kibana') {
            log(`Setting [${fromPath}.username] to "kibana" is deprecated. You should use the "kibana_system" user instead.`);
        }
        if (es.ssl?.key !== undefined && es.ssl?.certificate === undefined) {
            log(`Setting [${fromPath}.ssl.key] without [${fromPath}.ssl.certificate] is deprecated. This has no effect, you should use both settings to enable TLS client authentication to Elasticsearch.`);
        }
        else if (es.ssl?.certificate !== undefined && es.ssl?.key === undefined) {
            log(`Setting [${fromPath}.ssl.certificate] without [${fromPath}.ssl.key] is deprecated. This has no effect, you should use both settings to enable TLS client authentication to Elasticsearch.`);
        }
        return settings;
    },
];
exports.config = {
    path: 'elasticsearch',
    schema: exports.configSchema,
    deprecations,
};
/**
 * Wrapper of config schema.
 * @public
 */
class ElasticsearchConfig {
    constructor(rawConfig) {
        this.ignoreVersionMismatch = rawConfig.ignoreVersionMismatch;
        this.apiVersion = rawConfig.apiVersion;
        this.logQueries = rawConfig.logQueries;
        this.hosts = Array.isArray(rawConfig.hosts) ? rawConfig.hosts : [rawConfig.hosts];
        this.requestHeadersWhitelist = Array.isArray(rawConfig.requestHeadersWhitelist)
            ? rawConfig.requestHeadersWhitelist
            : [rawConfig.requestHeadersWhitelist];
        this.pingTimeout = rawConfig.pingTimeout;
        this.requestTimeout = rawConfig.requestTimeout;
        this.shardTimeout = rawConfig.shardTimeout;
        this.sniffOnStart = rawConfig.sniffOnStart;
        this.sniffOnConnectionFault = rawConfig.sniffOnConnectionFault;
        this.sniffInterval = rawConfig.sniffInterval;
        this.healthCheckDelay = rawConfig.healthCheck.delay;
        this.username = rawConfig.username;
        this.password = rawConfig.password;
        this.customHeaders = rawConfig.customHeaders;
        const { alwaysPresentCertificate, verificationMode } = rawConfig.ssl;
        const { key, keyPassphrase, certificate, certificateAuthorities } = readKeyAndCerts(rawConfig);
        this.ssl = {
            alwaysPresentCertificate,
            key,
            keyPassphrase,
            certificate,
            certificateAuthorities,
            verificationMode,
        };
    }
}
exports.ElasticsearchConfig = ElasticsearchConfig;
const readKeyAndCerts = (rawConfig) => {
    let key;
    let keyPassphrase;
    let certificate;
    let certificateAuthorities;
    const addCAs = (ca) => {
        if (ca && ca.length) {
            certificateAuthorities = [...(certificateAuthorities || []), ...ca];
        }
    };
    if (rawConfig.ssl.keystore?.path) {
        const keystore = utils_1.readPkcs12Keystore(rawConfig.ssl.keystore.path, rawConfig.ssl.keystore.password);
        if (!keystore.key) {
            throw new Error(`Did not find key in Elasticsearch keystore.`);
        }
        else if (!keystore.cert) {
            throw new Error(`Did not find certificate in Elasticsearch keystore.`);
        }
        key = keystore.key;
        certificate = keystore.cert;
        addCAs(keystore.ca);
    }
    else {
        if (rawConfig.ssl.key) {
            key = readFile(rawConfig.ssl.key);
            keyPassphrase = rawConfig.ssl.keyPassphrase;
        }
        if (rawConfig.ssl.certificate) {
            certificate = readFile(rawConfig.ssl.certificate);
        }
    }
    if (rawConfig.ssl.truststore?.path) {
        const ca = utils_1.readPkcs12Truststore(rawConfig.ssl.truststore.path, rawConfig.ssl.truststore.password);
        addCAs(ca);
    }
    const ca = rawConfig.ssl.certificateAuthorities;
    if (ca) {
        const parsed = [];
        const paths = Array.isArray(ca) ? ca : [ca];
        if (paths.length > 0) {
            for (const path of paths) {
                parsed.push(readFile(path));
            }
            addCAs(parsed);
        }
    }
    return {
        key,
        keyPassphrase,
        certificate,
        certificateAuthorities,
    };
};
const readFile = (file) => {
    return fs_1.readFileSync(file, 'utf8');
};
