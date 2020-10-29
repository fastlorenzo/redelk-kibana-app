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
exports.font = void 0;
const i18n_1 = require("@kbn/i18n");
const fonts_1 = require("../../fonts");
const types_1 = require("../../types");
const dashify = (str) => {
    return str
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
};
const inlineStyle = (obj) => {
    if (!obj)
        return '';
    const styles = Object.keys(obj).map((key) => {
        const prop = dashify(key);
        const line = prop.concat(':').concat(String(obj[key]));
        return line;
    });
    return styles.join(';');
};
exports.font = {
    name: 'font',
    aliases: [],
    type: 'style',
    help: i18n_1.i18n.translate('expressions.functions.fontHelpText', {
        defaultMessage: 'Create a font style.',
    }),
    inputTypes: ['null'],
    args: {
        align: {
            default: 'left',
            help: i18n_1.i18n.translate('expressions.functions.font.args.alignHelpText', {
                defaultMessage: 'The horizontal text alignment.',
            }),
            options: Object.values(types_1.TextAlignment),
            types: ['string'],
        },
        color: {
            help: i18n_1.i18n.translate('expressions.functions.font.args.colorHelpText', {
                defaultMessage: 'The text color.',
            }),
            types: ['string'],
        },
        family: {
            default: `"${fonts_1.openSans.value}"`,
            help: i18n_1.i18n.translate('expressions.functions.font.args.familyHelpText', {
                defaultMessage: 'An acceptable {css} web font string',
                values: {
                    css: 'CSS',
                },
            }),
            types: ['string'],
        },
        italic: {
            default: false,
            help: i18n_1.i18n.translate('expressions.functions.font.args.italicHelpText', {
                defaultMessage: 'Italicize the text?',
            }),
            options: [true, false],
            types: ['boolean'],
        },
        lHeight: {
            default: null,
            aliases: ['lineHeight'],
            help: i18n_1.i18n.translate('expressions.functions.font.args.lHeightHelpText', {
                defaultMessage: 'The line height in pixels',
            }),
            types: ['number', 'null'],
        },
        size: {
            default: 14,
            help: i18n_1.i18n.translate('expressions.functions.font.args.sizeHelpText', {
                defaultMessage: 'The font size in pixels',
            }),
            types: ['number'],
        },
        underline: {
            default: false,
            help: i18n_1.i18n.translate('expressions.functions.font.args.underlineHelpText', {
                defaultMessage: 'Underline the text?',
            }),
            options: [true, false],
            types: ['boolean'],
        },
        weight: {
            default: 'normal',
            help: i18n_1.i18n.translate('expressions.functions.font.args.weightHelpText', {
                defaultMessage: 'The font weight. For example, {list}, or {end}.',
                values: {
                    list: Object.values(types_1.FontWeight)
                        .slice(0, -1)
                        .map((weight) => `\`"${weight}"\``)
                        .join(', '),
                    end: `\`"${Object.values(types_1.FontWeight).slice(-1)[0]}"\``,
                },
            }),
            options: Object.values(types_1.FontWeight),
            types: ['string'],
        },
    },
    fn: (input, args) => {
        if (!Object.values(types_1.FontWeight).includes(args.weight)) {
            throw new Error(i18n_1.i18n.translate('expressions.functions.font.invalidFontWeightErrorMessage', {
                defaultMessage: "Invalid font weight: '{weight}'",
                values: {
                    weight: args.weight,
                },
            }));
        }
        if (!Object.values(types_1.TextAlignment).includes(args.align)) {
            throw new Error(i18n_1.i18n.translate('expressions.functions.font.invalidTextAlignmentErrorMessage', {
                defaultMessage: "Invalid text alignment: '{align}'",
                values: {
                    align: args.align,
                },
            }));
        }
        // the line height shouldn't ever be lower than the size, and apply as a
        // pixel setting
        const lineHeight = args.lHeight != null ? `${args.lHeight}px` : '1';
        const spec = {
            fontFamily: args.family,
            fontWeight: args.weight,
            fontStyle: args.italic ? types_1.FontStyle.ITALIC : types_1.FontStyle.NORMAL,
            textDecoration: args.underline ? types_1.TextDecoration.UNDERLINE : types_1.TextDecoration.NONE,
            textAlign: args.align,
            fontSize: `${args.size}px`,
            lineHeight,
        };
        // conditionally apply styles based on input
        if (args.color) {
            spec.color = args.color;
        }
        return {
            type: 'style',
            spec,
            css: inlineStyle(spec),
        };
    },
};
