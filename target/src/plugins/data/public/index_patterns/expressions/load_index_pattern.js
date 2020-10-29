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
exports.indexPatternLoad = void 0;
const i18n_1 = require("@kbn/i18n");
const services_1 = require("../../services");
const name = 'indexPatternLoad';
exports.indexPatternLoad = () => ({
    name,
    type: 'index_pattern',
    inputTypes: ['null'],
    help: i18n_1.i18n.translate('data.functions.indexPatternLoad.help', {
        defaultMessage: 'Loads an index pattern',
    }),
    args: {
        id: {
            types: ['string'],
            required: true,
            help: i18n_1.i18n.translate('data.functions.indexPatternLoad.id.help', {
                defaultMessage: 'index pattern id to load',
            }),
        },
    },
    async fn(input, args) {
        const indexPatterns = services_1.getIndexPatterns();
        const indexPattern = await indexPatterns.get(args.id);
        return { type: 'index_pattern', value: indexPattern.toSpec() };
    },
});
