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
exports.DateFormat = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const common_1 = require("../../../common");
class DateFormat extends common_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.memoizedConverter = lodash_1.noop;
        this.memoizedPattern = '';
        this.timeZone = '';
        this.textConvert = (val) => {
            // don't give away our ref to converter so
            // we can hot-swap when config changes
            const pattern = this.param('pattern');
            const timezone = this.param('timezone');
            const timezoneChanged = this.timeZone !== timezone;
            const datePatternChanged = this.memoizedPattern !== pattern;
            if (timezoneChanged || datePatternChanged) {
                this.timeZone = timezone;
                this.memoizedPattern = pattern;
                this.memoizedConverter = lodash_1.memoize(function converter(value) {
                    if (value === null || value === undefined) {
                        return '-';
                    }
                    const date = moment_1.default(value);
                    if (date.isValid()) {
                        return date.format(pattern);
                    }
                    else {
                        return value;
                    }
                });
            }
            return this.memoizedConverter(val);
        };
    }
    getParamDefaults() {
        return {
            pattern: this.getConfig('dateFormat'),
            timezone: this.getConfig('dateFormat:tz'),
        };
    }
}
exports.DateFormat = DateFormat;
DateFormat.id = common_1.FIELD_FORMAT_IDS.DATE;
DateFormat.title = i18n_1.i18n.translate('data.fieldFormats.date.title', {
    defaultMessage: 'Date',
});
DateFormat.fieldType = common_1.KBN_FIELD_TYPES.DATE;
