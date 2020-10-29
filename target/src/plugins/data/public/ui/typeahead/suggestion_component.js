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
exports.SuggestionComponent = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importDefault(require("react"));
function getEuiIconType(type) {
    switch (type) {
        case 'field':
            return 'kqlField';
        case 'value':
            return 'kqlValue';
        case 'recentSearch':
            return 'search';
        case 'conjunction':
            return 'kqlSelector';
        case 'operator':
            return 'kqlOperand';
        default:
            throw new Error(`Unknown type: ${type}`);
    }
}
function SuggestionComponent(props) {
    return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    react_1.default.createElement("div", { className: classnames_1.default({
            kbnTypeahead__item: true,
            active: props.selected,
        }), role: "option", onClick: () => props.onClick(props.suggestion), onMouseEnter: props.onMouseEnter, ref: props.innerRef, id: props.ariaId, "aria-selected": props.selected, "data-test-subj": `autocompleteSuggestion-${props.suggestion.type}-${props.suggestion.text.replace(/\s/g, '-')}` },
        react_1.default.createElement("div", { className: 'kbnSuggestionItem kbnSuggestionItem--' + props.suggestion.type },
            react_1.default.createElement("div", { className: "kbnSuggestionItem__type" },
                react_1.default.createElement(eui_1.EuiIcon, { type: getEuiIconType(props.suggestion.type) })),
            react_1.default.createElement("div", { className: "kbnSuggestionItem__text" }, props.suggestion.text),
            react_1.default.createElement("div", { className: "kbnSuggestionItem__description" }, props.suggestion.description))));
}
exports.SuggestionComponent = SuggestionComponent;
