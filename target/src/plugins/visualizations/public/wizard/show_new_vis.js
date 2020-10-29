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
exports.showNewVisModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_2 = require("@kbn/i18n/react");
const new_vis_modal_1 = require("./new_vis_modal");
const services_1 = require("../services");
/**
 * shows modal dialog that allows you to create new visualization
 * @param {string[]} editorParams
 * @param {function} onClose - function that will be called when dialog is closed
 */
function showNewVisModal({ editorParams = [], onClose, originatingApp, outsideVisualizeApp, } = {}) {
    const container = document.createElement('div');
    let isClosed = false;
    const handleClose = () => {
        if (isClosed)
            return;
        react_dom_1.default.unmountComponentAtNode(container);
        document.body.removeChild(container);
        if (onClose) {
            onClose();
        }
        isClosed = true;
    };
    document.body.appendChild(container);
    const element = (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(new_vis_modal_1.NewVisModal, { isOpen: true, onClose: handleClose, originatingApp: originatingApp, stateTransfer: services_1.getEmbeddable().getStateTransfer(), outsideVisualizeApp: outsideVisualizeApp, editorParams: editorParams, visTypesRegistry: services_1.getTypes(), addBasePath: services_1.getHttp().basePath.prepend, uiSettings: services_1.getUISettings(), savedObjects: services_1.getSavedObjects(), usageCollection: services_1.getUsageCollector(), application: services_1.getApplication() })));
    react_dom_1.default.render(element, container);
    return () => handleClose();
}
exports.showNewVisModal = showNewVisModal;
