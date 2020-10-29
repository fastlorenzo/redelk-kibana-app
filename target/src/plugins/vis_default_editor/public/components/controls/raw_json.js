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
exports.RawJsonParamEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
require("brace/theme/github");
function RawJsonParamEditor({ showValidation, value = '', setValidity, setValue, setTouched, }) {
    const [isFieldValid, setFieldValidity] = react_1.useState(true);
    const [editorReady, setEditorReady] = react_1.useState(false);
    const editorTooltipText = react_1.useMemo(() => i18n_1.i18n.translate('visDefaultEditor.controls.jsonInputTooltip', {
        defaultMessage: "Any JSON formatted properties you add here will be merged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation.",
    }), []);
    const jsonEditorLabelText = react_1.useMemo(() => i18n_1.i18n.translate('visDefaultEditor.controls.jsonInputLabel', {
        defaultMessage: 'JSON input',
    }), []);
    const label = react_1.useMemo(() => (react_1.default.createElement(react_1.default.Fragment, null,
        jsonEditorLabelText,
        ' ',
        react_1.default.createElement(eui_1.EuiIconTip, { position: "right", content: editorTooltipText, type: "questionInCircle" }))), [jsonEditorLabelText, editorTooltipText]);
    const onEditorValidate = react_1.useCallback((annotations) => {
        // The first onValidate returned from EuiCodeEditor is a false negative
        if (editorReady) {
            const validity = annotations.length === 0;
            setFieldValidity(validity);
            setValidity(validity);
        }
        else {
            setEditorReady(true);
        }
    }, [setValidity, editorReady]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: label, isInvalid: showValidation ? !isFieldValid : false, fullWidth: true, compressed: true },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiCodeEditor, { mode: "json", theme: "github", width: "100%", height: "250px", value: value, onValidate: onEditorValidate, setOptions: {
                    fontSize: '14px',
                }, onChange: setValue, onBlur: setTouched, "aria-label": jsonEditorLabelText, "aria-describedby": "jsonEditorDescription" }),
            react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
                react_1.default.createElement("p", { id: "jsonEditorDescription" }, editorTooltipText)))));
}
exports.RawJsonParamEditor = RawJsonParamEditor;
