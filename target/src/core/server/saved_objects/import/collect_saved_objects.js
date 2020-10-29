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
exports.collectSavedObjects = void 0;
const streams_1 = require("../../../../legacy/utils/streams");
const create_limit_stream_1 = require("./create_limit_stream");
async function collectSavedObjects({ readStream, objectLimit, filter, supportedTypes, }) {
    const errors = [];
    const collectedObjects = await streams_1.createPromiseFromStreams([
        readStream,
        create_limit_stream_1.createLimitStream(objectLimit),
        streams_1.createFilterStream((obj) => {
            if (supportedTypes.includes(obj.type)) {
                return true;
            }
            errors.push({
                id: obj.id,
                type: obj.type,
                title: obj.attributes.title,
                error: {
                    type: 'unsupported_type',
                },
            });
            return false;
        }),
        streams_1.createFilterStream((obj) => (filter ? filter(obj) : true)),
        streams_1.createMapStream((obj) => {
            // Ensure migrations execute on every saved object
            return Object.assign({ migrationVersion: {} }, obj);
        }),
        streams_1.createConcatStream([]),
    ]);
    return {
        errors,
        collectedObjects,
    };
}
exports.collectSavedObjects = collectSavedObjects;
