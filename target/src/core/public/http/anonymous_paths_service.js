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
exports.AnonymousPathsService = void 0;
class AnonymousPathsService {
    constructor() {
        this.paths = new Set();
    }
    setup({ basePath }) {
        return {
            isAnonymous: (path) => {
                const pathWithoutBasePath = basePath.remove(path);
                return this.paths.has(normalizePath(pathWithoutBasePath));
            },
            register: (path) => {
                this.paths.add(normalizePath(path));
            },
            normalizePath,
        };
    }
    start(deps) {
        return this.setup(deps);
    }
    stop() { }
}
exports.AnonymousPathsService = AnonymousPathsService;
const normalizePath = (path) => {
    // always lower-case it
    let normalized = path.toLowerCase();
    // remove the slash from the end
    if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, normalized.length - 1);
    }
    // put a slash at the start
    if (!normalized.startsWith('/')) {
        normalized = `/${normalized}`;
    }
    // it's normalized!!!
    return normalized;
};
