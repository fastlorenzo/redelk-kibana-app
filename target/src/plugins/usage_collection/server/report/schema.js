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
exports.reportSchema = void 0;
const config_schema_1 = require("@kbn/config-schema");
const analytics_1 = require("@kbn/analytics");
exports.reportSchema = config_schema_1.schema.object({
    reportVersion: config_schema_1.schema.maybe(config_schema_1.schema.literal(1)),
    userAgent: config_schema_1.schema.maybe(config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.object({
        key: config_schema_1.schema.string(),
        type: config_schema_1.schema.string(),
        appName: config_schema_1.schema.string(),
        userAgent: config_schema_1.schema.string(),
    }))),
    uiStatsMetrics: config_schema_1.schema.maybe(config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.object({
        key: config_schema_1.schema.string(),
        type: config_schema_1.schema.oneOf([
            config_schema_1.schema.literal(analytics_1.METRIC_TYPE.CLICK),
            config_schema_1.schema.literal(analytics_1.METRIC_TYPE.LOADED),
            config_schema_1.schema.literal(analytics_1.METRIC_TYPE.COUNT),
        ]),
        appName: config_schema_1.schema.string(),
        eventName: config_schema_1.schema.string(),
        stats: config_schema_1.schema.object({
            min: config_schema_1.schema.number(),
            sum: config_schema_1.schema.number(),
            max: config_schema_1.schema.number(),
            avg: config_schema_1.schema.number(),
        }),
    }))),
    application_usage: config_schema_1.schema.maybe(config_schema_1.schema.recordOf(config_schema_1.schema.string(), config_schema_1.schema.object({
        minutesOnScreen: config_schema_1.schema.number(),
        numberOfClicks: config_schema_1.schema.number(),
    }))),
});
