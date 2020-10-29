"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const kibana_services_1 = require("../../kibana_services");
kibana_services_1.getAngularModule().config(($routeProvider) => {
    $routeProvider.otherwise({
        resolveRedirectTo: ($rootScope) => {
            const path = window.location.hash.substr(1);
            kibana_services_1.getUrlTracker().restorePreviousUrl();
            $rootScope.$applyAsync(() => {
                const { kibanaLegacy } = kibana_services_1.getServices();
                const { navigated } = kibanaLegacy.navigateToLegacyKibanaUrl(path);
                if (!navigated) {
                    kibanaLegacy.navigateToDefaultApp();
                }
            });
            // prevent angular from completing the navigation
            return new Promise(() => { });
        },
    });
});
