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
exports.createLegacyUrlForwardApp = void 0;
const public_1 = require("../../../../core/public");
const navigate_to_legacy_kibana_url_1 = require("./navigate_to_legacy_kibana_url");
exports.createLegacyUrlForwardApp = (core, forwards) => ({
    id: 'kibana',
    chromeless: true,
    title: 'Legacy URL migration',
    navLinkStatus: public_1.AppNavLinkStatus.hidden,
    async mount(params) {
        const hash = params.history.location.hash.substr(1);
        if (!hash) {
            const [, , kibanaLegacyStart] = await core.getStartServices();
            kibanaLegacyStart.navigateToDefaultApp();
        }
        const [{ application, http: { basePath }, },] = await core.getStartServices();
        const result = await navigate_to_legacy_kibana_url_1.navigateToLegacyKibanaUrl(hash, forwards, basePath, application);
        if (!result.navigated) {
            const [, , kibanaLegacyStart] = await core.getStartServices();
            kibanaLegacyStart.navigateToDefaultApp();
        }
        return () => { };
    },
});
