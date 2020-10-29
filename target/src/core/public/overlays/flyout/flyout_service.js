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
exports.FlyoutService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-classes-per-file */
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const rxjs_1 = require("rxjs");
const utils_1 = require("../../utils");
/**
 * A FlyoutRef is a reference to an opened flyout panel. It offers methods to
 * close the flyout panel again. If you open a flyout panel you should make
 * sure you call `close()` when it should be closed.
 * Since a flyout could also be closed by a user or from another flyout being
 * opened, you must bind to the `onClose` Promise on the FlyoutRef instance.
 * The Promise will resolve whenever the flyout was closed at which point you
 * should discard the FlyoutRef.
 *
 * @public
 */
class FlyoutRef {
    constructor() {
        this.closeSubject = new rxjs_1.Subject();
        this.onClose = this.closeSubject.toPromise();
    }
    /**
     * Closes the referenced flyout if it's still open which in turn will
     * resolve the `onClose` Promise. If the flyout had already been
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
class FlyoutService {
    constructor() {
        this.activeFlyout = null;
        this.targetDomElement = null;
    }
    start({ i18n, targetDomElement }) {
        this.targetDomElement = targetDomElement;
        return {
            open: (mount, options = {}) => {
                // If there is an active flyout session close it before opening a new one.
                if (this.activeFlyout) {
                    this.activeFlyout.close();
                    this.cleanupDom();
                }
                const flyout = new FlyoutRef();
                // If a flyout gets closed through it's FlyoutRef, remove it from the dom
                flyout.onClose.then(() => {
                    if (this.activeFlyout === flyout) {
                        this.cleanupDom();
                    }
                });
                this.activeFlyout = flyout;
                react_dom_1.render(react_1.default.createElement(i18n.Context, null,
                    react_1.default.createElement(eui_1.EuiFlyout, Object.assign({}, options, { onClose: () => flyout.close() }),
                        react_1.default.createElement(utils_1.MountWrapper, { mount: mount, className: "kbnOverlayMountWrapper" }))), this.targetDomElement);
                return flyout;
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
        this.activeFlyout = null;
    }
}
exports.FlyoutService = FlyoutService;
