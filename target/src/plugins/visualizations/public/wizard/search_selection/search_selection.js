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
exports.SearchSelection = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../../../../plugins/saved_objects/public");
class SearchSelection extends react_2.default.Component {
    constructor() {
        super(...arguments);
        this.fixedPageSize = 8;
    }
    render() {
        return (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(eui_1.EuiModalHeader, null,
                react_2.default.createElement(eui_1.EuiModalHeaderTitle, null,
                    react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.newVisWizard.newVisTypeTitle", defaultMessage: "New {visTypeName}", values: { visTypeName: this.props.visType.title } }),
                    ' ',
                    "/",
                    ' ',
                    react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.newVisWizard.chooseSourceTitle", defaultMessage: "Choose a source" }))),
            react_2.default.createElement(eui_1.EuiModalBody, null,
                react_2.default.createElement(public_1.SavedObjectFinderUi, { key: "searchSavedObjectFinder", onChoose: this.props.onSearchSelected, showFilter: true, noItemsMessage: i18n_1.i18n.translate('visualizations.newVisWizard.searchSelection.notFoundLabel', {
                        defaultMessage: 'No matching indices or saved searches found.',
                    }), savedObjectMetaData: [
                        {
                            type: 'search',
                            getIconForSavedObject: () => 'search',
                            name: i18n_1.i18n.translate('visualizations.newVisWizard.searchSelection.savedObjectType.search', {
                                defaultMessage: 'Saved search',
                            }),
                        },
                        {
                            type: 'index-pattern',
                            getIconForSavedObject: () => 'indexPatternApp',
                            name: i18n_1.i18n.translate('visualizations.newVisWizard.searchSelection.savedObjectType.indexPattern', {
                                defaultMessage: 'Index pattern',
                            }),
                        },
                    ], fixedPageSize: this.fixedPageSize, uiSettings: this.props.uiSettings, savedObjects: this.props.savedObjects }))));
    }
}
exports.SearchSelection = SearchSelection;
