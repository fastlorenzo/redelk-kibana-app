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
exports.FatalErrorsScreen = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const react_2 = require("@kbn/i18n/react");
class FatalErrorsScreen extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            errors: [],
        };
        this.onClickGoBack = (e) => {
            e.preventDefault();
            window.history.back();
        };
        this.onClickClearSession = (e) => {
            e.preventDefault();
            localStorage.clear();
            sessionStorage.clear();
            window.location.hash = '';
            window.location.reload();
        };
    }
    componentDidMount() {
        this.subscription = Rx.merge(
        // reload the page if hash-based navigation is attempted
        Rx.fromEvent(window, 'hashchange').pipe(operators_1.tap(() => {
            window.location.reload();
        })), 
        // consume error notifications and set them to the component state
        this.props.errorInfo$.pipe(operators_1.tap((error) => {
            this.setState((state) => ({
                ...state,
                errors: [...state.errors, error],
            }));
        }))).subscribe({
            error(error) {
                // eslint-disable-next-line no-console
                console.error('Uncaught error in fatal error screen internals', error);
            },
        });
    }
    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiPage, { style: { minHeight: '100vh' } },
            react_1.default.createElement(eui_1.EuiPageBody, null,
                react_1.default.createElement(eui_1.EuiPageContent, { verticalPosition: "center", horizontalPosition: "center" },
                    react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "alert", iconColor: "danger", title: react_1.default.createElement("h2", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "core.fatalErrors.somethingWentWrongTitle", defaultMessage: "Something went wrong" })), body: react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "core.fatalErrors.tryRefreshingPageDescription", defaultMessage: "Try refreshing the page. If that doesn't work, go back to the previous page or\n                    clear your session data." })), actions: [
                            react_1.default.createElement(eui_1.EuiButton, { color: "primary", fill: true, onClick: this.onClickClearSession, "data-test-subj": "clearSession" },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "core.fatalErrors.clearYourSessionButtonLabel", defaultMessage: "Clear your session" })),
                            react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.onClickGoBack, "data-test-subj": "goBack" },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "core.fatalErrors.goBackButtonLabel", defaultMessage: "Go back" })),
                        ] }),
                    this.state.errors.map((error, i) => (react_1.default.createElement(eui_1.EuiCallOut, { key: i, title: error.message, color: "danger", iconType: "alert" },
                        react_1.default.createElement(eui_1.EuiCodeBlock, { language: "bash", className: "eui-textBreakAll" }, `Version: ${this.props.kibanaVersion}` +
                            '\n' +
                            `Build: ${this.props.buildNumber}` +
                            '\n' +
                            (error.stack ? error.stack : '')))))))));
    }
}
exports.FatalErrorsScreen = FatalErrorsScreen;
