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
exports.TelemetrySender = void 0;
const constants_1 = require("../../common/constants");
const public_1 = require("../../../kibana_utils/public");
class TelemetrySender {
    constructor(telemetryService) {
        this.isSending = false;
        this.saveToBrowser = () => {
            // we are the only code that manipulates this key, so it's safe to blindly overwrite the whole object
            this.storage.set(constants_1.LOCALSTORAGE_KEY, { lastReport: this.lastReported });
        };
        this.shouldSendReport = () => {
            // check if opt-in for telemetry is enabled
            if (this.telemetryService.getIsOptedIn()) {
                if (!this.lastReported) {
                    return true;
                }
                // returns NaN for any malformed or unset (null/undefined) value
                const lastReported = parseInt(this.lastReported, 10);
                // If it's been a day since we last sent telemetry
                if (isNaN(lastReported) || Date.now() - lastReported > constants_1.REPORT_INTERVAL_MS) {
                    return true;
                }
            }
            return false;
        };
        this.sendIfDue = async () => {
            if (this.isSending || !this.shouldSendReport()) {
                return;
            }
            // mark that we are working so future requests are ignored until we're done
            this.isSending = true;
            try {
                const telemetryUrl = this.telemetryService.getTelemetryUrl();
                const telemetryData = await this.telemetryService.fetchTelemetry();
                const clusters = [].concat(telemetryData);
                await Promise.all(clusters.map(async (cluster) => await fetch(telemetryUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: cluster,
                })));
                this.lastReported = `${Date.now()}`;
                this.saveToBrowser();
            }
            catch (err) {
                // ignore err
            }
            finally {
                this.isSending = false;
            }
        };
        this.startChecking = () => {
            if (typeof this.intervalId === 'undefined') {
                this.intervalId = window.setInterval(this.sendIfDue, 60000);
            }
        };
        this.telemetryService = telemetryService;
        this.storage = new public_1.Storage(window.localStorage);
        const attributes = this.storage.get(constants_1.LOCALSTORAGE_KEY);
        if (attributes) {
            this.lastReported = attributes.lastReport;
        }
    }
}
exports.TelemetrySender = TelemetrySender;
