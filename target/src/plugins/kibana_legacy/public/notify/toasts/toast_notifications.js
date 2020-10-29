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
exports.ToastNotifications = void 0;
class ToastNotifications {
    constructor(toasts) {
        this.toasts = toasts;
        this.list = [];
        this.onChange = (callback) => {
            this.onChangeCallback = callback;
        };
        this.add = (toastOrTitle) => this.toasts.add(toastOrTitle);
        this.remove = (toast) => this.toasts.remove(toast);
        this.addSuccess = (toastOrTitle) => this.toasts.addSuccess(toastOrTitle);
        this.addWarning = (toastOrTitle) => this.toasts.addWarning(toastOrTitle);
        this.addDanger = (toastOrTitle) => this.toasts.addDanger(toastOrTitle);
        this.addError = (error, options) => this.toasts.addError(error, options);
        toasts.get$().subscribe((list) => {
            this.list = list;
            if (this.onChangeCallback) {
                this.onChangeCallback();
            }
        });
    }
}
exports.ToastNotifications = ToastNotifications;
