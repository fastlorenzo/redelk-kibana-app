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
exports.FatalErrorsService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const fatal_errors_screen_1 = require("./fatal_errors_screen");
const get_error_info_1 = require("./get_error_info");
/** @interal */
class FatalErrorsService {
    /**
     *
     * @param rootDomElement
     * @param onFirstErrorCb - Callback function that gets executed after the first error,
     *   but before the FatalErrorsService renders the error to the DOM.
     */
    constructor(rootDomElement, onFirstErrorCb) {
        this.rootDomElement = rootDomElement;
        this.onFirstErrorCb = onFirstErrorCb;
        this.errorInfo$ = new Rx.ReplaySubject();
    }
    setup({ i18n, injectedMetadata }) {
        this.errorInfo$
            .pipe(operators_1.first(), operators_1.tap(() => {
            this.onFirstErrorCb();
            this.renderError(injectedMetadata, i18n);
        }))
            .subscribe({
            error: (error) => {
                // eslint-disable-next-line no-console
                console.error('Uncaught error in fatal error service internals', error);
            },
        });
        this.fatalErrors = {
            add: (error, source) => {
                const errorInfo = get_error_info_1.getErrorInfo(error, source);
                this.errorInfo$.next(errorInfo);
                if (error instanceof Error) {
                    // make stack traces clickable by putting whole error in the console
                    // eslint-disable-next-line no-console
                    console.error(error);
                }
                throw error;
            },
            get$: () => {
                return this.errorInfo$.asObservable();
            },
        };
        this.setupGlobalErrorHandlers(this.fatalErrors);
        return this.fatalErrors;
    }
    start() {
        const { fatalErrors } = this;
        if (!fatalErrors) {
            throw new Error('FatalErrorsService#setup() must be invoked before start.');
        }
        return fatalErrors;
    }
    renderError(injectedMetadata, i18n) {
        // delete all content in the rootDomElement
        this.rootDomElement.textContent = '';
        // create and mount a container for the <FatalErrorScreen>
        const container = document.createElement('div');
        this.rootDomElement.appendChild(container);
        react_dom_1.render(react_1.default.createElement(i18n.Context, null,
            react_1.default.createElement(fatal_errors_screen_1.FatalErrorsScreen, { buildNumber: injectedMetadata.getKibanaBuildNumber(), kibanaVersion: injectedMetadata.getKibanaVersion(), "errorInfo$": this.errorInfo$ })), container);
    }
    setupGlobalErrorHandlers(fatalErrorsSetup) {
        if (window.addEventListener) {
            window.addEventListener('unhandledrejection', function (e) {
                console.log(`Detected an unhandled Promise rejection.\n${e.reason}`); // eslint-disable-line no-console
            });
        }
    }
}
exports.FatalErrorsService = FatalErrorsService;
