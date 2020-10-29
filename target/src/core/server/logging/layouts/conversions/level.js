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
exports.LevelConversion = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const log_level_1 = require("../../log_level");
const LEVEL_COLORS = new Map([
    [log_level_1.LogLevel.Fatal, chalk_1.default.red],
    [log_level_1.LogLevel.Error, chalk_1.default.red],
    [log_level_1.LogLevel.Warn, chalk_1.default.yellow],
    [log_level_1.LogLevel.Debug, chalk_1.default.green],
    [log_level_1.LogLevel.Trace, chalk_1.default.blue],
]);
exports.LevelConversion = {
    pattern: /%level/g,
    convert(record, highlight) {
        let message = record.level.id.toUpperCase().padEnd(5);
        if (highlight && LEVEL_COLORS.has(record.level)) {
            const color = LEVEL_COLORS.get(record.level);
            message = color(message);
        }
        return message;
    },
};
