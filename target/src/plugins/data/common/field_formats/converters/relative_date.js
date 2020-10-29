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
exports.RelativeDateFormat = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const moment_1 = tslib_1.__importDefault(require("moment"));
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const types_2 = require("../types");
class RelativeDateFormat extends field_format_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.textConvert = (val) => {
            if (val === null || val === undefined) {
                return '-';
            }
            const date = moment_1.default(val);
            if (date.isValid()) {
                return date.fromNow();
            }
            else {
                return val;
            }
        };
    }
}
exports.RelativeDateFormat = RelativeDateFormat;
RelativeDateFormat.id = types_2.FIELD_FORMAT_IDS.RELATIVE_DATE;
RelativeDateFormat.title = i18n_1.i18n.translate('data.fieldFormats.relative_date.title', {
    defaultMessage: 'Relative date',
});
RelativeDateFormat.fieldType = types_1.KBN_FIELD_TYPES.DATE;
