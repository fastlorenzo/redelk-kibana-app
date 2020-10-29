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
exports.saveWithConfirmation = void 0;
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const constants_1 = require("../../constants");
const confirm_modal_promise_1 = require("./confirm_modal_promise");
/**
 * Attempts to create the current object using the serialized source. If an object already
 * exists, a warning message requests an overwrite confirmation.
 * @param source - serialized version of this object what will be indexed into elasticsearch.
 * @param savedObject - a simple object that contains properties title and displayName, and getEsType method
 * @param options - options to pass to the saved object create method
 * @param services - provides Kibana services savedObjectsClient and overlays
 * @returns {Promise} - A promise that is resolved with the objects id if the object is
 * successfully indexed. If the overwrite confirmation was rejected, an error is thrown with
 * a confirmRejected = true parameter so that case can be handled differently than
 * a create or index error.
 * @resolved {SavedObject}
 */
async function saveWithConfirmation(source, savedObject, options, services) {
    const { savedObjectsClient, overlays } = services;
    try {
        return await savedObjectsClient.create(savedObject.getEsType(), source, options);
    }
    catch (err) {
        // record exists, confirm overwriting
        if (lodash_1.get(err, 'res.status') === 409) {
            const confirmMessage = i18n_1.i18n.translate('savedObjects.confirmModal.overwriteConfirmationMessage', {
                defaultMessage: 'Are you sure you want to overwrite {title}?',
                values: { title: savedObject.title },
            });
            const title = i18n_1.i18n.translate('savedObjects.confirmModal.overwriteTitle', {
                defaultMessage: 'Overwrite {name}?',
                values: { name: savedObject.displayName },
            });
            const confirmButtonText = i18n_1.i18n.translate('savedObjects.confirmModal.overwriteButtonLabel', {
                defaultMessage: 'Overwrite',
            });
            return confirm_modal_promise_1.confirmModalPromise(confirmMessage, title, confirmButtonText, overlays)
                .then(() => savedObjectsClient.create(savedObject.getEsType(), source, {
                overwrite: true,
                ...options,
            }))
                .catch(() => Promise.reject(new Error(constants_1.OVERWRITE_REJECTED)));
        }
        return await Promise.reject(err);
    }
}
exports.saveWithConfirmation = saveWithConfirmation;
