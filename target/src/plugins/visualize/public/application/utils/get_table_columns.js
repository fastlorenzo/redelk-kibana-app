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
exports.getNoItemsMessage = exports.getTableColumns = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const getBadge = (item) => {
    if (item.stage === 'beta') {
        return (react_1.default.createElement(eui_1.EuiBetaBadge, { className: "visListingTable__betaIcon", label: "B", title: i18n_1.i18n.translate('visualize.listing.betaTitle', {
                defaultMessage: 'Beta',
            }), tooltipContent: i18n_1.i18n.translate('visualize.listing.betaTooltip', {
                defaultMessage: 'This visualization is in beta and is subject to change. The design and code is less mature than official GA ' +
                    'features and is being provided as-is with no warranties. Beta features are not subject to the support SLA of official GA ' +
                    'features',
            }) }));
    }
    else if (item.stage === 'experimental') {
        return (react_1.default.createElement(eui_1.EuiBetaBadge, { className: "visListingTable__experimentalIcon", label: "E", title: i18n_1.i18n.translate('visualize.listing.experimentalTitle', {
                defaultMessage: 'Experimental',
            }), tooltipContent: i18n_1.i18n.translate('visualize.listing.experimentalTooltip', {
                defaultMessage: 'This visualization might be changed or removed in a future release and is not subject to the support SLA.',
            }) }));
    }
};
const renderItemTypeIcon = (item) => {
    let icon;
    if (item.image) {
        icon = (react_1.default.createElement("img", { className: "visListingTable__typeImage", "aria-hidden": "true", alt: "", src: item.image }));
    }
    else {
        icon = (react_1.default.createElement(eui_1.EuiIcon, { className: "visListingTable__typeIcon", "aria-hidden": "true", type: item.icon || 'empty', size: "m" }));
    }
    return icon;
};
exports.getTableColumns = (application, history) => [
    {
        field: 'title',
        name: i18n_1.i18n.translate('visualize.listing.table.titleColumnName', {
            defaultMessage: 'Title',
        }),
        sortable: true,
        render: (field, { editApp, editUrl, title }) => (react_1.default.createElement(eui_1.EuiLink, { onClick: () => {
                if (editApp) {
                    application.navigateToApp(editApp, { path: editUrl });
                }
                else if (editUrl) {
                    history.push(editUrl);
                }
            }, "data-test-subj": `visListingTitleLink-${title.split(' ').join('-')}` }, field)),
    },
    {
        field: 'typeTitle',
        name: i18n_1.i18n.translate('visualize.listing.table.typeColumnName', {
            defaultMessage: 'Type',
        }),
        sortable: true,
        render: (field, record) => (react_1.default.createElement("span", null,
            renderItemTypeIcon(record),
            record.typeTitle,
            getBadge(record))),
    },
    {
        field: 'description',
        name: i18n_1.i18n.translate('visualize.listing.table.descriptionColumnName', {
            defaultMessage: 'Description',
        }),
        sortable: true,
        render: (field, record) => react_1.default.createElement("span", null, record.description),
    },
];
exports.getNoItemsMessage = (createItem) => (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "visualizeApp", title: react_1.default.createElement("h1", { id: "visualizeListingHeading" },
        react_1.default.createElement(react_2.FormattedMessage, { id: "visualize.listing.createNew.title", defaultMessage: "Create your first visualization" })), body: react_1.default.createElement("p", null,
        react_1.default.createElement(react_2.FormattedMessage, { id: "visualize.listing.createNew.description", defaultMessage: "You can create different visualizations based on your data." })), actions: react_1.default.createElement(eui_1.EuiButton, { onClick: createItem, fill: true, iconType: "plusInCircle", "data-test-subj": "createVisualizationPromptButton" },
        react_1.default.createElement(react_2.FormattedMessage, { id: "visualize.listing.createNew.createButtonLabel", defaultMessage: "Create new visualization" })) }));
