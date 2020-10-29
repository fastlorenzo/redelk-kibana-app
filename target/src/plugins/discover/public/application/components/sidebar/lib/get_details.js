"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetails = void 0;
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
const visualize_url_utils_1 = require("./visualize_url_utils");
// @ts-ignore
const field_calculator_1 = require("./field_calculator");
function getDetails(field, indexPattern, state, columns, hits, services) {
    const details = {
        visualizeUrl: services.capabilities.visualize.show && visualize_url_utils_1.isFieldVisualizable(field, services.visualizations)
            ? visualize_url_utils_1.getVisualizeUrl(field, indexPattern, state, columns, services)
            : null,
        ...field_calculator_1.fieldCalculator.getFieldValueCounts({
            hits,
            field,
            count: 5,
            grouped: false,
        }),
    };
    if (details.buckets) {
        for (const bucket of details.buckets) {
            bucket.display = field.format.convert(bucket.value);
        }
    }
    return details;
}
exports.getDetails = getDetails;
