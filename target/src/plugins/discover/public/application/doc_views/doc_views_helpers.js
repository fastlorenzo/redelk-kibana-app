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
exports.convertDirectiveToRenderFn = exports.injectAngularElement = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const angular_1 = tslib_1.__importDefault(require("angular"));
const doc_viewer_render_error_1 = require("../components/doc_viewer/doc_viewer_render_error");
/**
 * Compiles and injects the give angular template into the given dom node
 * returns a function to cleanup the injected angular element
 */
async function injectAngularElement(domNode, template, scopeProps, Controller, getInjector) {
    const $injector = await getInjector();
    const rootScope = $injector.get('$rootScope');
    const $compile = $injector.get('$compile');
    const newScope = Object.assign(rootScope.$new(), scopeProps);
    if (typeof Controller === 'function') {
        // when a controller is defined, expose the value it produces to the view as `$ctrl`
        // see: https://docs.angularjs.org/api/ng/provider/$compileProvider#component
        newScope.$ctrl = $injector.instantiate(Controller, {
            $scope: newScope,
        });
    }
    const $target = angular_1.default.element(domNode);
    const $element = angular_1.default.element(template);
    newScope.$apply(() => {
        const linkFn = $compile($element);
        $target.empty().append($element);
        linkFn(newScope);
    });
    return () => {
        newScope.$destroy();
    };
}
exports.injectAngularElement = injectAngularElement;
/**
 * Converts a given legacy angular directive to a render function
 * for usage in a react component. Note that the rendering is async
 */
function convertDirectiveToRenderFn(directive, getInjector) {
    return (domNode, props) => {
        let rejected = false;
        const cleanupFnPromise = injectAngularElement(domNode, directive.template, props, directive.controller, getInjector);
        cleanupFnPromise.catch((e) => {
            rejected = true;
            react_dom_1.render(react_1.default.createElement(doc_viewer_render_error_1.DocViewerError, { error: e }), domNode);
        });
        return () => {
            if (!rejected) {
                // for cleanup
                // http://roubenmeschian.com/rubo/?p=51
                cleanupFnPromise.then((cleanup) => cleanup());
            }
        };
    };
}
exports.convertDirectiveToRenderFn = convertDirectiveToRenderFn;
