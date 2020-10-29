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
exports.DisabledLabEmbeddable = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const public_1 = require("../../../../plugins/embeddable/public");
const disabled_lab_visualization_1 = require("./disabled_lab_visualization");
const constants_1 = require("./constants");
class DisabledLabEmbeddable extends public_1.Embeddable {
    constructor(title, initialInput) {
        super(initialInput, { title });
        this.title = title;
        this.type = constants_1.VISUALIZE_EMBEDDABLE_TYPE;
    }
    reload() { }
    render(domNode) {
        if (this.title) {
            this.domNode = domNode;
            react_dom_1.default.render(react_1.default.createElement(disabled_lab_visualization_1.DisabledLabVisualization, { title: this.title }), domNode);
        }
    }
    destroy() {
        if (this.domNode) {
            react_dom_1.default.unmountComponentAtNode(this.domNode);
        }
    }
}
exports.DisabledLabEmbeddable = DisabledLabEmbeddable;
