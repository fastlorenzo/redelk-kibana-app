"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPanelFlyout = void 0;
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
const i18n_1 = require("@kbn/i18n");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const errors_1 = require("../../../../errors");
const saved_object_finder_create_new_1 = require("./saved_object_finder_create_new");
function capitalize([first, ...letters]) {
    return `${first.toUpperCase()}${letters.join('')}`;
}
class AddPanelFlyout extends react_2.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreateMenuOpen: false,
        };
        this.showToast = (name) => {
            // To avoid the clutter of having toast messages cover flyout
            // close previous toast message before creating a new one
            if (this.lastToast) {
                this.props.notifications.toasts.remove(this.lastToast);
            }
            this.lastToast = this.props.notifications.toasts.addSuccess({
                title: i18n_1.i18n.translate('embeddableApi.addPanel.savedObjectAddedToContainerSuccessMessageTitle', {
                    defaultMessage: '{savedObjectName} was added',
                    values: {
                        savedObjectName: name,
                    },
                }),
                'data-test-subj': 'addObjectToContainerSuccess',
            });
        };
        this.createNewEmbeddable = async (type) => {
            this.props.onClose();
            const factory = this.props.getFactory(type);
            if (!factory) {
                throw new errors_1.EmbeddableFactoryNotFoundError(type);
            }
            const explicitInput = await factory.getExplicitInput();
            const embeddable = await this.props.container.addNewEmbeddable(type, explicitInput);
            if (embeddable) {
                this.showToast(embeddable.getInput().title || '');
            }
        };
        this.onAddPanel = async (savedObjectId, savedObjectType, name) => {
            const factoryForSavedObjectType = [...this.props.getAllFactories()].find((factory) => factory.savedObjectMetaData && factory.savedObjectMetaData.type === savedObjectType);
            if (!factoryForSavedObjectType) {
                throw new errors_1.EmbeddableFactoryNotFoundError(savedObjectType);
            }
            this.props.container.addNewEmbeddable(factoryForSavedObjectType.type, { savedObjectId });
            this.showToast(name);
        };
    }
    getCreateMenuItems() {
        return [...this.props.getAllFactories()]
            .filter((factory) => factory.isEditable() && !factory.isContainerType && factory.canCreateNew())
            .map((factory) => (react_2.default.createElement(eui_1.EuiContextMenuItem, { key: factory.type, "data-test-subj": `createNew-${factory.type}`, onClick: () => this.createNewEmbeddable(factory.type), className: "embPanel__addItem" }, capitalize(factory.getDisplayName()))));
    }
    render() {
        const SavedObjectFinder = this.props.SavedObjectFinder;
        const metaData = [...this.props.getAllFactories()]
            .filter((embeddableFactory) => Boolean(embeddableFactory.savedObjectMetaData) && !embeddableFactory.isContainerType)
            .map(({ savedObjectMetaData }) => savedObjectMetaData);
        const savedObjectsFinder = (react_2.default.createElement(SavedObjectFinder, { onChoose: this.onAddPanel, savedObjectMetaData: metaData, showFilter: true, noItemsMessage: i18n_1.i18n.translate('embeddableApi.addPanel.noMatchingObjectsMessage', {
                defaultMessage: 'No matching objects found.',
            }) },
            react_2.default.createElement(saved_object_finder_create_new_1.SavedObjectFinderCreateNew, { menuItems: this.getCreateMenuItems() })));
        return (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_2.default.createElement(eui_1.EuiTitle, { size: "m" },
                    react_2.default.createElement("h2", null,
                        react_2.default.createElement(react_1.FormattedMessage, { id: "embeddableApi.addPanel.Title", defaultMessage: "Add panels" })))),
            react_2.default.createElement(eui_1.EuiFlyoutBody, null, savedObjectsFinder)));
    }
}
exports.AddPanelFlyout = AddPanelFlyout;
