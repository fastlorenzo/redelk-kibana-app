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
exports.CoreSystem = void 0;
const chrome_1 = require("./chrome");
const fatal_errors_1 = require("./fatal_errors");
const http_1 = require("./http");
const i18n_1 = require("./i18n");
const injected_metadata_1 = require("./injected_metadata");
const legacy_1 = require("./legacy");
const notifications_1 = require("./notifications");
const overlays_1 = require("./overlays");
const plugins_1 = require("./plugins");
const ui_settings_1 = require("./ui_settings");
const application_1 = require("./application");
const utils_1 = require("../utils/");
const doc_links_1 = require("./doc_links");
const rendering_1 = require("./rendering");
const saved_objects_1 = require("./saved_objects");
const context_1 = require("./context");
const integrations_1 = require("./integrations");
const core_app_1 = require("./core_app");
/**
 * The CoreSystem is the root of the new platform, and setups all parts
 * of Kibana in the UI, including the LegacyPlatform which is managed
 * by the LegacyPlatformService. As we migrate more things to the new
 * platform the CoreSystem will get many more Services.
 *
 * @internal
 */
class CoreSystem {
    constructor(params) {
        this.fatalErrorsSetup = null;
        const { rootDomElement, browserSupportsCsp, injectedMetadata, requireLegacyFiles, requireLegacyBootstrapModule, requireNewPlatformShimModule, } = params;
        this.rootDomElement = rootDomElement;
        this.i18n = new i18n_1.I18nService();
        this.injectedMetadata = new injected_metadata_1.InjectedMetadataService({
            injectedMetadata,
        });
        this.fatalErrors = new fatal_errors_1.FatalErrorsService(rootDomElement, () => {
            // Stop Core before rendering any fatal errors into the DOM
            this.stop();
        });
        this.notifications = new notifications_1.NotificationsService();
        this.http = new http_1.HttpService();
        this.savedObjects = new saved_objects_1.SavedObjectsService();
        this.uiSettings = new ui_settings_1.UiSettingsService();
        this.overlay = new overlays_1.OverlayService();
        this.chrome = new chrome_1.ChromeService({ browserSupportsCsp });
        this.docLinks = new doc_links_1.DocLinksService();
        this.rendering = new rendering_1.RenderingService();
        this.application = new application_1.ApplicationService();
        this.integrations = new integrations_1.IntegrationsService();
        this.coreContext = { coreId: Symbol('core'), env: injectedMetadata.env };
        this.context = new context_1.ContextService(this.coreContext);
        this.plugins = new plugins_1.PluginsService(this.coreContext, injectedMetadata.uiPlugins);
        this.coreApp = new core_app_1.CoreApp(this.coreContext);
        this.legacy = new legacy_1.LegacyPlatformService({
            requireLegacyFiles,
            requireLegacyBootstrapModule,
            requireNewPlatformShimModule,
        });
    }
    async setup() {
        try {
            // Setup FatalErrorsService and it's dependencies first so that we're
            // able to render any errors.
            const injectedMetadata = this.injectedMetadata.setup();
            this.fatalErrorsSetup = this.fatalErrors.setup({
                injectedMetadata,
                i18n: this.i18n.getContext(),
            });
            await this.integrations.setup();
            this.docLinks.setup();
            const http = this.http.setup({ injectedMetadata, fatalErrors: this.fatalErrorsSetup });
            const uiSettings = this.uiSettings.setup({ http, injectedMetadata });
            const notifications = this.notifications.setup({ uiSettings });
            const pluginDependencies = this.plugins.getOpaqueIds();
            const context = this.context.setup({
                // We inject a fake "legacy plugin" with dependencies on every plugin so that legacy plugins:
                // 1) Can access context from any NP plugin
                // 2) Can register context providers that will only be available to other legacy plugins and will not leak into
                //    New Platform plugins.
                pluginDependencies: new Map([
                    ...pluginDependencies,
                    [this.legacy.legacyId, [...pluginDependencies.keys()]],
                ]),
            });
            const application = this.application.setup({ context, http, injectedMetadata });
            this.coreApp.setup({ application, http });
            const core = {
                application,
                context,
                fatalErrors: this.fatalErrorsSetup,
                http,
                injectedMetadata,
                notifications,
                uiSettings,
            };
            // Services that do not expose contracts at setup
            const plugins = await this.plugins.setup(core);
            await this.legacy.setup({
                core,
                plugins: utils_1.mapToObject(plugins.contracts),
            });
            return { fatalErrors: this.fatalErrorsSetup };
        }
        catch (error) {
            if (this.fatalErrorsSetup) {
                this.fatalErrorsSetup.add(error);
            }
            else {
                // If the FatalErrorsService has not yet been setup, log error to console
                // eslint-disable-next-line no-console
                console.log(error);
            }
        }
    }
    async start() {
        try {
            const injectedMetadata = await this.injectedMetadata.start();
            const uiSettings = await this.uiSettings.start();
            const docLinks = this.docLinks.start({ injectedMetadata });
            const http = await this.http.start();
            const savedObjects = await this.savedObjects.start({ http });
            const i18n = await this.i18n.start();
            const fatalErrors = await this.fatalErrors.start();
            await this.integrations.start({ uiSettings });
            const coreUiTargetDomElement = document.createElement('div');
            coreUiTargetDomElement.id = 'kibana-body';
            const notificationsTargetDomElement = document.createElement('div');
            const overlayTargetDomElement = document.createElement('div');
            const overlays = this.overlay.start({
                i18n,
                targetDomElement: overlayTargetDomElement,
                uiSettings,
            });
            const notifications = await this.notifications.start({
                i18n,
                overlays,
                targetDomElement: notificationsTargetDomElement,
            });
            const application = await this.application.start({ http, overlays });
            const chrome = await this.chrome.start({
                application,
                docLinks,
                http,
                injectedMetadata,
                notifications,
                uiSettings,
            });
            this.coreApp.start({ application, http, notifications, uiSettings });
            application.registerMountContext(this.coreContext.coreId, 'core', () => ({
                application: utils_1.pick(application, ['capabilities', 'navigateToApp']),
                chrome,
                docLinks,
                http,
                i18n,
                injectedMetadata: utils_1.pick(injectedMetadata, ['getInjectedVar']),
                notifications,
                overlays,
                savedObjects,
                uiSettings,
            }));
            const core = {
                application,
                chrome,
                docLinks,
                http,
                savedObjects,
                i18n,
                injectedMetadata,
                notifications,
                overlays,
                uiSettings,
                fatalErrors,
            };
            const plugins = await this.plugins.start(core);
            // ensure the rootDomElement is empty
            this.rootDomElement.textContent = '';
            this.rootDomElement.classList.add('coreSystemRootDomElement');
            this.rootDomElement.appendChild(coreUiTargetDomElement);
            this.rootDomElement.appendChild(notificationsTargetDomElement);
            this.rootDomElement.appendChild(overlayTargetDomElement);
            const rendering = this.rendering.start({
                application,
                chrome,
                injectedMetadata,
                overlays,
                targetDomElement: coreUiTargetDomElement,
            });
            await this.legacy.start({
                core,
                plugins: utils_1.mapToObject(plugins.contracts),
                targetDomElement: rendering.legacyTargetDomElement,
            });
            return {
                application,
            };
        }
        catch (error) {
            if (this.fatalErrorsSetup) {
                this.fatalErrorsSetup.add(error);
            }
            else {
                // If the FatalErrorsService has not yet been setup, log error to console
                // eslint-disable-next-line no-console
                console.error(error);
            }
        }
    }
    stop() {
        this.legacy.stop();
        this.plugins.stop();
        this.coreApp.stop();
        this.notifications.stop();
        this.http.stop();
        this.integrations.stop();
        this.uiSettings.stop();
        this.chrome.stop();
        this.i18n.stop();
        this.application.stop();
        this.rootDomElement.textContent = '';
    }
}
exports.CoreSystem = CoreSystem;
