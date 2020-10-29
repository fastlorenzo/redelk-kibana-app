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
exports.DefaultEditorAggAdd = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../data/public");
function DefaultEditorAggAdd({ group = [], groupName, schemas, addSchema, stats, }) {
    const [isPopoverOpen, setIsPopoverOpen] = react_1.useState(false);
    const onSelectSchema = (schema) => {
        setIsPopoverOpen(false);
        addSchema(schema);
    };
    const addButton = (react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", iconType: "plusInCircleFilled", "data-test-subj": `visEditorAdd_${groupName}`, onClick: () => setIsPopoverOpen(!isPopoverOpen) },
        react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.aggAdd.addButtonLabel", defaultMessage: "Add" })));
    const groupNameLabel = groupName === public_1.AggGroupNames.Buckets
        ? i18n_1.i18n.translate('visDefaultEditor.aggAdd.bucketLabel', { defaultMessage: 'bucket' })
        : i18n_1.i18n.translate('visDefaultEditor.aggAdd.metricLabel', { defaultMessage: 'metric' });
    const isSchemaDisabled = (schema) => {
        const count = group.filter((agg) => agg.schema === schema.name).length;
        return count >= schema.max;
    };
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "center", responsive: false },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiPopover, { id: `addGroupButtonPopover_${groupName}`, button: addButton, isOpen: isPopoverOpen, panelPaddingSize: "none", repositionOnScroll: true, closePopover: () => setIsPopoverOpen(false) },
                react_1.default.createElement(eui_1.EuiPopoverTitle, null,
                    (groupName !== public_1.AggGroupNames.Buckets || !stats.count) && (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.aggAdd.addGroupButtonLabel", defaultMessage: "Add {groupNameLabel}", values: { groupNameLabel } })),
                    groupName === public_1.AggGroupNames.Buckets && stats.count > 0 && (react_1.default.createElement(react_2.FormattedMessage, { id: "visDefaultEditor.aggAdd.addSubGroupButtonLabel", defaultMessage: "Add sub-{groupNameLabel}", values: { groupNameLabel } }))),
                react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: schemas.map((schema) => (react_1.default.createElement(eui_1.EuiContextMenuItem, { key: `${schema.name}_${schema.title}`, "data-test-subj": `visEditorAdd_${groupName}_${schema.title}`, disabled: isPopoverOpen && isSchemaDisabled(schema), onClick: () => onSelectSchema(schema) }, schema.title))) })))));
}
exports.DefaultEditorAggAdd = DefaultEditorAggAdd;
