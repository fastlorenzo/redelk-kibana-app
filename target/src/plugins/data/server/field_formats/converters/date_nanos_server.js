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
exports.DateNanosFormat = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const date_nanos_shared_1 = require("../../../common/field_formats/converters/date_nanos_shared");
class DateNanosFormatServer extends date_nanos_shared_1.DateNanosFormat {
    constructor() {
        super(...arguments);
        this.textConvert = (val) => {
            // don't give away our ref to converter so
            // we can hot-swap when config changes
            const pattern = this.param('pattern');
            const timezone = this.param('timezone');
            const fractPattern = date_nanos_shared_1.analysePatternForFract(pattern);
            const fallbackPattern = this.param('patternFallback');
            const timezoneChanged = this.timeZone !== timezone;
            const datePatternChanged = this.memoizedPattern !== pattern;
            if (timezoneChanged || datePatternChanged) {
                this.timeZone = timezone;
                this.memoizedPattern = pattern;
                this.memoizedConverter = lodash_1.memoize((value) => {
                    if (value === null || value === undefined) {
                        return '-';
                    }
                    /* On the server, importing moment returns a new instance. Unlike on
                     * the client side, it doesn't have the dateFormat:tz configuration
                     * baked in.
                     * We need to set the timezone manually here. The date is taken in as
                     * UTC and converted into the desired timezone. */
                    let date;
                    if (this.timeZone === 'Browser') {
                        // Assume a warning has been logged that this can be unpredictable. It
                        // would be too verbose to log anything here.
                        date = moment_timezone_1.default.utc(val);
                    }
                    else {
                        date = moment_timezone_1.default.utc(val).tz(this.timeZone);
                    }
                    if (typeof value !== 'string' && date.isValid()) {
                        // fallback for max/min aggregation, where unixtime in ms is returned as a number
                        // aggregations in Elasticsearch generally just return ms
                        return date.format(fallbackPattern);
                    }
                    else if (date.isValid()) {
                        return date_nanos_shared_1.formatWithNanos(date, value, fractPattern);
                    }
                    else {
                        return value;
                    }
                });
            }
            return this.memoizedConverter(val);
        };
    }
}
exports.DateNanosFormat = DateNanosFormatServer;
