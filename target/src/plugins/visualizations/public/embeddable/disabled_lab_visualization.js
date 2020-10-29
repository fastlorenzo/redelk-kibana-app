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
exports.DisabledLabVisualization = void 0;
const tslib_1 = require("tslib");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
function DisabledLabVisualization({ title }) {
    return (react_2.default.createElement("div", { className: "visDisabledLabVisualization" },
        react_2.default.createElement("div", { className: "kuiVerticalRhythm visDisabledLabVisualization__icon kuiIcon fa-flask", "aria-hidden": "true" }),
        react_2.default.createElement("div", { className: "kuiVerticalRhythm" },
            react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.disabledLabVisualizationTitle", defaultMessage: "{title} is a lab visualization.", values: { title: react_2.default.createElement("em", { className: "visDisabledLabVisualization__title" }, title) } })),
        react_2.default.createElement("div", { className: "kuiVerticalRhythm" },
            react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.disabledLabVisualizationMessage", defaultMessage: "Please turn on lab-mode in the advanced settings to see lab visualizations." }))));
}
exports.DisabledLabVisualization = DisabledLabVisualization;
