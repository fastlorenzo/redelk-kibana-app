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
exports.handleResponse = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const ui_1 = require("../../ui");
const public_1 = require("../../../../kibana_react/public");
const services_1 = require("../../services");
function handleResponse(request, response) {
    if (response.timed_out) {
        services_1.getNotifications().toasts.addWarning({
            title: i18n_1.i18n.translate('data.search.searchSource.fetch.requestTimedOutNotificationMessage', {
                defaultMessage: 'Data might be incomplete because your request timed out',
            }),
        });
    }
    if (response._shards && response._shards.failed) {
        const title = i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedNotificationMessage', {
            defaultMessage: '{shardsFailed} of {shardsTotal} shards failed',
            values: {
                shardsFailed: response._shards.failed,
                shardsTotal: response._shards.total,
            },
        });
        const description = i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedNotificationDescription', {
            defaultMessage: 'The data you are seeing might be incomplete or wrong.',
        });
        const text = public_1.toMountPoint(react_1.default.createElement(react_1.default.Fragment, null,
            description,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(ui_1.ShardFailureOpenModalButton, { request: request.body, response: response, title: title })));
        services_1.getNotifications().toasts.addWarning({ title, text });
    }
    return response;
}
exports.handleResponse = handleResponse;
