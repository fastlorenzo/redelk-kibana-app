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
exports.RowsOrColumnsControl = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const PARAMS = {
    NAME: 'row',
    ROWS: 'visEditorSplitBy__true',
    COLUMNS: 'visEditorSplitBy__false',
};
function RowsOrColumnsControl({ editorStateParams, setStateParamValue }) {
    if (editorStateParams.row === undefined) {
        setStateParamValue(PARAMS.NAME, true);
    }
    const idSelected = `visEditorSplitBy__${editorStateParams.row}`;
    const options = [
        {
            id: PARAMS.ROWS,
            label: i18n_1.i18n.translate('visDefaultEditor.controls.rowsLabel', {
                defaultMessage: 'Rows',
            }),
        },
        {
            id: PARAMS.COLUMNS,
            label: i18n_1.i18n.translate('visDefaultEditor.controls.columnsLabel', {
                defaultMessage: 'Columns',
            }),
        },
    ];
    const onChange = react_1.useCallback((optionId) => setStateParamValue(PARAMS.NAME, optionId === PARAMS.ROWS), [setStateParamValue]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFormRow, { compressed: true, fullWidth: true },
            react_1.default.createElement(eui_1.EuiButtonGroup, { "data-test-subj": "visEditorSplitBy", legend: i18n_1.i18n.translate('visDefaultEditor.controls.splitByLegend', {
                    defaultMessage: 'Split chart by rows or columns.',
                }), options: options, isFullWidth: true, idSelected: idSelected, onChange: onChange })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
}
exports.RowsOrColumnsControl = RowsOrColumnsControl;
