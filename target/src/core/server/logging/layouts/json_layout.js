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
exports.JsonLayout = void 0;
const tslib_1 = require("tslib");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const config_schema_1 = require("@kbn/config-schema");
const { literal, object } = config_schema_1.schema;
const jsonLayoutSchema = object({
    kind: literal('json'),
});
/**
 * Layout that just converts `LogRecord` into JSON string.
 * @internal
 */
class JsonLayout {
    static errorToSerializableObject(error) {
        if (error === undefined) {
            return error;
        }
        return {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
    }
    format(record) {
        return JSON.stringify({
            '@timestamp': moment_timezone_1.default(record.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            context: record.context,
            error: JsonLayout.errorToSerializableObject(record.error),
            level: record.level.id.toUpperCase(),
            message: record.message,
            meta: record.meta,
            pid: record.pid,
        });
    }
}
exports.JsonLayout = JsonLayout;
JsonLayout.configSchema = jsonLayoutSchema;
