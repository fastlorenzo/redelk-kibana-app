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
exports.distinctUntilChangedWithInitialValue = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function distinctUntilChangedWithInitialValue(initialValue, compare) {
    return (input$) => rxjs_1.scheduled([isPromise(initialValue) ? rxjs_1.from(initialValue) : [initialValue], input$], rxjs_1.queueScheduler).pipe(operators_1.concatAll(), operators_1.distinctUntilChanged(compare), operators_1.skip(1));
}
exports.distinctUntilChangedWithInitialValue = distinctUntilChangedWithInitialValue;
function isPromise(value) {
    return (!!value &&
        typeof value === 'object' &&
        'then' in value &&
        typeof value.then === 'function' &&
        !('subscribe' in value));
}
