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
exports.findListItems = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
/**
 * Search for visualizations and convert them into a list display-friendly format.
 */
async function findListItems({ visTypes, search, size, savedObjectsClient, mapSavedObjectApiHits, }) {
    const extensions = visTypes
        .map((v) => v.appExtensions?.visualizations)
        .filter(Boolean);
    const extensionByType = extensions.reduce((acc, m) => {
        return m.docTypes.reduce((_acc, type) => {
            acc[type] = m;
            return acc;
        }, acc);
    }, {});
    const searchOption = (field, ...defaults) => lodash_1.default(extensions).map(field).concat(defaults).compact().flatten().uniq().value();
    const searchOptions = {
        type: searchOption('docTypes', 'visualization'),
        searchFields: searchOption('searchFields', 'title^3', 'description'),
        search: search ? `${search}*` : undefined,
        perPage: size,
        page: 1,
        defaultSearchOperator: 'AND',
    };
    const { total, savedObjects } = await savedObjectsClient.find(searchOptions);
    return {
        total,
        hits: savedObjects.map((savedObject) => {
            const config = extensionByType[savedObject.type];
            if (config) {
                return config.toListItem(savedObject);
            }
            else {
                return mapSavedObjectApiHits(savedObject);
            }
        }),
    };
}
exports.findListItems = findListItems;
