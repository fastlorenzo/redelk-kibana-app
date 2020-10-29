"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerTab = void 0;
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const doc_viewer_render_tab_1 = require("./doc_viewer_render_tab");
const doc_viewer_render_error_1 = require("./doc_viewer_render_error");
/**
 * Renders the tab content of a doc view.
 * Displays an error message when it encounters exceptions, thanks to
 * Error Boundaries.
 */
class DocViewerTab extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            error: '',
        };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.renderProps.hit._id !== this.props.renderProps.hit._id ||
            nextProps.id !== this.props.id ||
            nextState.hasError);
    }
    render() {
        const { component, render, renderProps, title } = this.props;
        const { hasError, error } = this.state;
        if (hasError && error) {
            return react_1.default.createElement(doc_viewer_render_error_1.DocViewerError, { error: error });
        }
        else if (!render && !component) {
            return (react_1.default.createElement(doc_viewer_render_error_1.DocViewerError, { error: `Invalid plugin ${title}, there is neither a (react) component nor a render function provided` }));
        }
        if (render) {
            // doc view is provided by a render function, e.g. for legacy Angular code
            return react_1.default.createElement(doc_viewer_render_tab_1.DocViewRenderTab, { render: render, renderProps: renderProps });
        }
        // doc view is provided by a react component
        const Component = component;
        return (react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(Component, Object.assign({}, renderProps))));
    }
}
exports.DocViewerTab = DocViewerTab;
