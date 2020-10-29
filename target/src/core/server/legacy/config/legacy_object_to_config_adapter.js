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
exports.LegacyObjectToConfigAdapter = void 0;
const object_to_config_adapter_1 = require("../../config/object_to_config_adapter");
/**
 * Represents adapter between config provided by legacy platform and `Config`
 * supported by the current platform.
 * @internal
 */
class LegacyObjectToConfigAdapter extends object_to_config_adapter_1.ObjectToConfigAdapter {
    static transformLogging(configValue = {}) {
        const { appenders, root, loggers, ...legacyLoggingConfig } = configValue;
        const loggingConfig = {
            appenders: {
                ...appenders,
                default: { kind: 'legacy-appender', legacyLoggingConfig },
            },
            root: { level: 'info', ...root },
            loggers,
        };
        if (configValue.silent) {
            loggingConfig.root.level = 'off';
        }
        else if (configValue.quiet) {
            loggingConfig.root.level = 'error';
        }
        else if (configValue.verbose) {
            loggingConfig.root.level = 'all';
        }
        return loggingConfig;
    }
    static transformServer(configValue = {}) {
        // TODO: New platform uses just a subset of `server` config from the legacy platform,
        // new values will be exposed once we need them
        return {
            autoListen: configValue.autoListen,
            basePath: configValue.basePath,
            cors: configValue.cors,
            customResponseHeaders: configValue.customResponseHeaders,
            host: configValue.host,
            maxPayload: configValue.maxPayloadBytes,
            name: configValue.name,
            port: configValue.port,
            rewriteBasePath: configValue.rewriteBasePath,
            ssl: configValue.ssl,
            keepaliveTimeout: configValue.keepaliveTimeout,
            socketTimeout: configValue.socketTimeout,
            compression: configValue.compression,
            uuid: configValue.uuid,
            xsrf: configValue.xsrf,
        };
    }
    static transformPlugins(configValue) {
        // These properties are the only ones we use from the existing `plugins` config node
        // since `scanDirs` isn't respected by new platform plugin discovery.
        return {
            initialize: configValue.initialize,
            paths: configValue.paths,
        };
    }
    get(configPath) {
        const configValue = super.get(configPath);
        switch (configPath) {
            case 'logging':
                return LegacyObjectToConfigAdapter.transformLogging(configValue);
            case 'server':
                return LegacyObjectToConfigAdapter.transformServer(configValue);
            case 'plugins':
                return LegacyObjectToConfigAdapter.transformPlugins(configValue);
            default:
                return configValue;
        }
    }
}
exports.LegacyObjectToConfigAdapter = LegacyObjectToConfigAdapter;
