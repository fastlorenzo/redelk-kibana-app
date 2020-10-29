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
exports.SslConfig = exports.sslSchema = void 0;
const tslib_1 = require("tslib");
const config_schema_1 = require("@kbn/config-schema");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const fs_1 = require("fs");
const utils_1 = require("../utils");
// `crypto` type definitions doesn't currently include `crypto.constants`, see
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/fa5baf1733f49cf26228a4e509914572c1b74adf/types/node/v6/index.d.ts#L3412
const cryptoConstants = crypto_1.default.constants;
const protocolMap = new Map([
    ['TLSv1', cryptoConstants.SSL_OP_NO_TLSv1],
    ['TLSv1.1', cryptoConstants.SSL_OP_NO_TLSv1_1],
    ['TLSv1.2', cryptoConstants.SSL_OP_NO_TLSv1_2],
]);
exports.sslSchema = config_schema_1.schema.object({
    certificate: config_schema_1.schema.maybe(config_schema_1.schema.string()),
    certificateAuthorities: config_schema_1.schema.maybe(config_schema_1.schema.oneOf([config_schema_1.schema.arrayOf(config_schema_1.schema.string()), config_schema_1.schema.string()])),
    cipherSuites: config_schema_1.schema.arrayOf(config_schema_1.schema.string(), {
        defaultValue: cryptoConstants.defaultCoreCipherList.split(':'),
    }),
    enabled: config_schema_1.schema.boolean({
        defaultValue: false,
    }),
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
    redirectHttpFromPort: config_schema_1.schema.maybe(config_schema_1.schema.number()),
    supportedProtocols: config_schema_1.schema.arrayOf(config_schema_1.schema.oneOf([config_schema_1.schema.literal('TLSv1'), config_schema_1.schema.literal('TLSv1.1'), config_schema_1.schema.literal('TLSv1.2')]), { defaultValue: ['TLSv1.1', 'TLSv1.2'], minSize: 1 }),
    clientAuthentication: config_schema_1.schema.oneOf([config_schema_1.schema.literal('none'), config_schema_1.schema.literal('optional'), config_schema_1.schema.literal('required')], { defaultValue: 'none' }),
}, {
    validate: (ssl) => {
        if (ssl.key && ssl.keystore.path) {
            return 'cannot use [key] when [keystore.path] is specified';
        }
        if (ssl.certificate && ssl.keystore.path) {
            return 'cannot use [certificate] when [keystore.path] is specified';
        }
        if (ssl.enabled && (!ssl.key || !ssl.certificate) && !ssl.keystore.path) {
            return 'must specify [certificate] and [key] -- or [keystore.path] -- when ssl is enabled';
        }
        if (!ssl.enabled && ssl.clientAuthentication !== 'none') {
            return 'must enable ssl to use [clientAuthentication]';
        }
    },
});
class SslConfig {
    /**
     * @internal
     */
    constructor(config) {
        this.enabled = config.enabled;
        this.redirectHttpFromPort = config.redirectHttpFromPort;
        this.cipherSuites = config.cipherSuites;
        this.supportedProtocols = config.supportedProtocols;
        this.requestCert = config.clientAuthentication !== 'none';
        this.rejectUnauthorized = config.clientAuthentication === 'required';
        const addCAs = (ca) => {
            if (ca && ca.length) {
                this.certificateAuthorities = [...(this.certificateAuthorities || []), ...ca];
            }
        };
        if (config.keystore?.path) {
            const { key, cert, ca } = utils_1.readPkcs12Keystore(config.keystore.path, config.keystore.password);
            if (!key) {
                throw new Error(`Did not find private key in keystore at [keystore.path].`);
            }
            else if (!cert) {
                throw new Error(`Did not find certificate in keystore at [keystore.path].`);
            }
            this.key = key;
            this.certificate = cert;
            addCAs(ca);
        }
        else if (config.key && config.certificate) {
            this.key = readFile(config.key);
            this.keyPassphrase = config.keyPassphrase;
            this.certificate = readFile(config.certificate);
        }
        if (config.truststore?.path) {
            const ca = utils_1.readPkcs12Truststore(config.truststore.path, config.truststore.password);
            addCAs(ca);
        }
        const ca = config.certificateAuthorities;
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
    }
    /**
     * Options that affect the OpenSSL protocol behavior via numeric bitmask of the SSL_OP_* options from OpenSSL Options.
     */
    getSecureOptions() {
        // our validation should ensure that this.supportedProtocols is at least an empty array,
        // which the following logic depends upon.
        if (this.supportedProtocols == null || this.supportedProtocols.length === 0) {
            throw new Error(`supportedProtocols should be specified`);
        }
        const supportedProtocols = this.supportedProtocols;
        return Array.from(protocolMap).reduce((secureOptions, [protocolAlias, secureOption]) => {
            // `secureOption` is the option that turns *off* support for a particular protocol,
            // so if protocol is supported, we should not enable this option.
            return supportedProtocols.includes(protocolAlias)
                ? secureOptions
                : secureOptions | secureOption; // eslint-disable-line no-bitwise
        }, 0);
    }
}
exports.SslConfig = SslConfig;
const readFile = (file) => {
    return fs_1.readFileSync(file, 'utf8');
};
