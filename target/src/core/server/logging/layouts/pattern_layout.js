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
exports.PatternLayout = exports.patternSchema = void 0;
const config_schema_1 = require("@kbn/config-schema");
const conversions_1 = require("./conversions");
/**
 * Default pattern used by PatternLayout if it's not overridden in the configuration.
 */
const DEFAULT_PATTERN = `[%date][%level][%logger]%meta %message`;
exports.patternSchema = config_schema_1.schema.string({
    validate: (string) => {
        conversions_1.DateConversion.validate(string);
    },
});
const patternLayoutSchema = config_schema_1.schema.object({
    highlight: config_schema_1.schema.maybe(config_schema_1.schema.boolean()),
    kind: config_schema_1.schema.literal('pattern'),
    pattern: config_schema_1.schema.maybe(exports.patternSchema),
});
const conversions = [
    conversions_1.LoggerConversion,
    conversions_1.MessageConversion,
    conversions_1.LevelConversion,
    conversions_1.MetaConversion,
    conversions_1.PidConversion,
    conversions_1.DateConversion,
];
/**
 * Layout that formats `LogRecord` using the `pattern` string with optional
 * color highlighting (eg. to make log messages easier to read in the terminal).
 * @internal
 */
class PatternLayout {
    constructor(pattern = DEFAULT_PATTERN, highlight = false) {
        this.pattern = pattern;
        this.highlight = highlight;
    }
    /**
     * Formats `LogRecord` into a string based on the specified `pattern` and `highlighting` options.
     * @param record Instance of `LogRecord` to format into string.
     */
    format(record) {
        let recordString = this.pattern;
        for (const conversion of conversions) {
            recordString = recordString.replace(conversion.pattern, conversion.convert.bind(null, record, this.highlight));
        }
        return recordString;
    }
}
exports.PatternLayout = PatternLayout;
PatternLayout.configSchema = patternLayoutSchema;
