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
exports.StringFormat = void 0;
const i18n_1 = require("@kbn/i18n");
const utils_1 = require("../utils");
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const types_2 = require("../types");
const utils_2 = require("../../utils");
const TRANSFORM_OPTIONS = [
    {
        kind: false,
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.none', {
            defaultMessage: '- None -',
        }),
    },
    {
        kind: 'lower',
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.lower', {
            defaultMessage: 'Lower Case',
        }),
    },
    {
        kind: 'upper',
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.upper', {
            defaultMessage: 'Upper Case',
        }),
    },
    {
        kind: 'title',
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.title', {
            defaultMessage: 'Title Case',
        }),
    },
    {
        kind: 'short',
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.short', {
            defaultMessage: 'Short Dots',
        }),
    },
    {
        kind: 'base64',
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.base64', {
            defaultMessage: 'Base64 Decode',
        }),
    },
    {
        kind: 'urlparam',
        text: i18n_1.i18n.translate('data.fieldFormats.string.transformOptions.url', {
            defaultMessage: 'URL Param Decode',
        }),
    },
];
const DEFAULT_TRANSFORM_OPTION = false;
class StringFormat extends field_format_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.textConvert = (val) => {
            switch (this.param('transform')) {
                case 'lower':
                    return String(val).toLowerCase();
                case 'upper':
                    return String(val).toUpperCase();
                case 'title':
                    return this.toTitleCase(val);
                case 'short':
                    return utils_2.shortenDottedString(val);
                case 'base64':
                    return this.base64Decode(val);
                case 'urlparam':
                    return decodeURIComponent(val);
                default:
                    return utils_1.asPrettyString(val);
            }
        };
    }
    getParamDefaults() {
        return {
            transform: DEFAULT_TRANSFORM_OPTION,
        };
    }
    base64Decode(val) {
        try {
            return Buffer.from(val, 'base64').toString('utf8');
        }
        catch (e) {
            return utils_1.asPrettyString(val);
        }
    }
    toTitleCase(val) {
        return val.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}
exports.StringFormat = StringFormat;
StringFormat.id = types_2.FIELD_FORMAT_IDS.STRING;
StringFormat.title = i18n_1.i18n.translate('data.fieldFormats.string.title', {
    defaultMessage: 'String',
});
StringFormat.fieldType = [
    types_1.KBN_FIELD_TYPES.NUMBER,
    types_1.KBN_FIELD_TYPES.BOOLEAN,
    types_1.KBN_FIELD_TYPES.DATE,
    types_1.KBN_FIELD_TYPES.IP,
    types_1.KBN_FIELD_TYPES.ATTACHMENT,
    types_1.KBN_FIELD_TYPES.GEO_POINT,
    types_1.KBN_FIELD_TYPES.GEO_SHAPE,
    types_1.KBN_FIELD_TYPES.STRING,
    types_1.KBN_FIELD_TYPES.MURMUR3,
    types_1.KBN_FIELD_TYPES.UNKNOWN,
    types_1.KBN_FIELD_TYPES.CONFLICT,
];
StringFormat.transformOptions = TRANSFORM_OPTIONS;
