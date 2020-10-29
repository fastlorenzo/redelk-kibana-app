"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovePanelAction = exports.REMOVE_PANEL_ACTION = void 0;
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
const ui_actions_1 = require("../../../ui_actions");
const types_1 = require("../../../types");
exports.REMOVE_PANEL_ACTION = 'deletePanel';
function hasExpandedPanelInput(container) {
    return container.getInput().expandedPanelId !== undefined;
}
class RemovePanelAction {
    constructor() {
        this.type = exports.REMOVE_PANEL_ACTION;
        this.id = exports.REMOVE_PANEL_ACTION;
        this.order = 1;
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableApi.panel.removePanel.displayName', {
            defaultMessage: 'Delete from dashboard',
        });
    }
    getIconType() {
        return 'trash';
    }
    async isCompatible({ embeddable }) {
        const isPanelExpanded = embeddable.parent &&
            hasExpandedPanelInput(embeddable.parent) &&
            embeddable.parent.getInput().expandedPanelId === embeddable.id;
        return Boolean(embeddable.parent && embeddable.getInput().viewMode === types_1.ViewMode.EDIT && !isPanelExpanded);
    }
    async execute({ embeddable }) {
        if (!embeddable.parent || !(await this.isCompatible({ embeddable }))) {
            throw new ui_actions_1.IncompatibleActionError();
        }
        embeddable.parent.removeEmbeddable(embeddable.id);
    }
}
exports.RemovePanelAction = RemovePanelAction;
