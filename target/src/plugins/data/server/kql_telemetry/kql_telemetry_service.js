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
exports.KqlTelemetryService = void 0;
const operators_1 = require("rxjs/operators");
const route_1 = require("./route");
const usage_collector_1 = require("./usage_collector");
const saved_objects_1 = require("../saved_objects");
class KqlTelemetryService {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    setup({ http, getStartServices, savedObjects }, { usageCollection }) {
        savedObjects.registerType(saved_objects_1.kqlTelemetry);
        route_1.registerKqlTelemetryRoute(http.createRouter(), getStartServices, this.initializerContext.logger.get('data', 'kql-telemetry'));
        if (usageCollection) {
            this.initializerContext.config.legacy.globalConfig$
                .pipe(operators_1.first())
                .toPromise()
                .then((config) => usage_collector_1.makeKQLUsageCollector(usageCollection, config.kibana.index))
                .catch((e) => {
                this.initializerContext.logger
                    .get('kql-telemetry')
                    .warn(`Registering KQL telemetry collector failed: ${e}`);
            });
        }
    }
    start() { }
}
exports.KqlTelemetryService = KqlTelemetryService;
