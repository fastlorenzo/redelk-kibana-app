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
exports.NewVisHelp = void 0;
const tslib_1 = require("tslib");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
function NewVisHelp(props) {
    return (react_2.default.createElement(eui_1.EuiText, null,
        react_2.default.createElement("p", null,
            react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.newVisWizard.helpText", defaultMessage: "Start creating your visualization by selecting a type for that visualization." })),
        props.promotedTypes.map((t) => (react_2.default.createElement(react_2.Fragment, { key: t.name },
            react_2.default.createElement("p", null,
                react_2.default.createElement("strong", null, t.promotion.description)),
            react_2.default.createElement(eui_1.EuiButton, { onClick: () => props.onPromotionClicked(t), fill: true, size: "s", iconType: "popout", iconSide: "right" }, t.promotion.buttonText))))));
}
exports.NewVisHelp = NewVisHelp;
