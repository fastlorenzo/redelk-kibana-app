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
exports.IntegrationsService = void 0;
const moment_1 = require("./moment");
const styles_1 = require("./styles");
/** @internal */
class IntegrationsService {
    constructor() {
        this.styles = new styles_1.StylesService();
        this.moment = new moment_1.MomentService();
    }
    async setup() {
        await this.styles.setup();
        await this.moment.setup();
    }
    async start({ uiSettings }) {
        await this.styles.start({ uiSettings });
        await this.moment.start({ uiSettings });
    }
    async stop() {
        await this.styles.stop();
        await this.moment.stop();
    }
}
exports.IntegrationsService = IntegrationsService;
