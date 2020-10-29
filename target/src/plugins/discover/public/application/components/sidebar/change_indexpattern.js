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
exports.ChangeIndexPattern = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
// TODO: refactor to shared component with ../../../../../../../../x-pack/legacy/plugins/lens/public/indexpattern_plugin/change_indexpattern
function ChangeIndexPattern({ indexPatternRefs, indexPatternId, onChangeIndexPattern, trigger, selectableProps, }) {
    const [isPopoverOpen, setPopoverIsOpen] = react_1.useState(false);
    const createTrigger = function () {
        const { label, title, ...rest } = trigger;
        return (react_1.default.createElement(eui_1.EuiButtonEmpty, Object.assign({ className: "eui-textTruncate", flush: "left", color: "text", iconSide: "right", iconType: "arrowDown", title: title, onClick: () => setPopoverIsOpen(!isPopoverOpen) }, rest), label));
    };
    return (react_1.default.createElement(eui_1.EuiPopover, { button: createTrigger(), isOpen: isPopoverOpen, closePopover: () => setPopoverIsOpen(false), className: "eui-textTruncate", anchorClassName: "eui-textTruncate", display: "block", panelPaddingSize: "s", ownFocus: true },
        react_1.default.createElement("div", { style: { width: 320 } },
            react_1.default.createElement(eui_1.EuiPopoverTitle, null, i18n_1.i18n.translate('discover.fieldChooser.indexPattern.changeIndexPatternTitle', {
                defaultMessage: 'Change index pattern',
            })),
            react_1.default.createElement(eui_1.EuiSelectable, Object.assign({ "data-test-subj": "indexPattern-switcher" }, selectableProps, { searchable: true, singleSelection: "always", options: indexPatternRefs.map(({ title, id }) => ({
                    label: title,
                    key: id,
                    value: id,
                    checked: id === indexPatternId ? 'on' : undefined,
                })), onChange: (choices) => {
                    const choice = choices.find(({ checked }) => checked);
                    onChangeIndexPattern(choice.value);
                    setPopoverIsOpen(false);
                }, searchProps: {
                    compressed: true,
                    ...(selectableProps ? selectableProps.searchProps : undefined),
                } }), (list, search) => (react_1.default.createElement(react_1.default.Fragment, null,
                search,
                list))))));
}
exports.ChangeIndexPattern = ChangeIndexPattern;
