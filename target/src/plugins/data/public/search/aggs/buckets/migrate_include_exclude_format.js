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
exports.migrateIncludeExcludeFormat = exports.isStringOrNumberType = exports.isStringType = exports.isNumberType = exports.isType = void 0;
const lodash_1 = require("lodash");
exports.isType = (...types) => {
    return (agg) => {
        const field = agg.params.field;
        return types.some((type) => field && field.type === type);
    };
};
exports.isNumberType = exports.isType('number');
exports.isStringType = exports.isType('string');
exports.isStringOrNumberType = exports.isType('string', 'number');
exports.migrateIncludeExcludeFormat = {
    serialize(value, agg) {
        if (this.shouldShow && !this.shouldShow(agg))
            return;
        if (!value || lodash_1.isString(value) || Array.isArray(value))
            return value;
        else
            return value.pattern;
    },
    write(aggConfig, output) {
        const value = aggConfig.getParam(this.name);
        if (Array.isArray(value) && value.length > 0 && exports.isNumberType(aggConfig)) {
            const parsedValue = value.filter((val) => Number.isFinite(val));
            if (parsedValue.length) {
                output.params[this.name] = parsedValue;
            }
        }
        else if (lodash_1.isObject(value)) {
            output.params[this.name] = value.pattern;
        }
        else if (value && exports.isStringType(aggConfig)) {
            output.params[this.name] = value;
        }
    },
};
