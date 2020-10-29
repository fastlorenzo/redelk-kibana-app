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
exports.InvalidEsCalendarIntervalError = void 0;
const i18n_1 = require("@kbn/i18n");
class InvalidEsCalendarIntervalError extends Error {
    constructor(interval, value, unit, type) {
        super(i18n_1.i18n.translate('data.parseEsInterval.invalidEsCalendarIntervalErrorMessage', {
            defaultMessage: 'Invalid calendar interval: {interval}, value must be 1',
            values: { interval },
        }));
        this.interval = interval;
        this.value = value;
        this.unit = unit;
        this.type = type;
        this.name = 'InvalidEsCalendarIntervalError';
        this.value = value;
        this.unit = unit;
        this.type = type;
        // captureStackTrace is only available in the V8 engine, so any browser using
        // a different JS engine won't have access to this method.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidEsCalendarIntervalError);
        }
        // Babel doesn't support traditional `extends` syntax for built-in classes.
        // https://babeljs.io/docs/en/caveats/#classes
        Object.setPrototypeOf(this, InvalidEsCalendarIntervalError.prototype);
    }
}
exports.InvalidEsCalendarIntervalError = InvalidEsCalendarIntervalError;
