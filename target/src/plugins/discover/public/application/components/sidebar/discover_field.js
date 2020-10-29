"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverField = void 0;
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
const discover_field_details_1 = require("./discover_field_details");
const public_1 = require("../../../../../kibana_react/public");
const helpers_1 = require("../../helpers");
const get_field_type_name_1 = require("./lib/get_field_type_name");
function DiscoverField({ field, indexPattern, onAddField, onRemoveField, onAddFilter, onShowDetails, showDetails, getDetails, selected, useShortDots, }) {
    const addLabel = i18n_1.i18n.translate('discover.fieldChooser.discoverField.addButtonLabel', {
        defaultMessage: 'Add',
    });
    const addLabelAria = i18n_1.i18n.translate('discover.fieldChooser.discoverField.addButtonAriaLabel', {
        defaultMessage: 'Add {field} to table',
        values: { field: field.name },
    });
    const removeLabel = i18n_1.i18n.translate('discover.fieldChooser.discoverField.removeButtonLabel', {
        defaultMessage: 'Remove',
    });
    const removeLabelAria = i18n_1.i18n.translate('discover.fieldChooser.discoverField.removeButtonAriaLabel', {
        defaultMessage: 'Remove {field} from table',
        values: { field: field.name },
    });
    const toggleDisplay = (f) => {
        if (selected) {
            onRemoveField(f.name);
        }
        else {
            onAddField(f.name);
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: `dscSidebarField dscSidebarItem ${showDetails ? 'dscSidebarItem--active' : ''}`, tabIndex: 0, onClick: () => onShowDetails(!showDetails, field), onKeyPress: () => onShowDetails(!showDetails, field), "data-test-subj": `field-${field.name}-showDetails` },
            react_1.default.createElement("span", { className: "dscSidebarField__fieldIcon" },
                react_1.default.createElement(public_1.FieldIcon, { type: field.type, label: get_field_type_name_1.getFieldTypeName(field.type), scripted: field.scripted })),
            react_1.default.createElement("span", { className: "dscSidebarField__name eui-textTruncate" },
                react_1.default.createElement(eui_1.EuiText, { size: "xs", "data-test-subj": `field-${field.name}`, className: "eui-textTruncate", title: field.name }, useShortDots ? helpers_1.shortenDottedString(field.name) : field.displayName)),
            react_1.default.createElement("span", null,
                field.name !== '_source' && !selected && (react_1.default.createElement(eui_1.EuiButton, { fill: true, size: "s", className: "dscSidebarItem__action", onClick: (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        toggleDisplay(field);
                    }, "data-test-subj": `fieldToggle-${field.name}`, "arial-label": addLabelAria }, addLabel)),
                field.name !== '_source' && selected && (react_1.default.createElement(eui_1.EuiButton, { color: "danger", className: "dscSidebarItem__action", onClick: (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        toggleDisplay(field);
                    }, "data-test-subj": `fieldToggle-${field.name}`, "arial-label": removeLabelAria }, removeLabel)))),
        showDetails && (react_1.default.createElement(discover_field_details_1.DiscoverFieldDetails, { indexPattern: indexPattern, field: field, details: getDetails(field), onAddFilter: onAddFilter }))));
}
exports.DiscoverField = DiscoverField;
