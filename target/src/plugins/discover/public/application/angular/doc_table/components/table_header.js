"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableHeaderDirective = void 0;
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
const table_header_1 = require("./table_header/table_header");
const kibana_services_1 = require("../../../../kibana_services");
const common_1 = require("../../../../../common");
const public_1 = require("../../../../../../data/public");
function createTableHeaderDirective(reactDirective) {
    const { uiSettings: config } = kibana_services_1.getServices();
    return reactDirective(table_header_1.TableHeader, [
        ['columns', { watchDepth: 'collection' }],
        ['hideTimeColumn', { watchDepth: 'value' }],
        ['indexPattern', { watchDepth: 'reference' }],
        ['isShortDots', { watchDepth: 'value' }],
        ['onChangeSortOrder', { watchDepth: 'reference' }],
        ['onMoveColumn', { watchDepth: 'reference' }],
        ['onRemoveColumn', { watchDepth: 'reference' }],
        ['sortOrder', { watchDepth: 'collection' }],
    ], { restrict: 'A' }, {
        hideTimeColumn: config.get(common_1.DOC_HIDE_TIME_COLUMN_SETTING, false),
        isShortDots: config.get(public_1.UI_SETTINGS.SHORT_DOTS_ENABLE),
        defaultSortOrder: config.get(common_1.SORT_DEFAULT_ORDER_SETTING, 'desc'),
    });
}
exports.createTableHeaderDirective = createTableHeaderDirective;
