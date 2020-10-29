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
exports.TimeBuckets = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const common_1 = require("../../../../../../common");
const calc_auto_interval_1 = require("./calc_auto_interval");
const calc_es_interval_1 = require("./calc_es_interval");
function isObject(o) {
    return lodash_1.isObject(o);
}
function isValidMoment(m) {
    return m && 'isValid' in m && m.isValid();
}
/**
 * Helper class for wrapping the concept of an "Interval",
 * which describes a timespan that will separate moments.
 *
 * @param {state} object - one of ""
 * @param {[type]} display [description]
 */
class TimeBuckets {
    constructor(timeBucketConfig) {
        this._originalInterval = null;
        this._timeBucketConfig = timeBucketConfig;
    }
    /**
     * Get a moment duration object representing
     * the distance between the bounds, if the bounds
     * are set.
     *
     * @return {moment.duration|undefined}
     */
    getDuration() {
        if (this._ub === undefined || this._lb === undefined || !this.hasBounds()) {
            return;
        }
        const difference = this._ub.valueOf() - this._lb.valueOf();
        return moment_1.default.duration(difference, 'ms');
    }
    /**
     * Set the bounds that these buckets are expected to cover.
     * This is required to support interval "auto" as well
     * as interval scaling.
     *
     * @param {object} input - an object with properties min and max,
     *                       representing the edges for the time span
     *                       we should cover
     *
     * @returns {undefined}
     */
    setBounds(input) {
        if (!input)
            return this.clearBounds();
        let bounds;
        if (lodash_1.isPlainObject(input) && !Array.isArray(input)) {
            // accept the response from timefilter.getActiveBounds()
            bounds = [input.min, input.max];
        }
        else {
            bounds = Array.isArray(input) ? input : [];
        }
        const moments = lodash_1.sortBy(bounds, Number);
        const valid = moments.length === 2 && moments.every(isValidMoment);
        if (!valid) {
            this.clearBounds();
            throw new Error('invalid bounds set: ' + input);
        }
        this._lb = moments.shift();
        this._ub = moments.pop();
        const duration = this.getDuration();
        if (!duration || duration.asSeconds() < 0) {
            throw new TypeError('Intervals must be positive');
        }
    }
    /**
     * Clear the stored bounds
     *
     * @return {undefined}
     */
    clearBounds() {
        this._lb = this._ub = undefined;
    }
    /**
     * Check to see if we have received bounds yet
     *
     * @return {Boolean}
     */
    hasBounds() {
        return isValidMoment(this._ub) && isValidMoment(this._lb);
    }
    /**
     * Return the current bounds, if we have any.
     *
     * THIS DOES NOT CLONE THE BOUNDS, so editing them
     * may have unexpected side-effects. Always
     * call bounds.min.clone() before editing
     *
     * @return {object|undefined} - If bounds are not defined, this
     *                      returns undefined, else it returns the bounds
     *                      for these buckets. This object has two props,
     *                      min and max. Each property will be a moment()
     *                      object
     *
     */
    getBounds() {
        if (!this.hasBounds())
            return;
        return {
            min: this._lb,
            max: this._ub,
        };
    }
    /**
     * Update the interval at which buckets should be
     * generated.
     *
     * Input can be one of the following:
     *  - Any object from src/legacy/ui/agg_types.js
     *  - "auto"
     *  - Pass a valid moment unit
     *
     * @param {object|string|moment.duration} input - see desc
     */
    setInterval(input) {
        let interval = input;
        // selection object -> val
        if (isObject(input) && !moment_1.default.isDuration(input)) {
            interval = input.val;
        }
        if (!interval || interval === 'auto') {
            this._i = 'auto';
            return;
        }
        if (lodash_1.isString(interval)) {
            input = interval;
            // Preserve the original units because they're lost when the interval is converted to a
            // moment duration object.
            this._originalInterval = input;
            interval = common_1.parseInterval(interval);
            if (interval === null || +interval === 0) {
                interval = null;
            }
        }
        // if the value wasn't converted to a duration, and isn't
        // already a duration, we have a problem
        if (!moment_1.default.isDuration(interval)) {
            throw new TypeError('"' + input + '" is not a valid interval.');
        }
        this._i = interval;
    }
    /**
     * Get the interval for the buckets. If the
     * number of buckets created by the interval set
     * is larger than config:histogram:maxBars then the
     * interval will be scaled up. If the number of buckets
     * created is less than one, the interval is scaled back.
     *
     * The interval object returned is a moment.duration
     * object that has been decorated with the following
     * properties.
     *
     * interval.description: a text description of the interval.
     *   designed to be used list "field per {{ desc }}".
     *     - "minute"
     *     - "10 days"
     *     - "3 years"
     *
     * interval.expression: the elasticsearch expression that creates this
     *   interval. If the interval does not properly form an elasticsearch
     *   expression it will be forced into one.
     *
     * interval.scaled: the interval was adjusted to
     *   accommodate the maxBars setting.
     *
     * interval.scale: the number that y-values should be
     *   multiplied by
     */
    getInterval(useNormalizedEsInterval = true) {
        const duration = this.getDuration();
        // either pull the interval from state or calculate the auto-interval
        const readInterval = () => {
            const interval = this._i;
            if (moment_1.default.isDuration(interval))
                return interval;
            return calc_auto_interval_1.calcAutoIntervalNear(this._timeBucketConfig['histogram:barTarget'], Number(duration));
        };
        const parsedInterval = readInterval();
        // check to see if the interval should be scaled, and scale it if so
        const maybeScaleInterval = (interval) => {
            if (!this.hasBounds() || !duration) {
                return interval;
            }
            const maxLength = this._timeBucketConfig['histogram:maxBars'];
            const approxLen = Number(duration) / Number(interval);
            let scaled;
            if (approxLen > maxLength) {
                scaled = calc_auto_interval_1.calcAutoIntervalLessThan(maxLength, Number(duration));
            }
            else {
                return interval;
            }
            if (+scaled === +interval)
                return interval;
            interval = decorateInterval(interval);
            return Object.assign(scaled, {
                preScaled: interval,
                scale: Number(interval) / Number(scaled),
                scaled: true,
            });
        };
        // append some TimeBuckets specific props to the interval
        const decorateInterval = (interval) => {
            const esInterval = useNormalizedEsInterval
                ? calc_es_interval_1.convertDurationToNormalizedEsInterval(interval)
                : calc_es_interval_1.convertIntervalToEsInterval(String(this._originalInterval));
            const prettyUnits = moment_1.default.normalizeUnits(esInterval.unit);
            return Object.assign(interval, {
                description: esInterval.value === 1 ? prettyUnits : esInterval.value + ' ' + prettyUnits + 's',
                esValue: esInterval.value,
                esUnit: esInterval.unit,
                expression: esInterval.expression,
            });
        };
        if (useNormalizedEsInterval) {
            return decorateInterval(maybeScaleInterval(parsedInterval));
        }
        else {
            return decorateInterval(parsedInterval);
        }
    }
    /**
     * Get a date format string that will represent dates that
     * progress at our interval.
     *
     * Since our interval can be as small as 1ms, the default
     * date format is usually way too much. with `dateFormat:scaled`
     * users can modify how dates are formatted within series
     * produced by TimeBuckets
     *
     * @return {string}
     */
    getScaledDateFormat() {
        const interval = this.getInterval();
        const rules = this._timeBucketConfig['dateFormat:scaled'];
        for (let i = rules.length - 1; i >= 0; i--) {
            const rule = rules[i];
            if (!rule[0] || (interval && interval >= moment_1.default.duration(rule[0]))) {
                return rule[1];
            }
        }
        return this._timeBucketConfig.dateFormat;
    }
}
exports.TimeBuckets = TimeBuckets;
