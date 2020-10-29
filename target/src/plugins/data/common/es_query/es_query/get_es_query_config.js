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
exports.getEsQueryConfig = void 0;
const __1 = require("../../");
function getEsQueryConfig(config) {
    const allowLeadingWildcards = config.get(__1.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS);
    const queryStringOptions = config.get(__1.UI_SETTINGS.QUERY_STRING_OPTIONS);
    const ignoreFilterIfFieldNotInIndex = config.get(__1.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX);
    const dateFormatTZ = config.get('dateFormat:tz');
    return {
        allowLeadingWildcards,
        queryStringOptions,
        ignoreFilterIfFieldNotInIndex,
        dateFormatTZ,
    };
}
exports.getEsQueryConfig = getEsQueryConfig;
