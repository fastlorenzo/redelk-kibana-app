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
exports.createVisEmbeddableFromObject = void 0;
const visualize_embeddable_1 = require("./visualize_embeddable");
const public_1 = require("../../../../plugins/embeddable/public");
const disabled_lab_embeddable_1 = require("./disabled_lab_embeddable");
const services_1 = require("../services");
const constants_1 = require("../../common/constants");
exports.createVisEmbeddableFromObject = (deps) => async (vis, input, parent) => {
    const savedVisualizations = services_1.getSavedVisualizationsLoader();
    try {
        const visId = vis.id;
        const editPath = visId ? savedVisualizations.urlFor(visId) : '';
        const editUrl = visId
            ? services_1.getHttp().basePath.prepend(`/app/visualize${savedVisualizations.urlFor(visId)}`)
            : '';
        const isLabsEnabled = services_1.getUISettings().get(constants_1.VISUALIZE_ENABLE_LABS_SETTING);
        if (!isLabsEnabled && vis.type.stage === 'experimental') {
            return new disabled_lab_embeddable_1.DisabledLabEmbeddable(vis.title, input);
        }
        const indexPattern = vis.data.indexPattern;
        const indexPatterns = indexPattern ? [indexPattern] : [];
        const editable = services_1.getCapabilities().visualize.save;
        return new visualize_embeddable_1.VisualizeEmbeddable(services_1.getTimeFilter(), {
            vis,
            indexPatterns,
            editPath,
            editUrl,
            editable,
            deps,
        }, input, parent);
    }
    catch (e) {
        console.error(e); // eslint-disable-line no-console
        return new public_1.ErrorEmbeddable(e, input, parent);
    }
};
