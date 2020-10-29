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
exports.NotificationsService = void 0;
const i18n_1 = require("@kbn/i18n");
const toasts_1 = require("./toasts");
/** @public */
class NotificationsService {
    constructor() {
        this.toasts = new toasts_1.ToastsService();
    }
    setup({ uiSettings }) {
        const notificationSetup = { toasts: this.toasts.setup({ uiSettings }) };
        this.uiSettingsErrorSubscription = uiSettings.getUpdateErrors$().subscribe((error) => {
            notificationSetup.toasts.addDanger({
                title: i18n_1.i18n.translate('core.notifications.unableUpdateUISettingNotificationMessageTitle', {
                    defaultMessage: 'Unable to update UI setting',
                }),
                text: error.message,
            });
        });
        return notificationSetup;
    }
    start({ i18n: i18nDep, overlays, targetDomElement }) {
        this.targetDomElement = targetDomElement;
        const toastsContainer = document.createElement('div');
        targetDomElement.appendChild(toastsContainer);
        return {
            toasts: this.toasts.start({ i18n: i18nDep, overlays, targetDomElement: toastsContainer }),
        };
    }
    stop() {
        this.toasts.stop();
        if (this.targetDomElement) {
            this.targetDomElement.textContent = '';
        }
        if (this.uiSettingsErrorSubscription) {
            this.uiSettingsErrorSubscription.unsubscribe();
        }
    }
}
exports.NotificationsService = NotificationsService;
