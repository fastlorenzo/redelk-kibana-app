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
exports.UiActionsPlugin = void 0;
const service_1 = require("./service");
const triggers_1 = require("./triggers");
class UiActionsPlugin {
    constructor(initializerContext) {
        this.service = new service_1.UiActionsService();
    }
    setup(core) {
        this.service.registerTrigger(triggers_1.selectRangeTrigger);
        this.service.registerTrigger(triggers_1.valueClickTrigger);
        this.service.registerTrigger(triggers_1.applyFilterTrigger);
        return this.service;
    }
    start(core) {
        return this.service;
    }
    stop() {
        this.service.clear();
    }
}
exports.UiActionsPlugin = UiActionsPlugin;
