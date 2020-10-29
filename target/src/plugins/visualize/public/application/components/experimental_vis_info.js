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
exports.ExperimentalVisInfo = exports.InfoComponent = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
exports.InfoComponent = () => {
    const title = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_2.FormattedMessage, { id: "visualize.experimentalVisInfoText", defaultMessage: "This visualization is marked as experimental. Have feedback? Please create an issue in" }),
        ' ',
        react_1.default.createElement(eui_1.EuiLink, { external: true, href: "https://github.com/elastic/kibana/issues/new/choose", target: "_blank" }, "GitHub"),
        '.'));
    return (react_1.default.createElement(eui_1.EuiCallOut, { className: "hide-for-sharing", "data-test-subj": "experimentalVisInfo", size: "s", title: title, iconType: "beaker" }));
};
exports.ExperimentalVisInfo = react_1.memo(exports.InfoComponent);
