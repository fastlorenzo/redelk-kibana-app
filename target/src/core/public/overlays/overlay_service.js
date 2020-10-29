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
exports.OverlayService = void 0;
const banners_1 = require("./banners");
const flyout_1 = require("./flyout");
const modal_1 = require("./modal");
/** @internal */
class OverlayService {
    constructor() {
        this.bannersService = new banners_1.OverlayBannersService();
        this.modalService = new modal_1.ModalService();
        this.flyoutService = new flyout_1.FlyoutService();
    }
    start({ i18n, targetDomElement, uiSettings }) {
        const flyoutElement = document.createElement('div');
        targetDomElement.appendChild(flyoutElement);
        const flyouts = this.flyoutService.start({ i18n, targetDomElement: flyoutElement });
        const banners = this.bannersService.start({ i18n, uiSettings });
        const modalElement = document.createElement('div');
        targetDomElement.appendChild(modalElement);
        const modals = this.modalService.start({ i18n, targetDomElement: modalElement });
        return {
            banners,
            openFlyout: flyouts.open.bind(flyouts),
            openModal: modals.open.bind(modals),
            openConfirm: modals.openConfirm.bind(modals),
        };
    }
}
exports.OverlayService = OverlayService;
