"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsViewDescription = void 0;
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
const i18n_1 = require("@kbn/i18n");
const requests_view_1 = require("./components/requests_view");
exports.getRequestsViewDescription = () => ({
    title: i18n_1.i18n.translate('inspector.requests.requestsTitle', {
        defaultMessage: 'Requests',
    }),
    order: 20,
    help: i18n_1.i18n.translate('inspector.requests.requestsDescriptionTooltip', {
        defaultMessage: 'View the requests that collected the data',
    }),
    shouldShow(adapters) {
        return Boolean(adapters.requests);
    },
    component: requests_view_1.RequestsViewComponent,
});
