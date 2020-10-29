"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayDuplicateTitleConfirmModal = void 0;
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
const constants_1 = require("../../constants");
const confirm_modal_promise_1 = require("./confirm_modal_promise");
function displayDuplicateTitleConfirmModal(savedObject, overlays) {
    const confirmMessage = i18n_1.i18n.translate('savedObjects.confirmModal.saveDuplicateConfirmationMessage', {
        defaultMessage: `A {name} with the title '{title}' already exists. Would you like to save anyway?`,
        values: { title: savedObject.title, name: savedObject.getDisplayName() },
    });
    const confirmButtonText = i18n_1.i18n.translate('savedObjects.confirmModal.saveDuplicateButtonLabel', {
        defaultMessage: 'Save {name}',
        values: { name: savedObject.getDisplayName() },
    });
    try {
        return confirm_modal_promise_1.confirmModalPromise(confirmMessage, '', confirmButtonText, overlays);
    }
    catch (_) {
        return Promise.reject(new Error(constants_1.SAVE_DUPLICATE_REJECTED));
    }
}
exports.displayDuplicateTitleConfirmModal = displayDuplicateTitleConfirmModal;
