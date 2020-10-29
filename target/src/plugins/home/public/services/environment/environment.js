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
exports.EnvironmentService = void 0;
class EnvironmentService {
    constructor() {
        this.environment = {
            cloud: false,
            apmUi: false,
            ml: false,
        };
    }
    setup() {
        return {
            /**
             * Update the environment to influence how the home app is presenting available features.
             * This API should not be extended for new features and will be removed in future versions
             * in favor of display specific extension apis.
             * @deprecated
             * @param update
             */
            update: (update) => {
                this.environment = Object.assign({}, this.environment, update);
            },
        };
    }
    getEnvironment() {
        return this.environment;
    }
}
exports.EnvironmentService = EnvironmentService;
