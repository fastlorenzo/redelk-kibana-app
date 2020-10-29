"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmModalPromise = void 0;
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
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../kibana_react/public");
function confirmModalPromise(message = '', title = '', confirmBtnText = '', overlays) {
    return new Promise((resolve, reject) => {
        const cancelButtonText = i18n_1.i18n.translate('savedObjects.confirmModal.cancelButtonLabel', {
            defaultMessage: 'Cancel',
        });
        const modal = overlays.openModal(public_1.toMountPoint(react_1.default.createElement(eui_1.EuiConfirmModal, { onCancel: () => {
                modal.close();
                reject();
            }, onConfirm: () => {
                modal.close();
                resolve(true);
            }, confirmButtonText: confirmBtnText, cancelButtonText: cancelButtonText, title: title }, message)));
    });
}
exports.confirmModalPromise = confirmModalPromise;
