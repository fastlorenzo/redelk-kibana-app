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
exports.LoggingService = void 0;
const logging_config_1 = require("./logging_config");
/** @internal */
class LoggingService {
    constructor(coreContext) {
        this.subscriptions = new Map();
        this.log = coreContext.logger.get('logging');
    }
    setup({ loggingSystem }) {
        return {
            configure: (contextParts, config$) => {
                const contextName = logging_config_1.LoggingConfig.getLoggerContext(contextParts);
                this.log.debug(`Setting custom config for context [${contextName}]`);
                const existingSubscription = this.subscriptions.get(contextName);
                if (existingSubscription) {
                    existingSubscription.unsubscribe();
                }
                // Might be fancier way to do this with rxjs, but this works and is simple to understand
                this.subscriptions.set(contextName, config$.subscribe((config) => {
                    this.log.debug(`Updating logging config for context [${contextName}]`);
                    loggingSystem.setContextConfig(contextParts, config);
                }));
            },
        };
    }
    start() { }
    stop() {
        for (const [, subscription] of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
exports.LoggingService = LoggingService;
