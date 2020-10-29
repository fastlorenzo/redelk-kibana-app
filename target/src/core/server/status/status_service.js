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
exports.StatusService = void 0;
/* eslint-disable max-classes-per-file */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const util_1 = require("util");
const get_summary_status_1 = require("./get_summary_status");
class StatusService {
    constructor(coreContext) {
        this.logger = coreContext.logger.get('status');
    }
    setup(core) {
        const core$ = this.setupCoreStatus(core);
        const overall$ = core$.pipe(operators_1.map((coreStatus) => {
            const summary = get_summary_status_1.getSummaryStatus(Object.entries(coreStatus));
            this.logger.debug(`Recalculated overall status`, { status: summary });
            return summary;
        }), operators_1.distinctUntilChanged(util_1.isDeepStrictEqual));
        return {
            core$,
            overall$,
        };
    }
    start() { }
    stop() { }
    setupCoreStatus({ elasticsearch, savedObjects }) {
        return rxjs_1.combineLatest([elasticsearch.status$, savedObjects.status$]).pipe(operators_1.map(([elasticsearchStatus, savedObjectsStatus]) => ({
            elasticsearch: elasticsearchStatus,
            savedObjects: savedObjectsStatus,
        })), operators_1.distinctUntilChanged(util_1.isDeepStrictEqual), operators_1.shareReplay(1));
    }
}
exports.StatusService = StatusService;
