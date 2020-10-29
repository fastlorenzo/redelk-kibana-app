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
exports.InspectorPublicPlugin = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const React = tslib_1.__importStar(require("react"));
const public_1 = require("../../kibana_react/public");
const view_registry_1 = require("./view_registry");
const inspector_panel_1 = require("./ui/inspector_panel");
const views_1 = require("./views");
class InspectorPublicPlugin {
    constructor(initializerContext) { }
    async setup(core) {
        this.views = new view_registry_1.InspectorViewRegistry();
        this.views.register(views_1.getDataViewDescription(core.uiSettings));
        this.views.register(views_1.getRequestsViewDescription());
        return {
            registerView: this.views.register.bind(this.views),
            __LEGACY: {
                views: this.views,
            },
        };
    }
    start(core) {
        const isAvailable = (adapters) => this.views.getVisible(adapters).length > 0;
        const closeButtonLabel = i18n_1.i18n.translate('inspector.closeButton', {
            defaultMessage: 'Close Inspector',
        });
        const open = (adapters, options = {}) => {
            const views = this.views.getVisible(adapters);
            // Don't open inspector if there are no views available for the passed adapters
            if (!views || views.length === 0) {
                throw new Error(`Tried to open an inspector without views being available.
          Make sure to call Inspector.isAvailable() with the same adapters before to check
          if an inspector can be shown.`);
            }
            return core.overlays.openFlyout(public_1.toMountPoint(React.createElement(inspector_panel_1.InspectorPanel, { views: views, adapters: adapters, title: options.title })), {
                'data-test-subj': 'inspectorPanel',
                closeButtonAriaLabel: closeButtonLabel,
            });
        };
        return {
            isAvailable,
            open,
        };
    }
    stop() { }
}
exports.InspectorPublicPlugin = InspectorPublicPlugin;
