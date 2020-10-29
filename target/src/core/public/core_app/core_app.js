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
exports.CoreApp = void 0;
const application_1 = require("../application");
const errors_1 = require("./errors");
class CoreApp {
    constructor(coreContext) {
        this.coreContext = coreContext;
    }
    setup({ http, application }) {
        application.register(this.coreContext.coreId, {
            id: 'error',
            title: 'App Error',
            navLinkStatus: application_1.AppNavLinkStatus.hidden,
            mount(params) {
                // Do not use an async import here in order to ensure that network failures
                // cannot prevent the error UI from displaying. This UI is tiny so an async
                // import here is probably not useful anyways.
                return errors_1.renderApp(params, { basePath: http.basePath });
            },
        });
    }
    start({ application, http, notifications, uiSettings }) {
        if (!application.history) {
            return;
        }
        this.stopHistoryListening = errors_1.setupUrlOverflowDetection({
            basePath: http.basePath,
            history: application.history,
            toasts: notifications.toasts,
            uiSettings,
        });
    }
    stop() {
        if (this.stopHistoryListening) {
            this.stopHistoryListening();
            this.stopHistoryListening = undefined;
        }
    }
}
exports.CoreApp = CoreApp;
