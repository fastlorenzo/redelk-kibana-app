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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KibanaLegacyPlugin = void 0;
const dashboard_config_1 = require("./dashboard_config");
const navigate_to_default_app_1 = require("./navigate_to_default_app");
const forward_app_1 = require("./forward_app");
const inject_header_style_1 = require("./utils/inject_header_style");
const navigate_to_legacy_kibana_url_1 = require("./forward_app/navigate_to_legacy_kibana_url");
class KibanaLegacyPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.forwardDefinitions = [];
    }
    setup(core) {
        core.application.register(forward_app_1.createLegacyUrlForwardApp(core, this.forwardDefinitions));
        return {
            /**
             * Forwards URLs within the legacy `kibana` app to a new platform application.
             *
             * @param legacyAppId The name of the old app to forward URLs from
             * @param newAppId The name of the new app that handles the URLs now
             * @param rewritePath Function to rewrite the legacy sub path of the app to the new path in the core app.
             *        If none is provided, it will just strip the prefix of the legacyAppId away
             *
             * path into the new path
             *
             * Example usage:
             * ```
             * kibanaLegacy.forwardApp(
             *   'old',
             *   'new',
             *   path => {
             *     const [, id] = /old/item\/(.*)$/.exec(path) || [];
             *     if (!id) {
             *       return '#/home';
             *     }
             *     return '#/items/${id}';
             *  }
             * );
             * ```
             * This will cause the following redirects:
             *
             * * app/kibana#/old/ -> app/new#/home
             * * app/kibana#/old/item/123 -> app/new#/items/123
             *
             */
            forwardApp: (legacyAppId, newAppId, rewritePath) => {
                this.forwardDefinitions.push({
                    legacyAppId,
                    newAppId,
                    rewritePath: rewritePath || ((path) => `#${path.replace(`/${legacyAppId}`, '') || '/'}`),
                });
            },
        };
    }
    start({ application, http: { basePath }, uiSettings }) {
        this.currentAppIdSubscription = application.currentAppId$.subscribe((currentAppId) => {
            this.currentAppId = currentAppId;
        });
        inject_header_style_1.injectHeaderStyle(uiSettings);
        return {
            /**
             * Used to power dashboard mode. Should be removed when dashboard mode is removed eventually.
             * @deprecated
             */
            dashboardConfig: dashboard_config_1.getDashboardConfig(!application.capabilities.dashboard.showWriteControls),
            /**
             * Navigates to the app defined as kibana.defaultAppId.
             * This takes redirects into account and uses the right mechanism to navigate.
             */
            navigateToDefaultApp: ({ overwriteHash } = { overwriteHash: true }) => {
                navigate_to_default_app_1.navigateToDefaultApp(this.initializerContext.config.get().defaultAppId, this.forwardDefinitions, application, basePath, this.currentAppId, overwriteHash);
            },
            /**
             * Resolves the provided hash using the registered forwards and navigates to the target app.
             * If a navigation happened, `{ navigated: true }` will be returned.
             * If no matching forward is found, `{ navigated: false }` will be returned.
             * @param hash
             */
            navigateToLegacyKibanaUrl: (hash) => {
                return navigate_to_legacy_kibana_url_1.navigateToLegacyKibanaUrl(hash, this.forwardDefinitions, basePath, application);
            },
            /**
             * Loads the font-awesome icon font. Should be removed once the last consumer has migrated to EUI
             * @deprecated
             */
            loadFontAwesome: async () => {
                await Promise.resolve().then(() => __importStar(require('./font_awesome')));
            },
            /**
             * @deprecated
             * Just exported for wiring up with legacy platform, should not be used.
             */
            getForwards: () => this.forwardDefinitions,
            /**
             * @deprecated
             * Just exported for wiring up with dashboard mode, should not be used.
             */
            config: this.initializerContext.config.get(),
        };
    }
    stop() {
        if (this.currentAppIdSubscription) {
            this.currentAppIdSubscription.unsubscribe();
        }
    }
}
exports.KibanaLegacyPlugin = KibanaLegacyPlugin;
