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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaByName = exports.Schemas = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importStar(require("lodash"));
const public_1 = require("../../data/public");
class Schemas {
    constructor(schemas) {
        this.all = [];
        this[_a] = [];
        this[_b] = [];
        lodash_1.default(schemas || [])
            .chain()
            .map((schema) => {
            if (!schema.name)
                throw new Error('all schema must have a unique name');
            if (schema.name === 'split') {
                schema.params = [
                    {
                        name: 'row',
                        default: true,
                    },
                ];
            }
            lodash_1.defaults(schema, {
                min: 0,
                max: Infinity,
                group: public_1.AggGroupNames.Buckets,
                title: schema.name,
                aggFilter: '*',
                editor: false,
                params: [],
            });
            return schema;
        })
            .tap((fullSchemas) => {
            this.all = fullSchemas;
        })
            .groupBy('group')
            .forOwn((group, groupName) => {
            // @ts-ignore
            this[groupName] = group;
        })
            .commit();
    }
}
exports.Schemas = Schemas;
_a = public_1.AggGroupNames.Buckets, _b = public_1.AggGroupNames.Metrics;
exports.getSchemaByName = (schemas, schemaName) => {
    return schemas.find((s) => s.name === schemaName) || {};
};
