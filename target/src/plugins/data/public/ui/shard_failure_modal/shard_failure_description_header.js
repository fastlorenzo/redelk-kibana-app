"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShardFailureDescriptionHeader = exports.getFailureSummaryDetailsText = exports.getFailureSummaryText = exports.getFailurePropsForSummary = void 0;
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
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
function getFailurePropsForSummary(failure) {
    const failureDetailProps = ['shard', 'index', 'node'];
    return failureDetailProps
        .filter((key) => typeof failure[key] === 'number' || typeof failure[key] === 'string')
        .map((key) => ({ key, value: String(failure[key]) }));
}
exports.getFailurePropsForSummary = getFailurePropsForSummary;
function getFailureSummaryText(failure, failureDetails) {
    const failureName = failure.reason.type;
    const displayDetails = typeof failureDetails === 'string' ? failureDetails : getFailureSummaryDetailsText(failure);
    return i18n_1.i18n.translate('data.search.searchSource.fetch.shardsFailedModal.failureHeader', {
        defaultMessage: '{failureName} at {failureDetails}',
        values: { failureName, failureDetails: displayDetails },
        description: 'Summary of shard failures, e.g. "IllegalArgumentException at shard 0 node xyz"',
    });
}
exports.getFailureSummaryText = getFailureSummaryText;
function getFailureSummaryDetailsText(failure) {
    return getFailurePropsForSummary(failure)
        .map(({ key, value }) => `${key}: ${value}`)
        .join(', ');
}
exports.getFailureSummaryDetailsText = getFailureSummaryDetailsText;
function ShardFailureDescriptionHeader(props) {
    const failureDetails = getFailurePropsForSummary(props).map((kv) => (react_1.default.createElement("span", { className: "shardFailureModal__keyValueTitle", key: kv.key },
        react_1.default.createElement(eui_1.EuiCode, null, kv.key),
        " ",
        kv.value)));
    return (react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
        react_1.default.createElement("h2", null,
            getFailureSummaryText(props, ''),
            failureDetails)));
}
exports.ShardFailureDescriptionHeader = ShardFailureDescriptionHeader;
