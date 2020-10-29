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
exports.MetricsService = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ops_metrics_collector_1 = require("./ops_metrics_collector");
const ops_config_1 = require("./ops_config");
/** @internal */
class MetricsService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.metrics$ = new rxjs_1.Subject();
        this.logger = coreContext.logger.get('metrics');
    }
    async setup({ http }) {
        this.metricsCollector = new ops_metrics_collector_1.OpsMetricsCollector(http.server);
        return {};
    }
    async start() {
        if (!this.metricsCollector) {
            throw new Error('#setup() needs to be run first');
        }
        const config = await this.coreContext.configService
            .atPath(ops_config_1.opsConfig.path)
            .pipe(operators_1.first())
            .toPromise();
        await this.refreshMetrics();
        this.collectInterval = setInterval(() => {
            this.refreshMetrics();
        }, config.interval.asMilliseconds());
        const metricsObservable = this.metrics$.asObservable();
        return {
            getOpsMetrics$: () => metricsObservable,
        };
    }
    async refreshMetrics() {
        this.logger.debug('Refreshing metrics');
        const metrics = await this.metricsCollector.collect();
        this.metricsCollector.reset();
        this.metrics$.next(metrics);
    }
    async stop() {
        if (this.collectInterval) {
            clearInterval(this.collectInterval);
        }
        this.metrics$.complete();
    }
}
exports.MetricsService = MetricsService;
