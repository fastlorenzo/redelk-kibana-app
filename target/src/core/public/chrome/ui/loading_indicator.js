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
exports.LoadingIndicator = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
class LoadingIndicator extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
        };
    }
    componentDidMount() {
        this.loadingCountSubscription = this.props.loadingCount$.subscribe((count) => {
            this.setState({
                visible: count > 0,
            });
        });
    }
    componentWillUnmount() {
        if (this.loadingCountSubscription) {
            this.loadingCountSubscription.unsubscribe();
            this.loadingCountSubscription = undefined;
        }
    }
    render() {
        const className = classnames_1.default('kbnLoadingIndicator', this.state.visible ? null : 'hidden');
        const testSubj = this.state.visible
            ? 'globalLoadingIndicator'
            : 'globalLoadingIndicator-hidden';
        return (react_1.default.createElement("div", { className: className, "data-test-subj": testSubj },
            react_1.default.createElement("div", { className: "kbnLoadingIndicator__bar essentialAnimation" })));
    }
}
exports.LoadingIndicator = LoadingIndicator;
