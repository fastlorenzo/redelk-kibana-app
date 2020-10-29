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
exports.NavControlsService = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/** @internal */
class NavControlsService {
    constructor() {
        this.stop$ = new rxjs_1.ReplaySubject(1);
    }
    start() {
        const navControlsLeft$ = new rxjs_1.BehaviorSubject(new Set());
        const navControlsRight$ = new rxjs_1.BehaviorSubject(new Set());
        return {
            // In the future, registration should be moved to the setup phase. This
            // is not possible until the legacy nav controls are no longer supported.
            registerLeft: (navControl) => navControlsLeft$.next(new Set([...navControlsLeft$.value.values(), navControl])),
            registerRight: (navControl) => navControlsRight$.next(new Set([...navControlsRight$.value.values(), navControl])),
            getLeft$: () => navControlsLeft$.pipe(operators_1.map((controls) => lodash_1.sortBy([...controls.values()], 'order')), operators_1.takeUntil(this.stop$)),
            getRight$: () => navControlsRight$.pipe(operators_1.map((controls) => lodash_1.sortBy([...controls.values()], 'order')), operators_1.takeUntil(this.stop$)),
        };
    }
    stop() {
        this.stop$.next();
    }
}
exports.NavControlsService = NavControlsService;
