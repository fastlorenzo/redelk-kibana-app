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
exports.config = exports.configSchema = void 0;
const config_schema_1 = require("@kbn/config-schema");
const constants_1 = require("../common/constants");
exports.configSchema = config_schema_1.schema.object({
    uiMetric: config_schema_1.schema.object({
        enabled: config_schema_1.schema.boolean({ defaultValue: true }),
        debug: config_schema_1.schema.boolean({ defaultValue: config_schema_1.schema.contextRef('dev') }),
    }),
    maximumWaitTimeForAllCollectorsInS: config_schema_1.schema.number({
        defaultValue: constants_1.DEFAULT_MAXIMUM_WAIT_TIME_FOR_ALL_COLLECTORS_IN_S,
    }),
});
exports.config = {
    schema: exports.configSchema,
    deprecations: ({ renameFromRoot }) => [
        renameFromRoot('ui_metric.enabled', 'usageCollection.uiMetric.enabled'),
        renameFromRoot('ui_metric.debug', 'usageCollection.uiMetric.debug'),
    ],
    exposeToBrowser: {
        uiMetric: true,
    },
};
