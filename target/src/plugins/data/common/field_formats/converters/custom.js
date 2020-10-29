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
exports.createCustomFieldFormat = void 0;
const field_format_1 = require("../field_format");
const types_1 = require("../types");
exports.createCustomFieldFormat = (convert) => { var _a; return _a = class CustomFieldFormat extends field_format_1.FieldFormat {
        constructor() {
            super(...arguments);
            this.textConvert = convert;
        }
    },
    _a.id = types_1.FIELD_FORMAT_IDS.CUSTOM,
    _a; };
