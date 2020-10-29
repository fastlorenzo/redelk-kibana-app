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
exports.BoolFormat = void 0;
const i18n_1 = require("@kbn/i18n");
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const types_2 = require("../types");
const utils_1 = require("../utils");
class BoolFormat extends field_format_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.textConvert = (value) => {
            if (typeof value === 'string') {
                value = value.trim().toLowerCase();
            }
            switch (value) {
                case false:
                case 0:
                case 'false':
                case 'no':
                    return 'false';
                case true:
                case 1:
                case 'true':
                case 'yes':
                    return 'true';
                default:
                    return utils_1.asPrettyString(value);
            }
        };
    }
}
exports.BoolFormat = BoolFormat;
BoolFormat.id = types_2.FIELD_FORMAT_IDS.BOOLEAN;
BoolFormat.title = i18n_1.i18n.translate('data.fieldFormats.boolean.title', {
    defaultMessage: 'Boolean',
});
BoolFormat.fieldType = [types_1.KBN_FIELD_TYPES.BOOLEAN, types_1.KBN_FIELD_TYPES.NUMBER, types_1.KBN_FIELD_TYPES.STRING];
