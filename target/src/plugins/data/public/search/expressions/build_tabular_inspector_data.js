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
exports.buildTabularInspectorData = void 0;
const safer_lodash_set_1 = require("@elastic/safer-lodash-set");
const public_1 = require("../../../../../plugins/inspector/public");
const create_filter_1 = require("./create_filter");
/**
 * @deprecated
 *
 * Do not use this function.
 *
 * @todo This function is used only by Courier. Courier will
 *   soon be removed, and this function will be deleted, too. If Courier is not removed,
 *   move this function inside Courier.
 *
 * ---
 *
 * This function builds tabular data from the response and attaches it to the
 * inspector. It will only be called when the data view in the inspector is opened.
 */
async function buildTabularInspectorData(table, { queryFilter, deserializeFieldFormat, }) {
    const aggConfigs = table.columns.map((column) => column.aggConfig);
    const rows = table.rows.map((row) => {
        return table.columns.reduce((prev, cur, colIndex) => {
            const value = row[cur.id];
            let format = cur.aggConfig.toSerializedFieldFormat();
            if (Object.keys(format).length < 1) {
                // If no format exists, fall back to string as a default
                format = { id: 'string' };
            }
            const fieldFormatter = deserializeFieldFormat(format);
            prev[`col-${colIndex}-${cur.aggConfig.id}`] = new public_1.FormattedData(value, fieldFormatter.convert(value));
            return prev;
        }, {});
    });
    const columns = table.columns.map((col, colIndex) => {
        const field = col.aggConfig.getField();
        const isCellContentFilterable = col.aggConfig.isFilterable() && (!field || field.filterable);
        return {
            name: col.name,
            field: `col-${colIndex}-${col.aggConfig.id}`,
            filter: isCellContentFilterable &&
                ((value) => {
                    const rowIndex = rows.findIndex((row) => row[`col-${colIndex}-${col.aggConfig.id}`].raw === value.raw);
                    const filter = create_filter_1.createFilter(aggConfigs, table, colIndex, rowIndex, value.raw);
                    if (filter) {
                        queryFilter.addFilters(filter);
                    }
                }),
            filterOut: isCellContentFilterable &&
                ((value) => {
                    const rowIndex = rows.findIndex((row) => row[`col-${colIndex}-${col.aggConfig.id}`].raw === value.raw);
                    const filter = create_filter_1.createFilter(aggConfigs, table, colIndex, rowIndex, value.raw);
                    if (filter) {
                        const notOther = value.raw !== '__other__';
                        const notMissing = value.raw !== '__missing__';
                        if (Array.isArray(filter)) {
                            filter.forEach((f) => safer_lodash_set_1.set(f, 'meta.negate', notOther && notMissing));
                        }
                        else {
                            safer_lodash_set_1.set(filter, 'meta.negate', notOther && notMissing);
                        }
                        queryFilter.addFilters(filter);
                    }
                }),
        };
    });
    return { columns, rows };
}
exports.buildTabularInspectorData = buildTabularInspectorData;
