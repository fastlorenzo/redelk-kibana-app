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
exports.ServiceStatusLevels = void 0;
const utils_1 = require("../../utils");
/**
 * The current "level" of availability of a service.
 *
 * @remarks
 * The values implement `valueOf` to allow for easy comparisons between status levels with <, >, etc. Higher values
 * represent higher severities. Note that the default `Array.prototype.sort` implementation does not correctly sort
 * these values.
 *
 * A snapshot serializer is available in `src/core/server/test_utils` to ease testing of these values with Jest.
 *
 * @public
 */
exports.ServiceStatusLevels = utils_1.deepFreeze({
    /**
     * Everything is working!
     */
    available: {
        toString: () => 'available',
        valueOf: () => 0,
    },
    /**
     * Some features may not be working.
     */
    degraded: {
        toString: () => 'degraded',
        valueOf: () => 1,
    },
    /**
     * The service is unavailable, but other functions that do not depend on this service should work.
     */
    unavailable: {
        toString: () => 'unavailable',
        valueOf: () => 2,
    },
    /**
     * Block all user functions and display the status page, reserved for Core services only.
     */
    critical: {
        toString: () => 'critical',
        valueOf: () => 3,
    },
});
