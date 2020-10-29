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
var get_telemetry_opt_in_1 = require("./get_telemetry_opt_in");
Object.defineProperty(exports, "getTelemetryOptIn", { enumerable: true, get: function () { return get_telemetry_opt_in_1.getTelemetryOptIn; } });
var get_telemetry_send_usage_from_1 = require("./get_telemetry_send_usage_from");
Object.defineProperty(exports, "getTelemetrySendUsageFrom", { enumerable: true, get: function () { return get_telemetry_send_usage_from_1.getTelemetrySendUsageFrom; } });
var get_telemetry_allow_changing_opt_in_status_1 = require("./get_telemetry_allow_changing_opt_in_status");
Object.defineProperty(exports, "getTelemetryAllowChangingOptInStatus", { enumerable: true, get: function () { return get_telemetry_allow_changing_opt_in_status_1.getTelemetryAllowChangingOptInStatus; } });
var get_telemetry_failure_details_1 = require("./get_telemetry_failure_details");
Object.defineProperty(exports, "getTelemetryFailureDetails", { enumerable: true, get: function () { return get_telemetry_failure_details_1.getTelemetryFailureDetails; } });
