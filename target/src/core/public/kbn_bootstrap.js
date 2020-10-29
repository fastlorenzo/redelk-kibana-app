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
exports.__kbnBootstrap__ = void 0;
/**
 * This is the entry point used to boot the frontend when serving a application
 * that lives in the Kibana Platform.
 *
 * Any changes to this file should be kept in sync with
 * src/legacy/ui/ui_bundles/app_entry_template.js
 */
const i18n_1 = require("@kbn/i18n");
const core_system_1 = require("./core_system");
/** @internal */
function __kbnBootstrap__() {
    const injectedMetadata = JSON.parse(document.querySelector('kbn-injected-metadata').getAttribute('data'));
    /**
     * `apmConfig` would be populated with relavant APM RUM agent
     * configuration if server is started with `ELASTIC_APM_ACTIVE=true`
     */
    const apmConfig = injectedMetadata.vars.apmConfig;
    const APM_ENABLED = process.env.IS_KIBANA_DISTRIBUTABLE !== 'true' && apmConfig != null;
    if (APM_ENABLED) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { init, apm } = require('@elastic/apm-rum');
        if (apmConfig.globalLabels) {
            apm.addLabels(apmConfig.globalLabels);
        }
        init(apmConfig);
    }
    i18n_1.i18n
        .load(injectedMetadata.i18n.translationsUrl)
        .catch((e) => e)
        .then(async (i18nError) => {
        const coreSystem = new core_system_1.CoreSystem({
            injectedMetadata,
            rootDomElement: document.body,
            browserSupportsCsp: !window.__kbnCspNotEnforced__,
        });
        const setup = await coreSystem.setup();
        if (i18nError && setup) {
            setup.fatalErrors.add(i18nError);
        }
        const start = await coreSystem.start();
        if (APM_ENABLED && start) {
            /**
             * Register listeners for navigation changes and capture them as
             * route-change transactions after Kibana app is bootstrapped
             */
            start.application.currentAppId$.subscribe((appId) => {
                const apmInstance = window.elasticApm;
                if (appId && apmInstance && typeof apmInstance.startTransaction === 'function') {
                    apmInstance.startTransaction(`/app/${appId}`, 'route-change', {
                        managed: true,
                        canReuse: true,
                    });
                }
            });
        }
    });
}
exports.__kbnBootstrap__ = __kbnBootstrap__;
