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
exports.ExpressionType = void 0;
const get_type_1 = require("./get_type");
class ExpressionType {
    constructor(definition) {
        this.definition = definition;
        this.getToFn = (typeName) => !this.definition.to ? undefined : this.definition.to[typeName] || this.definition.to['*'];
        this.getFromFn = (typeName) => !this.definition.from ? undefined : this.definition.from[typeName] || this.definition.from['*'];
        this.castsTo = (value) => typeof this.getToFn(value) === 'function';
        this.castsFrom = (value) => typeof this.getFromFn(value) === 'function';
        this.to = (value, toTypeName, types) => {
            const typeName = get_type_1.getType(value);
            if (typeName !== this.name) {
                throw new Error(`Can not cast object of type '${typeName}' using '${this.name}'`);
            }
            else if (!this.castsTo(toTypeName)) {
                throw new Error(`Can not cast '${typeName}' to '${toTypeName}'`);
            }
            return this.getToFn(toTypeName)(value, types);
        };
        this.from = (value, types) => {
            const typeName = get_type_1.getType(value);
            if (!this.castsFrom(typeName)) {
                throw new Error(`Can not cast '${this.name}' from ${typeName}`);
            }
            return this.getFromFn(typeName)(value, types);
        };
        const { name, help, deserialize, serialize, validate } = definition;
        this.name = name;
        this.help = help || '';
        this.validate = validate || (() => { });
        // Optional
        this.create = definition.create;
        this.serialize = serialize;
        this.deserialize = deserialize;
    }
}
exports.ExpressionType = ExpressionType;
