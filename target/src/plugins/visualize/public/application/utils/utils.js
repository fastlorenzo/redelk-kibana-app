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
exports.visStateToEditorState = exports.getDefaultQuery = exports.addBadgeToAppChrome = exports.addHelpMenuToAppChrome = void 0;
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../data/public");
exports.addHelpMenuToAppChrome = (chrome, docLinks) => {
    chrome.setHelpExtension({
        appName: i18n_1.i18n.translate('visualize.helpMenu.appName', {
            defaultMessage: 'Visualize',
        }),
        links: [
            {
                linkType: 'documentation',
                href: `${docLinks.ELASTIC_WEBSITE_URL}guide/en/kibana/${docLinks.DOC_LINK_VERSION}/visualize.html`,
            },
        ],
    });
};
exports.addBadgeToAppChrome = (chrome) => {
    chrome.setBadge({
        text: i18n_1.i18n.translate('visualize.badge.readOnly.text', {
            defaultMessage: 'Read only',
        }),
        tooltip: i18n_1.i18n.translate('visualize.badge.readOnly.tooltip', {
            defaultMessage: 'Unable to save visualizations',
        }),
        iconType: 'glasses',
    });
};
exports.getDefaultQuery = ({ localStorage, uiSettings }) => ({
    query: '',
    language: localStorage.get('kibana.userQueryLanguage') ||
        uiSettings.get(public_1.UI_SETTINGS.SEARCH_QUERY_LANGUAGE),
});
exports.visStateToEditorState = ({ vis, savedVis }, services) => {
    const savedVisState = services.visualizations.convertFromSerializedVis(vis.serialize());
    return {
        uiState: savedVis.uiStateJSON ? JSON.parse(savedVis.uiStateJSON) : vis.uiState.toJSON(),
        query: vis.data.searchSource?.getOwnField('query') || exports.getDefaultQuery(services),
        filters: vis.data.searchSource?.getOwnField('filter') || [],
        vis: { ...savedVisState.visState, title: vis.title },
        linked: !!savedVis.savedSearchId,
    };
};
