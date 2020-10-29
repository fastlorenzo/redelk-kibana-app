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
exports.UsageCollectionPlugin = exports.isUnauthenticated = void 0;
const analytics_1 = require("@kbn/analytics");
const rxjs_1 = require("rxjs");
const public_1 = require("../../kibana_utils/public");
const services_1 = require("./services");
const application_usage_1 = require("./services/application_usage");
function isUnauthenticated(http) {
    const { anonymousPaths } = http;
    return anonymousPaths.isAnonymous(window.location.pathname);
}
exports.isUnauthenticated = isUnauthenticated;
class UsageCollectionPlugin {
    constructor(initializerContext) {
        this.legacyAppId$ = new rxjs_1.Subject();
        this.trackUserAgent = true;
        this.config = initializerContext.config.get();
    }
    setup({ http }) {
        const localStorage = new public_1.Storage(window.localStorage);
        const debug = this.config.uiMetric.debug;
        this.reporter = services_1.createReporter({
            localStorage,
            debug,
            fetch: http,
        });
        return {
            allowTrackUserAgent: (allow) => {
                this.trackUserAgent = allow;
            },
            reportUiStats: this.reporter.reportUiStats,
            METRIC_TYPE: analytics_1.METRIC_TYPE,
            __LEGACY: {
                appChanged: (appId) => this.legacyAppId$.next(appId),
            },
        };
    }
    start({ http, application }) {
        if (!this.reporter) {
            throw new Error('Usage collection reporter not set up correctly');
        }
        if (this.config.uiMetric.enabled && !isUnauthenticated(http)) {
            this.reporter.start();
        }
        if (this.trackUserAgent) {
            this.reporter.reportUserAgent('kibana');
        }
        application_usage_1.reportApplicationUsage(rxjs_1.merge(application.currentAppId$, this.legacyAppId$), this.reporter);
        return {
            reportUiStats: this.reporter.reportUiStats,
            METRIC_TYPE: analytics_1.METRIC_TYPE,
        };
    }
    stop() { }
}
exports.UsageCollectionPlugin = UsageCollectionPlugin;
