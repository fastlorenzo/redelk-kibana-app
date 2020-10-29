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
exports.ToastsApi = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const Rx = tslib_1.__importStar(require("rxjs"));
const error_toast_1 = require("./error_toast");
const utils_1 = require("../../utils");
const normalizeToast = (toastOrTitle) => {
    if (typeof toastOrTitle === 'string') {
        return {
            title: toastOrTitle,
        };
    }
    return toastOrTitle;
};
/**
 * Methods for adding and removing global toast messages.
 * @public
 */
class ToastsApi {
    constructor(deps) {
        this.toasts$ = new Rx.BehaviorSubject([]);
        this.idCounter = 0;
        this.uiSettings = deps.uiSettings;
    }
    /** @internal */
    start({ overlays, i18n }) {
        this.overlays = overlays;
        this.i18n = i18n;
    }
    /** Observable of the toast messages to show to the user. */
    get$() {
        return this.toasts$.asObservable();
    }
    /**
     * Adds a new toast to current array of toast.
     *
     * @param toastOrTitle - a {@link ToastInput}
     * @returns a {@link Toast}
     */
    add(toastOrTitle) {
        const toast = {
            id: String(this.idCounter++),
            toastLifeTimeMs: this.uiSettings.get('notifications:lifetime:info'),
            ...normalizeToast(toastOrTitle),
        };
        this.toasts$.next([...this.toasts$.getValue(), toast]);
        return toast;
    }
    /**
     * Removes a toast from the current array of toasts if present.
     * @param toastOrId - a {@link Toast} returned by {@link ToastsApi.add} or its id
     */
    remove(toastOrId) {
        const toRemove = typeof toastOrId === 'string' ? toastOrId : toastOrId.id;
        const list = this.toasts$.getValue();
        const listWithoutToast = list.filter((t) => t.id !== toRemove);
        if (listWithoutToast.length !== list.length) {
            this.toasts$.next(listWithoutToast);
        }
    }
    /**
     * Adds a new toast pre-configured with the info color and info icon.
     *
     * @param toastOrTitle - a {@link ToastInput}
     * @param options - a {@link ToastOptions}
     * @returns a {@link Toast}
     */
    addInfo(toastOrTitle, options) {
        return this.add({
            color: 'primary',
            iconType: 'iInCircle',
            ...normalizeToast(toastOrTitle),
            ...options,
        });
    }
    /**
     * Adds a new toast pre-configured with the success color and check icon.
     *
     * @param toastOrTitle - a {@link ToastInput}
     * @param options - a {@link ToastOptions}
     * @returns a {@link Toast}
     */
    addSuccess(toastOrTitle, options) {
        return this.add({
            color: 'success',
            iconType: 'check',
            ...normalizeToast(toastOrTitle),
            ...options,
        });
    }
    /**
     * Adds a new toast pre-configured with the warning color and help icon.
     *
     * @param toastOrTitle - a {@link ToastInput}
     * @param options - a {@link ToastOptions}
     * @returns a {@link Toast}
     */
    addWarning(toastOrTitle, options) {
        return this.add({
            color: 'warning',
            iconType: 'help',
            toastLifeTimeMs: this.uiSettings.get('notifications:lifetime:warning'),
            ...normalizeToast(toastOrTitle),
            ...options,
        });
    }
    /**
     * Adds a new toast pre-configured with the danger color and alert icon.
     *
     * @param toastOrTitle - a {@link ToastInput}
     * @param options - a {@link ToastOptions}
     * @returns a {@link Toast}
     */
    addDanger(toastOrTitle, options) {
        return this.add({
            color: 'danger',
            iconType: 'alert',
            toastLifeTimeMs: this.uiSettings.get('notifications:lifetime:warning'),
            ...normalizeToast(toastOrTitle),
            ...options,
        });
    }
    /**
     * Adds a new toast that displays an exception message with a button to open the full stacktrace in a modal.
     *
     * @param error - an `Error` instance.
     * @param options - {@link ErrorToastOptions}
     * @returns a {@link Toast}
     */
    addError(error, options) {
        const message = options.toastMessage || error.message;
        return this.add({
            color: 'danger',
            iconType: 'alert',
            toastLifeTimeMs: this.uiSettings.get('notifications:lifetime:error'),
            text: utils_1.mountReactNode(react_1.default.createElement(error_toast_1.ErrorToast, { openModal: this.openModal.bind(this), error: error, title: options.title, toastMessage: message, i18nContext: () => this.i18n.Context })),
            ...options,
        });
    }
    openModal(...args) {
        if (!this.overlays) {
            // This case should never happen because no rendering should be occurring
            // before the ToastService is started.
            throw new Error(`Modal opened before ToastService was started.`);
        }
        return this.overlays.openModal(...args);
    }
}
exports.ToastsApi = ToastsApi;
