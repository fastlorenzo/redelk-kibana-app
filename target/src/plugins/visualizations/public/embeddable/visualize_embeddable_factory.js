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
exports.VisualizeEmbeddableFactory = void 0;
const i18n_1 = require("@kbn/i18n");
const operators_1 = require("rxjs/operators");
const public_1 = require("../../../embeddable/public");
const constants_1 = require("./constants");
const vis_1 = require("../vis");
const services_1 = require("../services");
const wizard_1 = require("../wizard");
const _saved_vis_1 = require("../saved_visualizations/_saved_vis");
const create_vis_embeddable_from_object_1 = require("./create_vis_embeddable_from_object");
const constants_2 = require("../../common/constants");
class VisualizeEmbeddableFactory {
    constructor(deps) {
        this.deps = deps;
        this.type = constants_1.VISUALIZE_EMBEDDABLE_TYPE;
        this.savedObjectMetaData = {
            name: i18n_1.i18n.translate('visualizations.savedObjectName', { defaultMessage: 'Visualization' }),
            includeFields: ['visState'],
            type: 'visualization',
            getIconForSavedObject: (savedObject) => {
                return (services_1.getTypes().get(JSON.parse(savedObject.attributes.visState).type).icon || 'visualizeApp');
            },
            getTooltipForSavedObject: (savedObject) => {
                return `${savedObject.attributes.title} (${services_1.getTypes().get(JSON.parse(savedObject.attributes.visState).type).title})`;
            },
            showSavedObject: (savedObject) => {
                const typeName = JSON.parse(savedObject.attributes.visState).type;
                const visType = services_1.getTypes().get(typeName);
                if (!visType) {
                    return false;
                }
                if (services_1.getUISettings().get(constants_2.VISUALIZE_ENABLE_LABS_SETTING)) {
                    return true;
                }
                return visType.stage !== 'experimental';
            },
        };
    }
    async isEditable() {
        return services_1.getCapabilities().visualize.save;
    }
    getDisplayName() {
        return i18n_1.i18n.translate('visualizations.displayName', {
            defaultMessage: 'visualization',
        });
    }
    async getCurrentAppId() {
        return await this.deps.start().core.application.currentAppId$.pipe(operators_1.first()).toPromise();
    }
    async createFromSavedObject(savedObjectId, input, parent) {
        const savedVisualizations = services_1.getSavedVisualizationsLoader();
        try {
            const savedObject = await savedVisualizations.get(savedObjectId);
            const visState = _saved_vis_1.convertToSerializedVis(savedObject);
            const vis = new vis_1.Vis(savedObject.visState.type, visState);
            await vis.setState(visState);
            return create_vis_embeddable_from_object_1.createVisEmbeddableFromObject(this.deps)(vis, input, parent);
        }
        catch (e) {
            console.error(e); // eslint-disable-line no-console
            return new public_1.ErrorEmbeddable(e, input, parent);
        }
    }
    async create(input, parent) {
        // TODO: This is a bit of a hack to preserve the original functionality. Ideally we will clean this up
        // to allow for in place creation of visualizations without having to navigate away to a new URL.
        if (input.savedVis) {
            const visState = input.savedVis;
            const vis = new vis_1.Vis(visState.type, visState);
            await vis.setState(visState);
            return create_vis_embeddable_from_object_1.createVisEmbeddableFromObject(this.deps)(vis, input, parent);
        }
        else {
            wizard_1.showNewVisModal({
                originatingApp: await this.getCurrentAppId(),
                outsideVisualizeApp: true,
            });
            return undefined;
        }
    }
}
exports.VisualizeEmbeddableFactory = VisualizeEmbeddableFactory;
