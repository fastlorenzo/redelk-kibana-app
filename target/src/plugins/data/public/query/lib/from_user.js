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
exports.fromUser = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
/**
 * Take userInput from the user and make it into a query object
 * @returns {object}
 * @param userInput
 */
function fromUser(userInput) {
    const matchAll = '';
    if (lodash_1.default.isEmpty(userInput)) {
        return '';
    }
    if (lodash_1.default.isObject(userInput)) {
        return userInput;
    }
    userInput = userInput || '';
    if (typeof userInput === 'string') {
        const trimmedUserInput = userInput.trim();
        if (trimmedUserInput.length === 0) {
            return matchAll;
        }
        if (trimmedUserInput[0] === '{') {
            try {
                return JSON.parse(trimmedUserInput);
            }
            catch (e) {
                return userInput;
            }
        }
        else {
            return userInput;
        }
    }
}
exports.fromUser = fromUser;
