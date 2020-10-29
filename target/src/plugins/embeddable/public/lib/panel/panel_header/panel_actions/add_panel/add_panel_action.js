"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPanelAction = exports.ACTION_ADD_PANEL = void 0;
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
const types_1 = require("../../../../types");
const open_add_panel_flyout_1 = require("./open_add_panel_flyout");
exports.ACTION_ADD_PANEL = 'ACTION_ADD_PANEL';
class AddPanelAction {
    constructor(getFactory, getAllFactories, overlays, notifications, SavedObjectFinder) {
        this.getFactory = getFactory;
        this.getAllFactories = getAllFactories;
        this.overlays = overlays;
        this.notifications = notifications;
        this.SavedObjectFinder = SavedObjectFinder;
        this.type = exports.ACTION_ADD_PANEL;
        this.id = exports.ACTION_ADD_PANEL;
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableApi.addPanel.displayName', {
            defaultMessage: 'Add panel',
        });
    }
    getIconType() {
        return 'plusInCircleFilled';
    }
    async isCompatible({ embeddable }) {
        return embeddable.getIsContainer() && embeddable.getInput().viewMode === types_1.ViewMode.EDIT;
    }
    async execute({ embeddable }) {
        if (!embeddable.getIsContainer() || !(await this.isCompatible({ embeddable }))) {
            throw new Error('Context is incompatible');
        }
        open_add_panel_flyout_1.openAddPanelFlyout({
            embeddable,
            getFactory: this.getFactory,
            getAllFactories: this.getAllFactories,
            overlays: this.overlays,
            notifications: this.notifications,
            SavedObjectFinder: this.SavedObjectFinder,
        });
    }
}
exports.AddPanelAction = AddPanelAction;
