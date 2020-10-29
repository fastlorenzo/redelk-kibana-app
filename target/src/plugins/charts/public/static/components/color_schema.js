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
exports.ColorSchemaOptions = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const select_1 = require("./select");
const switch_1 = require("./switch");
function ColorSchemaOptions({ disabled, colorSchema, colorSchemas, invertColors, uiState, setValue, showHelpText = true, }) {
    const [isCustomColors, setIsCustomColors] = react_1.useState(() => !!uiState.get('vis.colors'));
    react_1.useEffect(() => {
        uiState.on('colorChanged', () => {
            setIsCustomColors(true);
        });
    }, [uiState]);
    const resetColorsButton = (react_1.default.createElement(eui_1.EuiText, { size: "xs" },
        react_1.default.createElement(eui_1.EuiLink, { onClick: () => {
                uiState.set('vis.colors', null);
                setIsCustomColors(false);
            } },
            react_1.default.createElement(react_2.FormattedMessage, { id: "charts.controls.colorSchema.resetColorsButtonLabel", defaultMessage: "Reset colors" }))));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(select_1.SelectOption, { disabled: disabled, helpText: showHelpText &&
                i18n_1.i18n.translate('charts.controls.colorSchema.howToChangeColorsDescription', {
                    defaultMessage: 'Individual colors can be changed in the legend.',
                }), label: i18n_1.i18n.translate('charts.controls.colorSchema.colorSchemaLabel', {
                defaultMessage: 'Color schema',
            }), labelAppend: isCustomColors && resetColorsButton, options: colorSchemas, paramName: "colorSchema", value: colorSchema, setValue: setValue }),
        react_1.default.createElement(switch_1.SwitchOption, { disabled: disabled, label: i18n_1.i18n.translate('charts.controls.colorSchema.reverseColorSchemaLabel', {
                defaultMessage: 'Reverse schema',
            }), paramName: "invertColors", value: invertColors, setValue: setValue })));
}
exports.ColorSchemaOptions = ColorSchemaOptions;
