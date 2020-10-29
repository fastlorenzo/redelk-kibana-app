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
exports.InspectPanelAction = exports.ACTION_INSPECT_PANEL = void 0;
const i18n_1 = require("@kbn/i18n");
exports.ACTION_INSPECT_PANEL = 'openInspector';
class InspectPanelAction {
    constructor(inspector) {
        this.inspector = inspector;
        this.type = exports.ACTION_INSPECT_PANEL;
        this.id = exports.ACTION_INSPECT_PANEL;
        this.order = 20;
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableApi.panel.inspectPanel.displayName', {
            defaultMessage: 'Inspect',
        });
    }
    getIconType() {
        return 'inspect';
    }
    async isCompatible({ embeddable }) {
        return this.inspector.isAvailable(embeddable.getInspectorAdapters());
    }
    async execute({ embeddable }) {
        const adapters = embeddable.getInspectorAdapters();
        if (!(await this.isCompatible({ embeddable })) || adapters === undefined) {
            throw new Error('Action not compatible with context');
        }
        const session = this.inspector.open(adapters, {
            title: embeddable.getTitle(),
        });
        // Overwrite the embeddables.destroy() function to close the inspector
        // before calling the original destroy method
        const originalDestroy = embeddable.destroy;
        embeddable.destroy = () => {
            session.close();
            if (originalDestroy) {
                originalDestroy.call(embeddable);
            }
        };
        // In case the inspector gets closed (otherwise), restore the original destroy function
        session.onClose.finally(() => {
            embeddable.destroy = originalDestroy;
        });
    }
}
exports.InspectPanelAction = InspectPanelAction;
