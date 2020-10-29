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
exports.Collector = void 0;
class Collector {
    /*
     * @param {Object} logger - logger object
     * @param {String} options.type - property name as the key for the data
     * @param {Function} options.init (optional) - initialization function
     * @param {Function} options.fetch - function to query data
     * @param {Function} options.formatForBulkUpload - optional
     * @param {Function} options.rest - optional other properties
     */
    constructor(log, { type, init, fetch, formatForBulkUpload, isReady, ...options }) {
        this.log = log;
        if (type === undefined) {
            throw new Error('Collector must be instantiated with a options.type string property');
        }
        if (typeof init !== 'undefined' && typeof init !== 'function') {
            throw new Error('If init property is passed, Collector must be instantiated with a options.init as a function property');
        }
        if (typeof fetch !== 'function') {
            throw new Error('Collector must be instantiated with a options.fetch function property');
        }
        Object.assign(this, options); // spread in other properties and mutate "this"
        this.type = type;
        this.init = init;
        this.fetch = fetch;
        this.isReady = typeof isReady === 'function' ? isReady : () => true;
        this._formatForBulkUpload = formatForBulkUpload;
    }
    formatForBulkUpload(result) {
        if (this._formatForBulkUpload) {
            return this._formatForBulkUpload(result);
        }
        else {
            return this.defaultFormatterForBulkUpload(result);
        }
    }
    defaultFormatterForBulkUpload(result) {
        return {
            type: this.type,
            payload: result,
        };
    }
}
exports.Collector = Collector;
