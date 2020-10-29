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
exports.visDimension = void 0;
const i18n_1 = require("@kbn/i18n");
exports.visDimension = () => ({
    name: 'visdimension',
    help: i18n_1.i18n.translate('visualizations.function.visDimension.help', {
        defaultMessage: 'Generates visConfig dimension object',
    }),
    type: 'vis_dimension',
    inputTypes: ['kibana_datatable'],
    args: {
        accessor: {
            types: ['string', 'number'],
            aliases: ['_'],
            help: i18n_1.i18n.translate('visualizations.function.visDimension.accessor.help', {
                defaultMessage: 'Column in your dataset to use (either column index or column name)',
            }),
        },
        format: {
            types: ['string'],
            default: 'string',
            help: i18n_1.i18n.translate('visualizations.function.visDimension.format.help', {
                defaultMessage: 'Format',
            }),
        },
        formatParams: {
            types: ['string'],
            default: '"{}"',
            help: i18n_1.i18n.translate('visualizations.function.visDimension.formatParams.help', {
                defaultMessage: 'Format params',
            }),
        },
    },
    fn: (input, args) => {
        const accessor = typeof args.accessor === 'number'
            ? args.accessor
            : input.columns.find((c) => c.id === args.accessor);
        if (accessor === undefined) {
            throw new Error(i18n_1.i18n.translate('visualizations.function.visDimension.error.accessor', {
                defaultMessage: 'Column name provided is invalid',
            }));
        }
        return {
            type: 'vis_dimension',
            accessor,
            format: {
                id: args.format,
                params: JSON.parse(args.formatParams),
            },
        };
    },
});
