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
exports.MomentService = void 0;
const tslib_1 = require("tslib");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/** @internal */
class MomentService {
    async setup() { }
    async start({ uiSettings }) {
        const setDefaultTimezone = (tz) => {
            const zone = moment_timezone_1.default.tz.zone(tz);
            if (zone)
                moment_timezone_1.default.tz.setDefault(zone.name);
        };
        const setStartDayOfWeek = (day) => {
            const dow = moment_timezone_1.default.weekdays().indexOf(day);
            moment_timezone_1.default.updateLocale(moment_timezone_1.default.locale(), { week: { dow } });
        };
        this.uiSettingsSubscription = rxjs_1.merge(uiSettings.get$('dateFormat:tz').pipe(operators_1.tap(setDefaultTimezone)), uiSettings.get$('dateFormat:dow').pipe(operators_1.tap(setStartDayOfWeek))).subscribe();
    }
    async stop() {
        if (this.uiSettingsSubscription) {
            this.uiSettingsSubscription.unsubscribe();
            this.uiSettingsSubscription = undefined;
        }
    }
}
exports.MomentService = MomentService;
