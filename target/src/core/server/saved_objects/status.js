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
exports.calculateStatus$ = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const status_1 = require("../status");
exports.calculateStatus$ = (rawMigratorStatus$, elasticsearchStatus$) => {
    const migratorStatus$ = rawMigratorStatus$.pipe(operators_1.map((migrationStatus) => {
        if (migrationStatus.status === 'waiting') {
            return {
                level: status_1.ServiceStatusLevels.unavailable,
                summary: `SavedObjects service is waiting to start migrations`,
            };
        }
        else if (migrationStatus.status === 'running') {
            return {
                level: status_1.ServiceStatusLevels.unavailable,
                summary: `SavedObjects service is running migrations`,
            };
        }
        const statusCounts = { migrated: 0, skipped: 0 };
        if (migrationStatus.result) {
            migrationStatus.result.forEach(({ status }) => {
                statusCounts[status] = (statusCounts[status] ?? 0) + 1;
            });
        }
        return {
            level: status_1.ServiceStatusLevels.available,
            summary: `SavedObjects service has completed migrations and is available`,
            meta: {
                migratedIndices: statusCounts,
            },
        };
    }), operators_1.startWith({
        level: status_1.ServiceStatusLevels.unavailable,
        summary: `SavedObjects service is waiting to start migrations`,
    }));
    return rxjs_1.combineLatest([elasticsearchStatus$, migratorStatus$]).pipe(operators_1.map(([esStatus, migratorStatus]) => {
        if (esStatus.level >= status_1.ServiceStatusLevels.unavailable) {
            return {
                level: status_1.ServiceStatusLevels.unavailable,
                summary: `SavedObjects service is not available without a healthy Elasticearch connection`,
            };
        }
        else if (migratorStatus.level === status_1.ServiceStatusLevels.unavailable) {
            return migratorStatus;
        }
        else if (esStatus.level === status_1.ServiceStatusLevels.degraded) {
            return {
                level: esStatus.level,
                summary: `SavedObjects service is degraded due to Elasticsearch: [${esStatus.summary}]`,
            };
        }
        else {
            return migratorStatus;
        }
    }));
};
