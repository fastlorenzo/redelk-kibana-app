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
exports.render = exports.ExpressionRenderHandler = void 0;
const tslib_1 = require("tslib");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const render_error_handler_1 = require("./render_error_handler");
const services_1 = require("./services");
class ExpressionRenderHandler {
    constructor(element, { onRenderError } = {}) {
        this.renderCount = 0;
        this.render = async (data, uiState = {}) => {
            if (!data || typeof data !== 'object') {
                return this.handleRenderError(new Error('invalid data provided to the expression renderer'));
            }
            if (data.type !== 'render' || !data.as) {
                if (data.type === 'error') {
                    return this.handleRenderError(data.error);
                }
                else {
                    return this.handleRenderError(new Error('invalid data provided to the expression renderer'));
                }
            }
            if (!services_1.getRenderersRegistry().get(data.as)) {
                return this.handleRenderError(new Error(`invalid renderer id '${data.as}'`));
            }
            try {
                // Rendering is asynchronous, completed by handlers.done()
                await services_1.getRenderersRegistry()
                    .get(data.as)
                    .render(this.element, data.value, {
                    ...this.handlers,
                    uiState,
                });
            }
            catch (e) {
                return this.handleRenderError(e);
            }
        };
        this.destroy = () => {
            this.renderSubject.complete();
            this.eventsSubject.complete();
            this.updateSubject.complete();
            if (this.destroyFn) {
                this.destroyFn();
            }
        };
        this.getElement = () => {
            return this.element;
        };
        this.handleRenderError = (error) => {
            this.onRenderError(this.element, error, this.handlers);
        };
        this.element = element;
        this.eventsSubject = new Rx.Subject();
        this.events$ = this.eventsSubject.asObservable();
        this.onRenderError = onRenderError || render_error_handler_1.renderErrorHandler;
        this.renderSubject = new Rx.BehaviorSubject(null);
        this.render$ = this.renderSubject.asObservable().pipe(operators_1.filter((_) => _ !== null));
        this.updateSubject = new Rx.Subject();
        this.update$ = this.updateSubject.asObservable();
        this.handlers = {
            onDestroy: (fn) => {
                this.destroyFn = fn;
            },
            done: () => {
                this.renderCount++;
                this.renderSubject.next(this.renderCount);
            },
            reload: () => {
                this.updateSubject.next(null);
            },
            update: (params) => {
                this.updateSubject.next(params);
            },
            event: (data) => {
                this.eventsSubject.next(data);
            },
        };
    }
}
exports.ExpressionRenderHandler = ExpressionRenderHandler;
function render(element, data, options) {
    const handler = new ExpressionRenderHandler(element, options);
    handler.render(data);
    return handler;
}
exports.render = render;
