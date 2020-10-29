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
exports.BasePath = void 0;
const utils_1 = require("../../utils");
class BasePath {
    constructor(basePath = '', serverBasePath = basePath) {
        this.basePath = basePath;
        this.serverBasePath = serverBasePath;
        this.get = () => {
            return this.basePath;
        };
        this.prepend = (path) => {
            if (!this.basePath)
                return path;
            return utils_1.modifyUrl(path, (parts) => {
                if (!parts.hostname && parts.pathname && parts.pathname.startsWith('/')) {
                    parts.pathname = `${this.basePath}${parts.pathname}`;
                }
            });
        };
        this.remove = (path) => {
            if (!this.basePath) {
                return path;
            }
            if (path === this.basePath) {
                return '/';
            }
            if (path.startsWith(`${this.basePath}/`)) {
                return path.slice(this.basePath.length);
            }
            return path;
        };
    }
}
exports.BasePath = BasePath;
