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
exports.CodeEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_resize_detector_1 = tslib_1.__importDefault(require("react-resize-detector"));
const react_monaco_editor_1 = tslib_1.__importDefault(require("react-monaco-editor"));
const monaco_1 = require("@kbn/monaco");
const editor_theme_1 = require("./editor_theme");
require("./editor.scss");
class CodeEditor extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this._editor = null;
        this._editorWillMount = (__monaco) => {
            if (__monaco !== monaco_1.monaco) {
                throw new Error('react-monaco-editor is using a different version of monaco');
            }
            if (this.props.overrideEditorWillMount) {
                this.props.overrideEditorWillMount();
                return;
            }
            if (this.props.editorWillMount) {
                this.props.editorWillMount();
            }
            monaco_1.monaco.languages.onLanguage(this.props.languageId, () => {
                if (this.props.suggestionProvider) {
                    monaco_1.monaco.languages.registerCompletionItemProvider(this.props.languageId, this.props.suggestionProvider);
                }
                if (this.props.signatureProvider) {
                    monaco_1.monaco.languages.registerSignatureHelpProvider(this.props.languageId, this.props.signatureProvider);
                }
                if (this.props.hoverProvider) {
                    monaco_1.monaco.languages.registerHoverProvider(this.props.languageId, this.props.hoverProvider);
                }
                if (this.props.languageConfiguration) {
                    monaco_1.monaco.languages.setLanguageConfiguration(this.props.languageId, this.props.languageConfiguration);
                }
            });
            // Register the theme
            monaco_1.monaco.editor.defineTheme('euiColors', this.props.useDarkTheme ? editor_theme_1.DARK_THEME : editor_theme_1.LIGHT_THEME);
        };
        this._editorDidMount = (editor, __monaco) => {
            if (__monaco !== monaco_1.monaco) {
                throw new Error('react-monaco-editor is using a different version of monaco');
            }
            this._editor = editor;
            if (this.props.editorDidMount) {
                this.props.editorDidMount(editor);
            }
        };
        this._updateDimensions = () => {
            if (this._editor) {
                this._editor.layout();
            }
        };
    }
    render() {
        const { languageId, value, onChange, width, height, options } = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_monaco_editor_1.default, { theme: "euiColors", language: languageId, value: value, onChange: onChange, editorWillMount: this._editorWillMount, editorDidMount: this._editorDidMount, width: width, height: height, options: options }),
            react_1.default.createElement(react_resize_detector_1.default, { handleWidth: true, handleHeight: true, onResize: this._updateDimensions })));
    }
}
exports.CodeEditor = CodeEditor;
