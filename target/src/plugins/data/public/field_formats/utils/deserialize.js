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
exports.deserializeFieldFormat = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../../../common");
const services_1 = require("../../../public/services");
const utils_1 = require("../../search/aggs/utils");
const getConfig = (key, defaultOverride) => services_1.getUiSettings().get(key, defaultOverride);
const DefaultFieldFormat = common_1.FieldFormat.from(lodash_1.identity);
exports.deserializeFieldFormat = function (serializedFieldFormat) {
    if (!serializedFieldFormat) {
        return new DefaultFieldFormat();
    }
    const getFormat = (mapping) => {
        const { id, params = {} } = mapping;
        if (id) {
            const Format = this.getType(id);
            if (Format) {
                return new Format(params, getConfig);
            }
        }
        return new DefaultFieldFormat();
    };
    // decorate getFormat to handle custom types created by aggs
    const getFieldFormat = utils_1.getFormatWithAggs(getFormat);
    return getFieldFormat(serializedFieldFormat);
};
