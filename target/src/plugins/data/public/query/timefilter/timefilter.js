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
exports.Timefilter = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const rxjs_1 = require("rxjs");
const moment_1 = tslib_1.__importDefault(require("moment"));
const diff_time_picker_vals_1 = require("./lib/diff_time_picker_vals");
const get_force_now_1 = require("./lib/get_force_now");
const common_1 = require("../../../common");
// TODO: remove!
class Timefilter {
    constructor(config, timeHistory) {
        // Fired when isTimeRangeSelectorEnabled \ isAutoRefreshSelectorEnabled are toggled
        this.enabledUpdated$ = new rxjs_1.BehaviorSubject(false);
        // Fired when a user changes the timerange
        this.timeUpdate$ = new rxjs_1.Subject();
        // Fired when a user changes the the autorefresh settings
        this.refreshIntervalUpdate$ = new rxjs_1.Subject();
        // Used when an auto refresh is triggered
        this.autoRefreshFetch$ = new rxjs_1.Subject();
        this.fetch$ = new rxjs_1.Subject();
        this._isTimeRangeSelectorEnabled = false;
        this._isAutoRefreshSelectorEnabled = false;
        this._autoRefreshIntervalId = 0;
        this.getEnabledUpdated$ = () => {
            return this.enabledUpdated$.asObservable();
        };
        this.getTimeUpdate$ = () => {
            return this.timeUpdate$.asObservable();
        };
        this.getRefreshIntervalUpdate$ = () => {
            return this.refreshIntervalUpdate$.asObservable();
        };
        this.getAutoRefreshFetch$ = () => {
            return this.autoRefreshFetch$.asObservable();
        };
        this.getFetch$ = () => {
            return this.fetch$.asObservable();
        };
        this.getTime = () => {
            const { from, to } = this._time;
            return {
                ...this._time,
                from: moment_1.default.isMoment(from) ? from.toISOString() : from,
                to: moment_1.default.isMoment(to) ? to.toISOString() : to,
            };
        };
        /**
         * Updates timefilter time.
         * Emits 'timeUpdate' and 'fetch' events when time changes
         * @param {Object} time
         * @property {string|moment} time.from
         * @property {string|moment} time.to
         */
        this.setTime = (time) => {
            // Object.assign used for partially composed updates
            const newTime = Object.assign(this.getTime(), time);
            if (diff_time_picker_vals_1.areTimeRangesDifferent(this.getTime(), newTime)) {
                this._time = {
                    from: newTime.from,
                    to: newTime.to,
                };
                this._history.add(this._time);
                this.timeUpdate$.next();
                this.fetch$.next();
            }
        };
        this.getRefreshInterval = () => {
            return lodash_1.default.clone(this._refreshInterval);
        };
        /**
         * Set timefilter refresh interval.
         * @param {Object} refreshInterval
         * @property {number} time.value Refresh interval in milliseconds. Positive integer
         * @property {boolean} time.pause
         */
        this.setRefreshInterval = (refreshInterval) => {
            const prevRefreshInterval = this.getRefreshInterval();
            const newRefreshInterval = { ...prevRefreshInterval, ...refreshInterval };
            // If the refresh interval is <= 0 handle that as a paused refresh
            if (newRefreshInterval.value <= 0) {
                newRefreshInterval.value = 0;
                newRefreshInterval.pause = true;
            }
            this._refreshInterval = {
                value: newRefreshInterval.value,
                pause: newRefreshInterval.pause,
            };
            // Only send out an event if we already had a previous refresh interval (not for the initial set)
            // and the old and new refresh interval are actually different.
            if (prevRefreshInterval &&
                diff_time_picker_vals_1.areRefreshIntervalsDifferent(prevRefreshInterval, newRefreshInterval)) {
                this.refreshIntervalUpdate$.next();
                if (!newRefreshInterval.pause && newRefreshInterval.value !== 0) {
                    this.fetch$.next();
                }
            }
            // Clear the previous auto refresh interval and start a new one (if not paused)
            clearInterval(this._autoRefreshIntervalId);
            if (!newRefreshInterval.pause) {
                this._autoRefreshIntervalId = window.setInterval(() => this.autoRefreshFetch$.next(), newRefreshInterval.value);
            }
        };
        this.createFilter = (indexPattern, timeRange) => {
            return common_1.getTime(indexPattern, timeRange ? timeRange : this._time, {
                forceNow: this.getForceNow(),
            });
        };
        /**
         * Show the time bounds selector part of the time filter
         */
        this.enableTimeRangeSelector = () => {
            this._isTimeRangeSelectorEnabled = true;
            this.enabledUpdated$.next(true);
        };
        /**
         * Hide the time bounds selector part of the time filter
         */
        this.disableTimeRangeSelector = () => {
            this._isTimeRangeSelectorEnabled = false;
            this.enabledUpdated$.next(false);
        };
        /**
         * Show the auto refresh part of the time filter
         */
        this.enableAutoRefreshSelector = () => {
            this._isAutoRefreshSelectorEnabled = true;
            this.enabledUpdated$.next(true);
        };
        /**
         * Hide the auto refresh part of the time filter
         */
        this.disableAutoRefreshSelector = () => {
            this._isAutoRefreshSelectorEnabled = false;
            this.enabledUpdated$.next(false);
        };
        this.getForceNow = () => {
            return get_force_now_1.getForceNow();
        };
        this._history = timeHistory;
        this.timeDefaults = config.timeDefaults;
        this.refreshIntervalDefaults = config.refreshIntervalDefaults;
        this._time = config.timeDefaults;
        this.setRefreshInterval(config.refreshIntervalDefaults);
    }
    isTimeRangeSelectorEnabled() {
        return this._isTimeRangeSelectorEnabled;
    }
    isAutoRefreshSelectorEnabled() {
        return this._isAutoRefreshSelectorEnabled;
    }
    getBounds() {
        return this.calculateBounds(this._time);
    }
    calculateBounds(timeRange) {
        return common_1.calculateBounds(timeRange, { forceNow: this.getForceNow() });
    }
    getActiveBounds() {
        if (this.isTimeRangeSelectorEnabled()) {
            return this.getBounds();
        }
    }
    getTimeDefaults() {
        return lodash_1.default.cloneDeep(this.timeDefaults);
    }
    getRefreshIntervalDefaults() {
        return lodash_1.default.cloneDeep(this.refreshIntervalDefaults);
    }
}
exports.Timefilter = Timefilter;
