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
exports.createNotifications = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const util_1 = require("../util");
exports.createNotifications = (services) => {
    const show = ({ title, body, color, iconType, toastLifeTimeMs, onClose, }) => {
        if (!services.notifications) {
            throw new TypeError('Could not show notification as notifications service is not available.');
        }
        services.notifications.toasts.add({
            title: util_1.toMountPoint(title),
            text: util_1.toMountPoint(React.createElement(React.Fragment, null, body || null)),
            color,
            iconType,
            toastLifeTimeMs,
            onClose,
        });
    };
    const success = (input) => show({ color: 'success', iconType: 'check', ...input });
    const warning = (input) => show({ color: 'warning', iconType: 'help', ...input });
    const danger = (input) => show({ color: 'danger', iconType: 'alert', ...input });
    const notifications = {
        toasts: {
            show,
            success,
            warning,
            danger,
        },
    };
    return notifications;
};
