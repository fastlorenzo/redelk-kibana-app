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
exports.StylesService = void 0;
const tslib_1 = require("tslib");
// @ts-expect-error
const disable_animations_css_1 = tslib_1.__importDefault(require("!!raw-loader!./disable_animations.css"));
/** @internal */
class StylesService {
    async setup() { }
    async start({ uiSettings }) {
        const disableAnimationsStyleTag = document.createElement('style');
        disableAnimationsStyleTag.setAttribute('id', 'disableAnimationsCss');
        document.head.appendChild(disableAnimationsStyleTag);
        const setDisableAnimations = (disableAnimations) => {
            disableAnimationsStyleTag.textContent = disableAnimations ? disable_animations_css_1.default : '';
        };
        this.uiSettingsSubscription = uiSettings
            .get$('accessibility:disableAnimations')
            .subscribe(setDisableAnimations);
    }
    async stop() {
        if (this.uiSettingsSubscription) {
            this.uiSettingsSubscription.unsubscribe();
            this.uiSettingsSubscription = undefined;
        }
    }
}
exports.StylesService = StylesService;
