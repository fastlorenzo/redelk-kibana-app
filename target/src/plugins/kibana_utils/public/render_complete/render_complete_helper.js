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
exports.RenderCompleteHelper = void 0;
const attributeName = 'data-render-complete';
class RenderCompleteHelper {
    constructor(element) {
        this.element = element;
        this.destroy = () => {
            this.element.removeEventListener('renderStart', this.start);
            this.element.removeEventListener('renderComplete', this.complete);
        };
        this.setup = () => {
            this.element.setAttribute(attributeName, 'false');
            this.element.addEventListener('renderStart', this.start);
            this.element.addEventListener('renderComplete', this.complete);
        };
        this.disable = () => {
            this.element.setAttribute(attributeName, 'disabled');
            this.destroy();
        };
        this.start = () => {
            this.element.setAttribute(attributeName, 'false');
            return true;
        };
        this.complete = () => {
            this.element.setAttribute(attributeName, 'true');
            return true;
        };
        this.setup();
    }
}
exports.RenderCompleteHelper = RenderCompleteHelper;
