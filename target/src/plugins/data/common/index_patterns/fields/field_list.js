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
exports.getIndexPatternFieldListCreator = void 0;
const lodash_1 = require("lodash");
const field_1 = require("./field");
exports.getIndexPatternFieldListCreator = ({ fieldFormats, onNotification, }) => (...fieldListParams) => {
    class FieldList extends Array {
        constructor(indexPattern, specs = [], shortDotsEnable = false) {
            super();
            this.byName = new Map();
            this.groups = new Map();
            this.setByName = (field) => this.byName.set(field.name, field);
            this.setByGroup = (field) => {
                if (typeof this.groups.get(field.type) === 'undefined') {
                    this.groups.set(field.type, new Map());
                }
                this.groups.get(field.type).set(field.name, field);
            };
            this.removeByGroup = (field) => this.groups.get(field.type).delete(field.name);
            this.getByName = (name) => this.byName.get(name);
            this.getByType = (type) => [...(this.groups.get(type) || new Map()).values()];
            this.add = (field) => {
                const newField = new field_1.Field(this.indexPattern, field, this.shortDotsEnable, {
                    fieldFormats,
                    onNotification,
                });
                this.push(newField);
                this.setByName(newField);
                this.setByGroup(newField);
            };
            this.remove = (field) => {
                this.removeByGroup(field);
                this.byName.delete(field.name);
                const fieldIndex = lodash_1.findIndex(this, { name: field.name });
                this.splice(fieldIndex, 1);
            };
            this.update = (field) => {
                const newField = new field_1.Field(this.indexPattern, field, this.shortDotsEnable, {
                    fieldFormats,
                    onNotification,
                });
                const index = this.findIndex((f) => f.name === newField.name);
                this.splice(index, 1, newField);
                this.setByName(newField);
                this.removeByGroup(newField);
                this.setByGroup(newField);
            };
            this.toSpec = () => {
                return [...this.map((field) => field.toSpec())];
            };
            this.indexPattern = indexPattern;
            this.shortDotsEnable = shortDotsEnable;
            specs.map((field) => this.add(field));
        }
    }
    return new FieldList(...fieldListParams);
};
