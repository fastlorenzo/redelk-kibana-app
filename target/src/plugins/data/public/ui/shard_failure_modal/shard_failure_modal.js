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
exports.ShardFailureModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const shard_failure_table_1 = require("./shard_failure_table");
function ShardFailureModal({ request, response, title, onClose }) {
    if (!response || !response._shards || !Array.isArray(response._shards.failures) || !request) {
        // this should never ever happen, but just in case
        return (react_1.default.createElement(eui_1.EuiCallOut, { title: "Sorry, there was an error", color: "danger", iconType: "alert" }, "The ShardFailureModal component received invalid properties"));
    }
    const requestJSON = JSON.stringify(request, null, 2);
    const responseJSON = JSON.stringify(response, null, 2);
    const failures = response._shards.failures;
    const tabs = [
        {
            id: 'table',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tabHeaderShardFailures', {
                defaultMessage: 'Shard failures',
                description: 'Name of the tab displaying shard failures',
            }),
            content: react_1.default.createElement(shard_failure_table_1.ShardFailureTable, { failures: failures }),
        },
        {
            id: 'json-request',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tabHeaderRequest', {
                defaultMessage: 'Request',
                description: 'Name of the tab displaying the JSON request',
            }),
            content: (react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", isCopyable: true }, requestJSON)),
        },
        {
            id: 'json-response',
            name: i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.tabHeaderResponse', {
                defaultMessage: 'Response',
                description: 'Name of the tab displaying the JSON response',
            }),
            content: (react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", isCopyable: true }, responseJSON)),
        },
    ];
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiModalHeader, null,
            react_1.default.createElement(eui_1.EuiModalHeaderTitle, null, title)),
        react_1.default.createElement(eui_1.EuiModalBody, null,
            react_1.default.createElement(eui_1.EuiTabbedContent, { tabs: tabs, initialSelectedTab: tabs[0], autoFocus: "selected" })),
        react_1.default.createElement(eui_1.EuiModalFooter, null,
            react_1.default.createElement(eui_1.EuiCopy, { textToCopy: responseJSON }, (copy) => (react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: copy },
                react_1.default.createElement(react_2.FormattedMessage, { id: "data.search.searchSource.fetch.shardsFailedModal.copyToClipboard", defaultMessage: "Copy response to clipboard" })))),
            react_1.default.createElement(eui_1.EuiButton, { onClick: () => onClose(), fill: true, "data-test-sub": "closeShardFailureModal" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "data.search.searchSource.fetch.shardsFailedModal.close", defaultMessage: "Close", description: "Closing the Modal" })))));
}
exports.ShardFailureModal = ShardFailureModal;
