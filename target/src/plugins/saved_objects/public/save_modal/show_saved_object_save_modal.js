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
exports.showSaveModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
function isSuccess(result) {
    return 'id' in result;
}
function showSaveModal(saveModal, I18nContext) {
    const container = document.createElement('div');
    const closeModal = () => {
        react_dom_1.default.unmountComponentAtNode(container);
        document.body.removeChild(container);
    };
    const onSave = saveModal.props.onSave;
    const onSaveConfirmed = async (...args) => {
        const response = await onSave(...args);
        // close modal if we either hit an error or the saved object got an id
        if (Boolean(isSuccess(response) ? response.id : response.error)) {
            closeModal();
        }
        return response;
    };
    document.body.appendChild(container);
    const element = react_1.default.cloneElement(saveModal, {
        onSave: onSaveConfirmed,
        onClose: closeModal,
    });
    react_dom_1.default.render(react_1.default.createElement(I18nContext, null, element), container);
}
exports.showSaveModal = showSaveModal;
