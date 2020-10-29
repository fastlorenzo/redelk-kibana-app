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
exports.TypeSelection = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const react_1 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const react_2 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const memoize_1 = require("../../legacy/memoize");
const new_vis_help_1 = require("./new_vis_help");
const vis_help_text_1 = require("./vis_help_text");
const vis_type_icon_1 = require("./vis_type_icon");
class TypeSelection extends react_2.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            highlightedType: null,
            query: '',
        };
        this.getFilteredVisTypes = memoize_1.memoizeLast(this.filteredVisTypes);
        this.renderVisType = (visType) => {
            let stage = {};
            let highlightMsg;
            if (!('aliasPath' in visType) && visType.stage === 'experimental') {
                stage = {
                    betaBadgeLabel: i18n_1.i18n.translate('visualizations.newVisWizard.experimentalTitle', {
                        defaultMessage: 'Experimental',
                    }),
                    betaBadgeTooltipContent: i18n_1.i18n.translate('visualizations.newVisWizard.experimentalTooltip', {
                        defaultMessage: 'This visualization might be changed or removed in a future release and is not subject to the support SLA.',
                    }),
                };
                highlightMsg = i18n_1.i18n.translate('visualizations.newVisWizard.experimentalDescription', {
                    defaultMessage: 'This visualization is experimental. The design and implementation are less mature than stable visualizations and might be subject to change.',
                });
            }
            else if ('aliasPath' in visType) {
                if (visType.stage === 'beta') {
                    const aliasDescription = i18n_1.i18n.translate('visualizations.newVisWizard.betaDescription', {
                        defaultMessage: 'This visualization is in beta and is subject to change. The design and code is less mature than official GA features and is being provided as-is with no warranties. Beta features are not subject to the support SLA of official GA features',
                    });
                    stage = {
                        betaBadgeLabel: i18n_1.i18n.translate('visualizations.newVisWizard.betaTitle', {
                            defaultMessage: 'Beta',
                        }),
                        betaBadgeTooltipContent: aliasDescription,
                    };
                    highlightMsg = aliasDescription;
                }
                else {
                    const aliasDescription = i18n_1.i18n.translate('visualizations.newVisWizard.visTypeAliasDescription', {
                        defaultMessage: 'Opens a Kibana application that is outside of Visualize.',
                    });
                    stage = {
                        betaBadgeLabel: i18n_1.i18n.translate('visualizations.newVisWizard.visTypeAliasTitle', {
                            defaultMessage: 'Kibana application',
                        }),
                        betaBadgeTooltipContent: aliasDescription,
                        betaBadgeIconType: 'popout',
                    };
                    highlightMsg = aliasDescription;
                }
            }
            const isDisabled = this.state.query !== '' && !visType.highlighted;
            const onClick = () => this.props.onVisTypeSelected(visType);
            const highlightedType = {
                title: visType.title,
                name: visType.name,
                description: visType.description,
                highlightMsg,
            };
            return (react_2.default.createElement(eui_1.EuiKeyPadMenuItem, Object.assign({ key: visType.name, label: react_2.default.createElement("span", { "data-test-subj": "visTypeTitle" }, visType.title), onClick: onClick, onFocus: () => this.setHighlightType(highlightedType), onMouseEnter: () => this.setHighlightType(highlightedType), onMouseLeave: () => this.setHighlightType(null), onBlur: () => this.setHighlightType(null), className: "visNewVisDialog__type", "data-test-subj": `visType-${visType.name}`, "data-vis-stage": !('aliasPath' in visType) ? visType.stage : 'alias', disabled: isDisabled, "aria-describedby": `visTypeDescription-${visType.name}`, role: "menuitem" }, stage),
                react_2.default.createElement(vis_type_icon_1.VisTypeIcon, { icon: visType.icon, image: !('aliasPath' in visType) ? visType.image : undefined })));
        };
        this.onQueryChange = (ev) => {
            this.setState({
                query: ev.target.value,
            });
        };
    }
    render() {
        const { query, highlightedType } = this.state;
        const visTypes = this.getFilteredVisTypes(this.props.visTypesRegistry, query);
        return (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(eui_1.EuiModalHeader, null,
                react_2.default.createElement(eui_1.EuiModalHeaderTitle, null,
                    react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.newVisWizard.title", defaultMessage: "New Visualization" }))),
            react_2.default.createElement("div", { className: "visNewVisDialog__body" },
                react_2.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "xl" },
                    react_2.default.createElement(eui_1.EuiFlexItem, null,
                        react_2.default.createElement(eui_1.EuiFlexGroup, { className: "visNewVisDialog__list", direction: "column", gutterSize: "none", responsive: false },
                            react_2.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "visNewVisDialog__searchWrapper" },
                                react_2.default.createElement(eui_1.EuiFieldSearch, { placeholder: "Filter", value: query, onChange: this.onQueryChange, fullWidth: true, "data-test-subj": "filterVisType", "aria-label": i18n_1.i18n.translate('visualizations.newVisWizard.filterVisTypeAriaLabel', {
                                        defaultMessage: 'Filter for a visualization type',
                                    }) })),
                            react_2.default.createElement(eui_1.EuiFlexItem, { grow: 1, className: "visNewVisDialog__typesWrapper" },
                                react_2.default.createElement(eui_1.EuiScreenReaderOnly, null,
                                    react_2.default.createElement("span", { "aria-live": "polite" }, query && (react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.newVisWizard.resultsFound", defaultMessage: "{resultCount} {resultCount, plural,\n                            one {type}\n                            other {types}\n                          } found", values: {
                                            resultCount: visTypes.filter((type) => type.highlighted).length,
                                        } })))),
                                react_2.default.createElement(eui_1.EuiKeyPadMenu, { className: "visNewVisDialog__types", "data-test-subj": "visNewDialogTypes" }, visTypes.map(this.renderVisType))))),
                    react_2.default.createElement(eui_1.EuiFlexItem, { className: "visNewVisDialog__description", grow: false }, highlightedType ? (react_2.default.createElement(vis_help_text_1.VisHelpText, Object.assign({}, highlightedType))) : (react_2.default.createElement(react_2.default.Fragment, null,
                        react_2.default.createElement(eui_1.EuiTitle, { size: "s" },
                            react_2.default.createElement("h2", null,
                                react_2.default.createElement(react_1.FormattedMessage, { id: "visualizations.newVisWizard.selectVisType", defaultMessage: "Select a visualization type" }))),
                        react_2.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                        react_2.default.createElement(new_vis_help_1.NewVisHelp, { promotedTypes: visTypes.filter((t) => t.promotion), onPromotionClicked: this.props.onVisTypeSelected }))))))));
    }
    filteredVisTypes(visTypes, query) {
        const types = visTypes.all().filter((type) => {
            // Filter out all lab visualizations if lab mode is not enabled
            if (!this.props.showExperimental && type.stage === 'experimental') {
                return false;
            }
            // Filter out hidden visualizations
            if (type.hidden) {
                return false;
            }
            return true;
        });
        const allTypes = [...types, ...visTypes.getAliases()];
        let entries;
        if (!query) {
            entries = allTypes.map((type) => ({ ...type, highlighted: false }));
        }
        else {
            const q = query.toLowerCase();
            entries = allTypes.map((type) => {
                const matchesQuery = type.name.toLowerCase().includes(q) ||
                    type.title.toLowerCase().includes(q) ||
                    (typeof type.description === 'string' && type.description.toLowerCase().includes(q));
                return { ...type, highlighted: matchesQuery };
            });
        }
        return lodash_1.orderBy(entries, ['highlighted', 'promotion', 'title'], ['desc', 'asc', 'asc']);
    }
    setHighlightType(highlightedType) {
        this.setState({
            highlightedType,
        });
    }
}
exports.TypeSelection = TypeSelection;
