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
exports.FieldParamType = void 0;
const i18n_1 = require("@kbn/i18n");
const common_1 = require("../../../../../../plugins/kibana_utils/common");
const base_1 = require("./base");
const utils_1 = require("../utils");
const common_2 = require("../../../../common");
const filterByType = utils_1.propFilter('type');
class FieldParamType extends base_1.BaseParamType {
    constructor(config) {
        super(config);
        this.required = true;
        this.scriptable = true;
        /**
         * filter the fields to the available ones
         */
        this.getAvailableFields = (aggConfig) => {
            const fields = aggConfig.getIndexPattern().fields;
            const filteredFields = fields.filter((field) => {
                const { onlyAggregatable, scriptable, filterFieldTypes } = this;
                if ((onlyAggregatable && (!field.aggregatable || common_2.isNestedField(field))) ||
                    (!scriptable && field.scripted)) {
                    return false;
                }
                return filterByType([field], filterFieldTypes).length !== 0;
            });
            return filteredFields;
        };
        this.filterFieldTypes = config.filterFieldTypes || '*';
        this.onlyAggregatable = config.onlyAggregatable !== false;
        if (!config.write) {
            this.write = (aggConfig, output) => {
                const field = aggConfig.getField();
                if (!field) {
                    throw new TypeError(i18n_1.i18n.translate('data.search.aggs.paramTypes.field.requiredFieldParameterErrorMessage', {
                        defaultMessage: '{fieldParameter} is a required parameter',
                        values: {
                            fieldParameter: '"field"',
                        },
                    }));
                }
                if (field.scripted) {
                    output.params.script = {
                        source: field.script,
                        lang: field.lang,
                    };
                }
                else {
                    output.params.field = field.name;
                }
            };
        }
        this.serialize = (field) => {
            return field.name;
        };
        this.deserialize = (fieldName, aggConfig) => {
            if (!aggConfig) {
                throw new Error('aggConfig was not provided to FieldParamType deserialize function');
            }
            const field = aggConfig.getIndexPattern().fields.getByName(fieldName);
            if (!field) {
                throw new common_1.SavedObjectNotFound('index-pattern-field', fieldName);
            }
            const validField = this.getAvailableFields(aggConfig).find((f) => f.name === fieldName);
            if (!validField) {
                throw new Error(i18n_1.i18n.translate('data.search.aggs.paramTypes.field.invalidSavedFieldParameterErrorMessage', {
                    defaultMessage: 'Saved {fieldParameter} parameter is now invalid. Please select a new field.',
                    values: {
                        fieldParameter: '"field"',
                    },
                }));
            }
            return validField;
        };
    }
}
exports.FieldParamType = FieldParamType;
