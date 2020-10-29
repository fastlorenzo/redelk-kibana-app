"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShardFailureOpenModalButton = void 0;
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const services_1 = require("../../services");
const public_1 = require("../../../../kibana_react/public");
const shard_failure_modal_1 = require("./shard_failure_modal");
function ShardFailureOpenModalButton({ request, response, title }) {
    function onClick() {
        const modal = services_1.getOverlays().openModal(public_1.toMountPoint(react_1.default.createElement(shard_failure_modal_1.ShardFailureModal, { request: request, response: response, title: title, onClose: () => modal.close() })), {
            className: 'shardFailureModal',
        });
    }
    return (react_1.default.createElement(eui_1.EuiTextAlign, { textAlign: "right" },
        react_1.default.createElement(eui_1.EuiButton, { color: "warning", size: "s", onClick: onClick, "data-test-subj": "openShardFailureModalBtn" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "data.search.searchSource.fetch.shardsFailedModal.showDetails", defaultMessage: "Show details", description: "Open the modal to show details" }))));
}
exports.ShardFailureOpenModalButton = ShardFailureOpenModalButton;
