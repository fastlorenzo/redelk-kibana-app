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
exports.RequestDetailsStats = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
class RequestDetailsStats extends react_1.Component {
    constructor() {
        super(...arguments);
        this.renderStatRow = (stat) => {
            return [
                react_1.default.createElement(eui_1.EuiTableRow, { key: stat.id },
                    react_1.default.createElement(eui_1.EuiTableRowCell, null,
                        react_1.default.createElement("span", { className: "insRequestDetailsStats__icon" }, stat.description ? (react_1.default.createElement(eui_1.EuiIconTip, { "aria-label": i18n_1.i18n.translate('inspector.requests.descriptionRowIconAriaLabel', {
                                defaultMessage: 'Description',
                            }), type: "questionInCircle", color: "subdued", content: stat.description })) : (react_1.default.createElement(eui_1.EuiIcon, { type: "empty" }))),
                        stat.label),
                    react_1.default.createElement(eui_1.EuiTableRowCell, null, stat.value)),
            ];
        };
    }
    render() {
        const { stats } = this.props.request;
        if (!stats) {
            return null;
        }
        const sortedStats = Object.keys(stats)
            .sort()
            .map((id) => ({ id, ...stats[id] }));
        return (react_1.default.createElement(eui_1.EuiTable, { responsive: false },
            react_1.default.createElement(eui_1.EuiTableBody, null, sortedStats.map(this.renderStatRow))));
    }
}
exports.RequestDetailsStats = RequestDetailsStats;
RequestDetailsStats.propTypes = {
    request: prop_types_1.default.object.isRequired,
};
RequestDetailsStats.shouldShow = (request) => Boolean(request.stats && Object.keys(request.stats).length);
