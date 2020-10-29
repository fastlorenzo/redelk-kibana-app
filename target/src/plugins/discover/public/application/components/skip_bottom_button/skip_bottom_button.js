"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipBottomButton = void 0;
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
const react_2 = require("@kbn/i18n/react");
function SkipBottomButton({ onClick }) {
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(eui_1.EuiSkipLink, { size: "s", 
            // @ts-ignore
            onClick: (event) => {
                // prevent the anchor to reload the page on click
                event.preventDefault();
                // The destinationId prop cannot be leveraged here as the table needs
                // to be updated first (angular logic)
                onClick();
            }, className: "dscSkipButton", destinationId: "", "data-test-subj": "discoverSkipTableButton" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "discover.skipToBottomButtonLabel", defaultMessage: "Skip to end of table" }))));
}
exports.SkipBottomButton = SkipBottomButton;
