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
exports.RenderingService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const server_1 = require("react-dom/server");
const operators_1 = require("rxjs/operators");
const i18n_1 = require("@kbn/i18n");
const views_1 = require("./views");
/** @internal */
class RenderingService {
    constructor(coreContext) {
        this.coreContext = coreContext;
    }
    async setup({ http, legacyPlugins, uiPlugins, }) {
        return {
            render: async (request, uiSettings, { app = { getId: () => 'core' }, includeUserSettings = true, vars } = {}) => {
                if (!this.legacyInternals) {
                    throw new Error('Cannot render before "start"');
                }
                const env = {
                    mode: this.coreContext.env.mode,
                    packageInfo: this.coreContext.env.packageInfo,
                };
                const basePath = http.basePath.get(request);
                const serverBasePath = http.basePath.serverBasePath;
                const settings = {
                    defaults: uiSettings.getRegistered(),
                    user: includeUserSettings ? await uiSettings.getUserProvided() : {},
                };
                const appId = app.getId();
                const metadata = {
                    strictCsp: http.csp.strict,
                    uiPublicUrl: `${basePath}/ui`,
                    bootstrapScriptUrl: `${basePath}/bundles/app/${appId}/bootstrap.js`,
                    i18n: i18n_1.i18n.translate,
                    locale: i18n_1.i18n.getLocale(),
                    darkMode: settings.user?.['theme:darkMode']?.userValue
                        ? Boolean(settings.user['theme:darkMode'].userValue)
                        : false,
                    injectedMetadata: {
                        version: env.packageInfo.version,
                        buildNumber: env.packageInfo.buildNum,
                        branch: env.packageInfo.branch,
                        basePath,
                        serverBasePath,
                        env,
                        legacyMode: appId !== 'core',
                        i18n: {
                            translationsUrl: `${basePath}/translations/${i18n_1.i18n.getLocale()}.json`,
                        },
                        csp: { warnLegacyBrowsers: http.csp.warnLegacyBrowsers },
                        vars: vars ?? (await this.legacyInternals.getVars('core', request)),
                        uiPlugins: await Promise.all([...uiPlugins.public].map(async ([id, plugin]) => ({
                            id,
                            plugin,
                            config: await this.getUiConfig(uiPlugins, id),
                        }))),
                        legacyMetadata: {
                            app,
                            bundleId: `app:${appId}`,
                            nav: legacyPlugins.navLinks,
                            version: env.packageInfo.version,
                            branch: env.packageInfo.branch,
                            buildNum: env.packageInfo.buildNum,
                            buildSha: env.packageInfo.buildSha,
                            serverName: http.server.name,
                            devMode: env.mode.dev,
                            basePath,
                            uiSettings: settings,
                        },
                    },
                };
                return `<!DOCTYPE html>${server_1.renderToStaticMarkup(react_1.default.createElement(views_1.Template, { metadata: metadata }))}`;
            },
        };
    }
    async start({ legacy }) {
        this.legacyInternals = legacy.legacyInternals;
    }
    async stop() { }
    async getUiConfig(uiPlugins, pluginId) {
        const browserConfig = uiPlugins.browserConfigs.get(pluginId);
        return ((await browserConfig?.pipe(operators_1.take(1)).toPromise()) ?? {});
    }
}
exports.RenderingService = RenderingService;
