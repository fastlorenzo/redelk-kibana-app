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
exports.DocTitleService = void 0;
const lodash_1 = require("lodash");
const defaultTitle = [];
const titleSeparator = ' - ';
/** @internal */
class DocTitleService {
    constructor() {
        this.document = { title: '' };
        this.baseTitle = '';
    }
    start({ document }) {
        this.document = document;
        this.baseTitle = document.title;
        return {
            change: (title) => {
                this.applyTitle(title);
            },
            reset: () => {
                this.applyTitle(defaultTitle);
            },
            __legacy: {
                setBaseTitle: (baseTitle) => {
                    this.baseTitle = baseTitle;
                },
            },
        };
    }
    applyTitle(title) {
        this.document.title = this.render(title);
    }
    render(title) {
        const parts = [...(lodash_1.isString(title) ? [title] : title), this.baseTitle];
        // ensuring compat with legacy that might be passing nested arrays
        return lodash_1.compact(lodash_1.flattenDeep(parts)).join(titleSeparator);
    }
}
exports.DocTitleService = DocTitleService;
