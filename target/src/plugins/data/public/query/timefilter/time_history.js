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
exports.TimeHistory = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const persisted_log_1 = require("../persisted_log");
class TimeHistory {
    constructor(storage) {
        const historyOptions = {
            maxLength: 10,
            filterDuplicates: true,
            isDuplicate: (oldItem, newItem) => {
                return oldItem.from === newItem.from && oldItem.to === newItem.to;
            },
        };
        this.history = new persisted_log_1.PersistedLog('kibana.timepicker.timeHistory', historyOptions, storage);
    }
    add(time) {
        if (!time || !time.from || !time.to) {
            return;
        }
        // time from/to can be strings or moment objects - convert to strings so always dealing with same types
        const justStringsTime = {
            from: moment_1.default.isMoment(time.from) ? time.from.toISOString() : time.from,
            to: moment_1.default.isMoment(time.to) ? time.to.toISOString() : time.to,
        };
        this.history.add(justStringsTime);
    }
    get() {
        return this.history.get();
    }
}
exports.TimeHistory = TimeHistory;
