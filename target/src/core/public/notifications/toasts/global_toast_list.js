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
exports.GlobalToastList = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const utils_1 = require("../../utils");
const convertToEui = (toast) => ({
    ...toast,
    title: typeof toast.title === 'function' ? react_1.default.createElement(utils_1.MountWrapper, { mount: toast.title }) : toast.title,
    text: typeof toast.text === 'function' ? react_1.default.createElement(utils_1.MountWrapper, { mount: toast.text }) : toast.text,
});
class GlobalToastList extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            toasts: [],
        };
    }
    componentDidMount() {
        this.subscription = this.props.toasts$.subscribe((toasts) => {
            this.setState({ toasts });
        });
    }
    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiGlobalToastList, { "data-test-subj": "globalToastList", toasts: this.state.toasts.map(convertToEui), dismissToast: ({ id }) => this.props.dismissToast(id), 
            /**
             * This prop is overriden by the individual toasts that are added.
             * Use `Infinity` here so that it's obvious a timeout hasn't been
             * provided in development.
             */
            toastLifeTimeMs: Infinity }));
    }
}
exports.GlobalToastList = GlobalToastList;
