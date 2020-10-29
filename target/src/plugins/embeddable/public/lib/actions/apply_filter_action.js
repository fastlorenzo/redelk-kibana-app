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
exports.createFilterAction = exports.ACTION_APPLY_FILTER = void 0;
const i18n_1 = require("@kbn/i18n");
const ui_actions_1 = require("../ui_actions");
exports.ACTION_APPLY_FILTER = 'ACTION_APPLY_FILTER';
async function isCompatible(context) {
    if (context.embeddable === undefined) {
        return false;
    }
    const root = context.embeddable.getRoot();
    return Boolean(root.getInput().filters !== undefined && context.filters !== undefined);
}
function createFilterAction() {
    return ui_actions_1.createAction({
        type: exports.ACTION_APPLY_FILTER,
        id: exports.ACTION_APPLY_FILTER,
        getIconType: () => 'filter',
        getDisplayName: () => {
            return i18n_1.i18n.translate('embeddableApi.actions.applyFilterActionTitle', {
                defaultMessage: 'Apply filter to current view',
            });
        },
        isCompatible,
        execute: async ({ embeddable, filters }) => {
            if (!filters || !embeddable) {
                throw new Error('Applying a filter requires a filter and embeddable as context');
            }
            if (!(await isCompatible({ embeddable, filters }))) {
                throw new ui_actions_1.IncompatibleActionError();
            }
            const root = embeddable.getRoot();
            root.updateInput({
                filters,
            });
        },
    });
}
exports.createFilterAction = createFilterAction;
