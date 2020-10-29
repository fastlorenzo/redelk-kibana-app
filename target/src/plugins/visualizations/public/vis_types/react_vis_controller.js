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
exports.ReactVisController = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const services_1 = require("../services");
class ReactVisController {
    constructor(element, vis) {
        this.el = element;
        this.vis = vis;
    }
    render(visData, visParams) {
        const I18nContext = services_1.getI18n().Context;
        return new Promise((resolve, reject) => {
            if (!this.vis.type || !this.vis.type.visConfig || !this.vis.type.visConfig.component) {
                reject('Missing component for ReactVisType');
            }
            const Component = this.vis.type.visConfig.component;
            const config = services_1.getUISettings();
            react_dom_1.render(react_1.default.createElement(I18nContext, null,
                react_1.default.createElement(Component, { config: config, vis: this.vis, visData: visData, visParams: visParams, renderComplete: resolve })), this.el);
        });
    }
    destroy() {
        react_dom_1.unmountComponentAtNode(this.el);
    }
}
exports.ReactVisController = ReactVisController;
