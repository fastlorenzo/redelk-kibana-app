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
exports.NewVisModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const analytics_1 = require("@kbn/analytics");
const search_selection_1 = require("./search_selection");
const type_selection_1 = require("./type_selection");
const constants_1 = require("../../common/constants");
// TODO: redirect logic is specific to visualise & dashboard
// but it is likely should be decoupled. e.g. handled by the container instead
const basePath = `/create?`;
const baseUrl = `/app/visualize#${basePath}`;
class NewVisModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onCloseModal = () => {
            this.setState({ showSearchVisModal: false });
            this.props.onClose();
        };
        this.onVisTypeSelected = (visType) => {
            if (!('aliasPath' in visType) && visType.requiresSearch && visType.options.showIndexSelection) {
                this.setState({
                    showSearchVisModal: true,
                    visType,
                });
            }
            else {
                this.redirectToVis(visType);
            }
        };
        this.onSearchSelected = (searchId, searchType) => {
            this.redirectToVis(this.state.visType, searchType, searchId);
        };
        this.isLabsEnabled = props.uiSettings.get(constants_1.VISUALIZE_ENABLE_LABS_SETTING);
        this.state = {
            showSearchVisModal: false,
        };
        this.trackUiMetric = this.props.usageCollection?.reportUiStats.bind(this.props.usageCollection, 'visualize');
    }
    render() {
        if (!this.props.isOpen) {
            return null;
        }
        const visNewVisDialogAriaLabel = i18n_1.i18n.translate('visualizations.newVisWizard.helpTextAriaLabel', {
            defaultMessage: 'Start creating your visualization by selecting a type for that visualization. Hit escape to close this modal. Hit Tab key to go further.',
        });
        const selectionModal = this.state.showSearchVisModal && this.state.visType ? (react_1.default.createElement(eui_1.EuiModal, { onClose: this.onCloseModal, className: "visNewVisSearchDialog" },
            react_1.default.createElement(search_selection_1.SearchSelection, { onSearchSelected: this.onSearchSelected, visType: this.state.visType, uiSettings: this.props.uiSettings, savedObjects: this.props.savedObjects }))) : (react_1.default.createElement(eui_1.EuiModal, { onClose: this.onCloseModal, className: "visNewVisDialog", "aria-label": visNewVisDialogAriaLabel, role: "menu" },
            react_1.default.createElement(type_selection_1.TypeSelection, { showExperimental: this.isLabsEnabled, onVisTypeSelected: this.onVisTypeSelected, visTypesRegistry: this.props.visTypesRegistry, addBasePath: this.props.addBasePath })));
        return react_1.default.createElement(eui_1.EuiOverlayMask, null, selectionModal);
    }
    redirectToVis(visType, searchType, searchId) {
        if (this.trackUiMetric) {
            this.trackUiMetric(analytics_1.METRIC_TYPE.CLICK, visType.name);
        }
        let params;
        if ('aliasPath' in visType) {
            params = visType.aliasPath;
            this.props.onClose();
            this.navigate(visType.aliasApp, visType.aliasPath);
            return;
        }
        params = [`type=${encodeURIComponent(visType.name)}`];
        if (searchType) {
            params.push(`${searchType === 'search' ? 'savedSearchId' : 'indexPattern'}=${searchId}`);
        }
        params = params.concat(this.props.editorParams);
        this.props.onClose();
        if (this.props.outsideVisualizeApp) {
            this.navigate('visualize', `#${basePath}${params.join('&')}`);
        }
        else {
            location.assign(this.props.addBasePath(`${baseUrl}${params.join('&')}`));
        }
    }
    navigate(appId, params) {
        if (this.props.stateTransfer && this.props.originatingApp) {
            this.props.stateTransfer.navigateToEditor(appId, {
                path: params,
                state: { originatingApp: this.props.originatingApp },
            });
        }
        else {
            this.props.application.navigateToApp(appId, {
                path: params,
            });
        }
    }
}
exports.NewVisModal = NewVisModal;
NewVisModal.defaultProps = {
    editorParams: [],
};
