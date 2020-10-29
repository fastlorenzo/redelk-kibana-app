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
exports.HeaderBadge = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importStar(require("react"));
class HeaderBadge extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { badge: undefined };
    }
    componentDidMount() {
        this.subscribe();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.badge$ === this.props.badge$) {
            return;
        }
        this.unsubscribe();
        this.subscribe();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        if (this.state.badge == null) {
            return null;
        }
        return (react_1.default.createElement("div", { className: "chrHeaderBadge__wrapper" },
            react_1.default.createElement(eui_1.EuiBetaBadge, { "data-test-subj": "headerBadge", "data-test-badge-label": this.state.badge.text, tabIndex: 0, label: this.state.badge.text, tooltipContent: this.state.badge.tooltip, iconType: this.state.badge.iconType })));
    }
    subscribe() {
        this.subscription = this.props.badge$.subscribe((badge) => {
            this.setState({
                badge,
            });
        });
    }
    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
}
exports.HeaderBadge = HeaderBadge;
