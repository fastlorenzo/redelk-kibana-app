"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAsCsv = void 0;
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
const lodash_1 = require("lodash");
// @ts-ignore
const filesaver_1 = require("@elastic/filesaver");
const LINE_FEED_CHARACTER = '\r\n';
const nonAlphaNumRE = /[^a-zA-Z0-9]/;
const allDoubleQuoteRE = /"/g;
function escape(val, quoteValues) {
    if (lodash_1.isObject(val)) {
        val = val.valueOf();
    }
    val = String(val);
    if (quoteValues && nonAlphaNumRE.test(val)) {
        val = `"${val.replace(allDoubleQuoteRE, '""')}"`;
    }
    return val;
}
function buildCsv(columns, rows, csvSeparator, quoteValues, valueFormatter) {
    // Build the header row by its names
    const header = columns.map((col) => escape(col.name, quoteValues));
    // Convert the array of row objects to an array of row arrays
    const orderedFieldNames = columns.map((col) => col.field);
    const csvRows = rows.map((row) => {
        return orderedFieldNames.map((field) => escape(valueFormatter ? valueFormatter(row[field]) : row[field], quoteValues));
    });
    return ([header, ...csvRows].map((row) => row.join(csvSeparator)).join(LINE_FEED_CHARACTER) +
        LINE_FEED_CHARACTER); // Add \r\n after last line
}
function exportAsCsv({ filename, columns, rows, valueFormatter, csvSeparator, quoteValues, }) {
    const type = 'text/plain;charset=utf-8';
    const csv = new Blob([buildCsv(columns, rows, csvSeparator, quoteValues, valueFormatter)], {
        type,
    });
    filesaver_1.saveAs(csv, filename);
}
exports.exportAsCsv = exportAsCsv;
