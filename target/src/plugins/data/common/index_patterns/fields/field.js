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
exports.Field = void 0;
const i18n_1 = require("@kbn/i18n");
// @ts-ignore
const obj_define_1 = require("./obj_define");
const common_1 = require("../../../common");
class Field {
    constructor(indexPattern, spec, shortDotsEnable, { fieldFormats, onNotification }) {
        // only providing type info as constructor returns new object instead of `this`
        this.toSpec = () => ({});
        // unwrap old instances of Field
        if (spec instanceof Field)
            spec = spec.$$spec;
        // construct this object using ObjDefine class, which
        // extends the Field.prototype but gets it's properties
        // defined using the logic below
        const obj = new obj_define_1.ObjDefine(spec, Field.prototype);
        if (spec.name === '_source') {
            spec.type = '_source';
        }
        // find the type for this field, fallback to unknown type
        let type = common_1.getKbnFieldType(spec.type);
        if (spec.type && !type) {
            const title = i18n_1.i18n.translate('data.indexPatterns.unknownFieldHeader', {
                values: { type: spec.type },
                defaultMessage: 'Unknown field type {type}',
            });
            const text = i18n_1.i18n.translate('data.indexPatterns.unknownFieldErrorMessage', {
                values: { name: spec.name, title: indexPattern.title },
                defaultMessage: 'Field {name} in indexPattern {title} is using an unknown field type.',
            });
            onNotification({ title, text, color: 'danger', iconType: 'alert' });
        }
        if (!type)
            type = common_1.getKbnFieldType('unknown');
        let format = spec.format;
        if (!common_1.FieldFormat.isInstanceOfFieldFormat(format)) {
            format =
                (indexPattern.fieldFormatMap && indexPattern.fieldFormatMap[spec.name]) ||
                    fieldFormats.getDefaultInstance(spec.type, spec.esTypes);
        }
        const indexed = !!spec.indexed;
        const scripted = !!spec.scripted;
        const searchable = !!spec.searchable || scripted;
        const aggregatable = !!spec.aggregatable || scripted;
        const readFromDocValues = !!spec.readFromDocValues && !scripted;
        const sortable = spec.name === '_score' || ((indexed || aggregatable) && type && type.sortable);
        const filterable = spec.name === '_id' || scripted || ((indexed || searchable) && type && type.filterable);
        const visualizable = aggregatable;
        this.name = '';
        obj.fact('name');
        this.type = '';
        obj.fact('type');
        obj.fact('esTypes');
        obj.writ('count', spec.count || 0);
        // scripted objs
        obj.fact('scripted', scripted);
        obj.writ('script', scripted ? spec.script : null);
        obj.writ('lang', scripted ? spec.lang || 'painless' : null);
        // stats
        obj.fact('searchable', searchable);
        obj.fact('aggregatable', aggregatable);
        obj.fact('readFromDocValues', readFromDocValues);
        // usage flags, read-only and won't be saved
        obj.comp('format', format);
        obj.comp('sortable', sortable);
        obj.comp('filterable', filterable);
        obj.comp('visualizable', visualizable);
        // computed values
        obj.comp('indexPattern', indexPattern);
        obj.comp('displayName', shortDotsEnable ? common_1.shortenDottedString(spec.name) : spec.name);
        this.$$spec = spec;
        obj.comp('$$spec', spec);
        // conflict info
        obj.writ('conflictDescriptions');
        // multi info
        obj.fact('subType');
        const newObj = obj.create();
        newObj.toSpec = function () {
            return {
                count: this.count,
                script: this.script,
                lang: this.lang,
                conflictDescriptions: this.conflictDescriptions,
                name: this.name,
                type: this.type,
                esTypes: this.esTypes,
                scripted: this.scripted,
                searchable: this.searchable,
                aggregatable: this.aggregatable,
                readFromDocValues: this.readFromDocValues,
                subType: this.subType,
                format: this.indexPattern?.fieldFormatMap[this.name]?.toJSON() || undefined,
            };
        };
        return newObj;
    }
}
exports.Field = Field;
