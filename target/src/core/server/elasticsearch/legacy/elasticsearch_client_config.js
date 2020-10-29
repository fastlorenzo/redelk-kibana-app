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
exports.parseElasticsearchClientConfig = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const url_1 = tslib_1.__importDefault(require("url"));
const utils_1 = require("../../../utils");
/** @internal */
function parseElasticsearchClientConfig(config, log, { ignoreCertAndKey = false, auth = true } = {}) {
    const esClientConfig = {
        keepAlive: true,
        ...utils_1.pick(config, [
            'apiVersion',
            'sniffOnStart',
            'sniffOnConnectionFault',
            'keepAlive',
            'log',
            'plugins',
        ]),
    };
    if (esClientConfig.log == null) {
        esClientConfig.log = getLoggerClass(log, config.logQueries);
    }
    if (config.pingTimeout != null) {
        esClientConfig.pingTimeout = getDurationAsMs(config.pingTimeout);
    }
    if (config.requestTimeout != null) {
        esClientConfig.requestTimeout = getDurationAsMs(config.requestTimeout);
    }
    if (config.sniffInterval) {
        esClientConfig.sniffInterval = getDurationAsMs(config.sniffInterval);
    }
    if (Array.isArray(config.hosts)) {
        const needsAuth = auth !== false && config.username && config.password;
        esClientConfig.hosts = config.hosts.map((nodeUrl) => {
            const uri = url_1.default.parse(nodeUrl);
            const httpsURI = uri.protocol === 'https:';
            const httpURI = uri.protocol === 'http:';
            const host = {
                host: uri.hostname,
                port: uri.port || (httpsURI && '443') || (httpURI && '80'),
                protocol: uri.protocol,
                path: uri.pathname,
                query: uri.query,
                headers: config.customHeaders,
            };
            if (needsAuth) {
                host.auth = `${config.username}:${config.password}`;
            }
            return host;
        });
    }
    if (config.ssl === undefined) {
        return lodash_1.cloneDeep(esClientConfig);
    }
    esClientConfig.ssl = {};
    const verificationMode = config.ssl.verificationMode;
    switch (verificationMode) {
        case 'none':
            esClientConfig.ssl.rejectUnauthorized = false;
            break;
        case 'certificate':
            esClientConfig.ssl.rejectUnauthorized = true;
            // by default, NodeJS is checking the server identify
            esClientConfig.ssl.checkServerIdentity = () => undefined;
            break;
        case 'full':
            esClientConfig.ssl.rejectUnauthorized = true;
            break;
        default:
            throw new Error(`Unknown ssl verificationMode: ${verificationMode}`);
    }
    esClientConfig.ssl.ca = config.ssl.certificateAuthorities;
    // Add client certificate and key if required by elasticsearch
    if (!ignoreCertAndKey && config.ssl.certificate && config.ssl.key) {
        esClientConfig.ssl.cert = config.ssl.certificate;
        esClientConfig.ssl.key = config.ssl.key;
        esClientConfig.ssl.passphrase = config.ssl.keyPassphrase;
    }
    // Elasticsearch JS client mutates config object, so all properties that are
    // usually passed by reference should be cloned to avoid any side effects.
    return lodash_1.cloneDeep(esClientConfig);
}
exports.parseElasticsearchClientConfig = parseElasticsearchClientConfig;
function getDurationAsMs(duration) {
    if (typeof duration === 'number') {
        return duration;
    }
    return duration.asMilliseconds();
}
function getLoggerClass(log, logQueries = false) {
    return class ElasticsearchClientLogging {
        error(err) {
            log.error(err);
        }
        warning(message) {
            log.warn(message);
        }
        trace(method, options, query, _, statusCode) {
            if (logQueries) {
                log.debug(`${statusCode}\n${method} ${options.path}\n${query ? query.trim() : ''}`, {
                    tags: ['query'],
                });
            }
        }
        // elasticsearch-js expects the following functions to exist
        info() {
            // noop
        }
        debug() {
            // noop
        }
        close() {
            // noop
        }
    };
}
