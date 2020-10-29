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
exports.ModalService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-classes-per-file */
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const rxjs_1 = require("rxjs");
const utils_1 = require("../../utils");
/**
 * A ModalRef is a reference to an opened modal. It offers methods to
 * close the modal.
 *
 * @public
 */
class ModalRef {
    constructor() {
        this.closeSubject = new rxjs_1.Subject();
        this.onClose = this.closeSubject.toPromise();
    }
    /**
     * Closes the referenced modal if it's still open which in turn will
     * resolve the `onClose` Promise. If the modal had already been
     * closed this method does nothing.
     */
    close() {
        if (!this.closeSubject.closed) {
            this.closeSubject.next();
            this.closeSubject.complete();
        }
        return this.onClose;
    }
}
/** @internal */
class ModalService {
    constructor() {
        this.activeModal = null;
        this.targetDomElement = null;
    }
    start({ i18n, targetDomElement }) {
        this.targetDomElement = targetDomElement;
        return {
            open: (mount, options = {}) => {
                // If there is an active modal, close it before opening a new one.
                if (this.activeModal) {
                    this.activeModal.close();
                    this.cleanupDom();
                }
                const modal = new ModalRef();
                // If a modal gets closed through it's ModalRef, remove it from the dom
                modal.onClose.then(() => {
                    if (this.activeModal === modal) {
                        this.cleanupDom();
                    }
                });
                this.activeModal = modal;
                react_dom_1.render(react_1.default.createElement(eui_1.EuiOverlayMask, null,
                    react_1.default.createElement(i18n.Context, null,
                        react_1.default.createElement(eui_1.EuiModal, Object.assign({}, options, { onClose: () => modal.close() }),
                            react_1.default.createElement(utils_1.MountWrapper, { mount: mount, className: "kbnOverlayMountWrapper" })))), targetDomElement);
                return modal;
            },
            openConfirm: (message, options) => {
                // If there is an active modal, close it before opening a new one.
                if (this.activeModal) {
                    this.activeModal.close();
                    this.cleanupDom();
                }
                return new Promise((resolve, reject) => {
                    let resolved = false;
                    const closeModal = (confirmed) => {
                        resolved = true;
                        modal.close();
                        resolve(confirmed);
                    };
                    const modal = new ModalRef();
                    modal.onClose.then(() => {
                        if (this.activeModal === modal) {
                            this.cleanupDom();
                        }
                        // modal.close can be called when opening a new modal/confirm, so we need to resolve the promise in that case.
                        if (!resolved) {
                            closeModal(false);
                        }
                    });
                    this.activeModal = modal;
                    const props = {
                        ...options,
                        children: typeof message === 'string' ? (message) : (react_1.default.createElement(utils_1.MountWrapper, { mount: message, className: "kbnOverlayMountWrapper" })),
                        onCancel: () => closeModal(false),
                        onConfirm: () => closeModal(true),
                        cancelButtonText: options?.cancelButtonText ||
                            i18n_1.i18n.translate('core.overlays.confirm.cancelButton', {
                                defaultMessage: 'Cancel',
                            }),
                        confirmButtonText: options?.confirmButtonText ||
                            i18n_1.i18n.translate('core.overlays.confirm.okButton', {
                                defaultMessage: 'Confirm',
                            }),
                    };
                    react_dom_1.render(react_1.default.createElement(eui_1.EuiOverlayMask, null,
                        react_1.default.createElement(i18n.Context, null,
                            react_1.default.createElement(eui_1.EuiConfirmModal, Object.assign({}, props)))), targetDomElement);
                });
            },
        };
    }
    /**
     * Using React.Render to re-render into a target DOM element will replace
     * the content of the target but won't call unmountComponent on any
     * components inside the target or any of their children. So we properly
     * cleanup the DOM here to prevent subtle bugs in child components which
     * depend on unmounting for cleanup behaviour.
     */
    cleanupDom() {
        if (this.targetDomElement != null) {
            react_dom_1.unmountComponentAtNode(this.targetDomElement);
            this.targetDomElement.innerHTML = '';
        }
        this.activeModal = null;
    }
}
exports.ModalService = ModalService;
