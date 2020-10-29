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
exports.ENDPOINT_VERSION = exports.PRIVACY_STATEMENT_URL = exports.PATH_TO_ADVANCED_SETTINGS = exports.LOCALSTORAGE_KEY = exports.REPORT_INTERVAL_MS = exports.getConfigTelemetryDesc = exports.CONFIG_TELEMETRY = void 0;
const i18n_1 = require("@kbn/i18n");
/**
 * config options opt into telemetry
 */
exports.CONFIG_TELEMETRY = 'telemetry:optIn';
/**
 * config description for opting into telemetry
 */
exports.getConfigTelemetryDesc = () => {
    // Can't find where it's used but copying it over from the legacy code just in case...
    return i18n_1.i18n.translate('telemetry.telemetryConfigDescription', {
        defaultMessage: 'Help us improve the Elastic Stack by providing usage statistics for basic features. We will not share this data outside of Elastic.',
    });
};
/**
 * The amount of time, in milliseconds, to wait between reports when enabled.
 * Currently 24 hours.
 */
exports.REPORT_INTERVAL_MS = 86400000;
/**
 * Key for the localStorage service
 */
exports.LOCALSTORAGE_KEY = 'telemetry.data';
/**
 * Link to Advanced Settings.
 */
exports.PATH_TO_ADVANCED_SETTINGS = 'management/kibana/settings';
/**
 * Link to the Elastic Telemetry privacy statement.
 */
exports.PRIVACY_STATEMENT_URL = `https://www.elastic.co/legal/privacy-statement`;
/**
 * The endpoint version when hitting the remote telemetry service
 */
exports.ENDPOINT_VERSION = 'v2';
