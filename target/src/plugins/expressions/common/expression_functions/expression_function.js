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
exports.ExpressionFunction = void 0;
const expression_function_parameter_1 = require("./expression_function_parameter");
class ExpressionFunction {
    constructor(functionDefinition) {
        /**
         * Specification of expression function parameters.
         */
        this.args = {};
        this.accepts = (type) => {
            // If you don't tell us input types, we'll assume you don't care what you get.
            if (!this.inputTypes)
                return true;
            return this.inputTypes.indexOf(type) > -1;
        };
        const { name, type, aliases, fn, help, args, inputTypes, context } = functionDefinition;
        this.name = name;
        this.type = type;
        this.aliases = aliases || [];
        this.fn = (input, params, handlers) => Promise.resolve(fn(input, params, handlers));
        this.help = help || '';
        this.inputTypes = inputTypes || context?.types;
        for (const [key, arg] of Object.entries(args || {})) {
            this.args[key] = new expression_function_parameter_1.ExpressionFunctionParameter(key, arg);
        }
    }
}
exports.ExpressionFunction = ExpressionFunction;
