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
exports.HeaderExtension = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
class HeaderExtension extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.ref = react_1.default.createRef();
    }
    componentDidMount() {
        this.renderExtension();
    }
    componentDidUpdate(prevProps) {
        if (this.props.extension === prevProps.extension) {
            return;
        }
        this.unrenderExtension();
        this.renderExtension();
    }
    componentWillUnmount() {
        this.unrenderExtension();
    }
    render() {
        return react_1.default.createElement("div", { ref: this.ref });
    }
    renderExtension() {
        if (!this.ref.current) {
            throw new Error('<HeaderExtension /> mounted without ref');
        }
        if (this.props.extension) {
            this.unrender = this.props.extension(this.ref.current);
        }
    }
    unrenderExtension() {
        if (this.unrender) {
            this.unrender();
            this.unrender = undefined;
        }
    }
}
exports.HeaderExtension = HeaderExtension;
