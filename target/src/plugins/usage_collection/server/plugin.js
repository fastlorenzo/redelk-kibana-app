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
exports.UsageCollectionPlugin = void 0;
const operators_1 = require("rxjs/operators");
const collector_1 = require("./collector");
const routes_1 = require("./routes");
class UsageCollectionPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.logger = this.initializerContext.logger.get();
    }
    async setup(core) {
        const config = await this.initializerContext.config
            .create()
            .pipe(operators_1.first())
            .toPromise();
        const collectorSet = new collector_1.CollectorSet({
            logger: this.logger.get('collector-set'),
            maximumWaitTimeForAllCollectorsInS: config.maximumWaitTimeForAllCollectorsInS,
        });
        const router = core.http.createRouter();
        routes_1.setupRoutes(router, () => this.savedObjects);
        return collectorSet;
    }
    start({ savedObjects }) {
        this.logger.debug('Starting plugin');
        this.savedObjects = savedObjects.createInternalRepository();
    }
    stop() {
        this.logger.debug('Stopping plugin');
    }
}
exports.UsageCollectionPlugin = UsageCollectionPlugin;
