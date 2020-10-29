"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddablePanel = void 0;
const tslib_1 = require("tslib");
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
const eui_1 = require("@elastic/eui");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importDefault(require("react"));
const rxjs_1 = require("rxjs");
const ui_actions_1 = require("../ui_actions");
const public_1 = require("../../../../kibana_react/public");
const triggers_1 = require("../triggers");
const types_1 = require("../types");
const panel_actions_1 = require("./panel_header/panel_actions");
const add_panel_action_1 = require("./panel_header/panel_actions/add_panel/add_panel_action");
const customize_panel_action_1 = require("./panel_header/panel_actions/customize_title/customize_panel_action");
const panel_header_1 = require("./panel_header/panel_header");
const inspect_panel_action_1 = require("./panel_header/panel_actions/inspect_panel_action");
const actions_1 = require("../actions");
const customize_panel_modal_1 = require("./panel_header/panel_actions/customize_title/customize_panel_modal");
const embeddable_error_label_1 = require("./embeddable_error_label");
const sortByOrderField = ({ order: orderA }, { order: orderB }) => (orderB || 0) - (orderA || 0);
const removeById = (disabledActions) => ({ id }) => disabledActions.indexOf(id) === -1;
class EmbeddablePanel extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.subscription = new rxjs_1.Subscription();
        this.mounted = false;
        this.generateId = eui_1.htmlIdGenerator();
        this.onFocus = (focusedPanelIndex) => {
            this.setState({ focusedPanelIndex });
        };
        this.onBlur = (blurredPanelIndex) => {
            if (this.state.focusedPanelIndex === blurredPanelIndex) {
                this.setState({ focusedPanelIndex: undefined });
            }
        };
        this.closeMyContextMenuPanel = () => {
            if (this.mounted) {
                this.setState({ closeContextMenu: true }, () => {
                    if (this.mounted) {
                        this.setState({ closeContextMenu: false });
                    }
                });
            }
        };
        this.getActionContextMenuPanel = async () => {
            let regularActions = await this.props.getActions(triggers_1.CONTEXT_MENU_TRIGGER, {
                embeddable: this.props.embeddable,
            });
            const { disabledActions } = this.props.embeddable.getInput();
            if (disabledActions) {
                const removeDisabledActions = removeById(disabledActions);
                regularActions = regularActions.filter(removeDisabledActions);
            }
            const createGetUserData = (overlays) => async function getUserData(context) {
                return new Promise((resolve) => {
                    const session = overlays.openModal(public_1.toMountPoint(react_1.default.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: context.embeddable, updateTitle: (title) => {
                            session.close();
                            resolve({ title });
                        } })), {
                        'data-test-subj': 'customizePanel',
                    });
                });
            };
            // These actions are exposed on the context menu for every embeddable, they bypass the trigger
            // registry.
            const extraActions = [
                new customize_panel_action_1.CustomizePanelTitleAction(createGetUserData(this.props.overlays)),
                new add_panel_action_1.AddPanelAction(this.props.getEmbeddableFactory, this.props.getAllEmbeddableFactories, this.props.overlays, this.props.notifications, this.props.SavedObjectFinder),
                new inspect_panel_action_1.InspectPanelAction(this.props.inspector),
                new panel_actions_1.RemovePanelAction(),
                new actions_1.EditPanelAction(this.props.getEmbeddableFactory, this.props.application, this.props.stateTransfer),
            ];
            const sortedActions = [...regularActions, ...extraActions].sort(sortByOrderField);
            return await ui_actions_1.buildContextMenuForActions({
                actions: sortedActions,
                actionContext: { embeddable: this.props.embeddable },
                closeMenu: this.closeMyContextMenuPanel,
            });
        };
        const { embeddable } = this.props;
        const viewMode = embeddable.getInput().viewMode
            ? embeddable.getInput().viewMode
            : types_1.ViewMode.EDIT;
        const hidePanelTitles = embeddable.parent
            ? Boolean(embeddable.parent.getInput().hidePanelTitles)
            : false;
        this.state = {
            panels: [],
            viewMode,
            hidePanelTitles,
            closeContextMenu: false,
            badges: [],
            notifications: [],
        };
        this.embeddableRoot = react_1.default.createRef();
    }
    async refreshBadges() {
        let badges = await this.props.getActions(triggers_1.PANEL_BADGE_TRIGGER, {
            embeddable: this.props.embeddable,
        });
        if (!this.mounted)
            return;
        const { disabledActions } = this.props.embeddable.getInput();
        if (disabledActions) {
            badges = badges.filter((badge) => disabledActions.indexOf(badge.id) === -1);
        }
        this.setState({
            badges,
        });
    }
    async refreshNotifications() {
        let notifications = await this.props.getActions(triggers_1.PANEL_NOTIFICATION_TRIGGER, {
            embeddable: this.props.embeddable,
        });
        if (!this.mounted)
            return;
        const { disabledActions } = this.props.embeddable.getInput();
        if (disabledActions) {
            notifications = notifications.filter((badge) => disabledActions.indexOf(badge.id) === -1);
        }
        this.setState({
            notifications,
        });
    }
    UNSAFE_componentWillMount() {
        this.mounted = true;
        const { embeddable } = this.props;
        const { parent } = embeddable;
        this.subscription.add(embeddable.getInput$().subscribe(async () => {
            if (this.mounted) {
                this.setState({
                    viewMode: embeddable.getInput().viewMode
                        ? embeddable.getInput().viewMode
                        : types_1.ViewMode.EDIT,
                });
                this.refreshBadges();
                this.refreshNotifications();
            }
        }));
        if (parent) {
            this.parentSubscription = parent.getInput$().subscribe(async () => {
                if (this.mounted && parent) {
                    this.setState({
                        hidePanelTitles: Boolean(parent.getInput().hidePanelTitles),
                    });
                    this.refreshBadges();
                    this.refreshNotifications();
                }
            });
        }
    }
    componentWillUnmount() {
        this.mounted = false;
        this.subscription.unsubscribe();
        if (this.parentSubscription) {
            this.parentSubscription.unsubscribe();
        }
        this.props.embeddable.destroy();
    }
    render() {
        const viewOnlyMode = this.state.viewMode === types_1.ViewMode.VIEW;
        const classes = classnames_1.default('embPanel', {
            'embPanel--editing': !viewOnlyMode,
            'embPanel--loading': this.state.loading,
        });
        const contentAttrs = {};
        if (this.state.loading)
            contentAttrs['data-loading'] = true;
        if (this.state.error)
            contentAttrs['data-error'] = true;
        const title = this.props.embeddable.getTitle();
        const headerId = this.generateId();
        return (react_1.default.createElement(eui_1.EuiPanel, { className: classes, "data-test-subj": "embeddablePanel", paddingSize: "none", role: "figure", "aria-labelledby": headerId },
            !this.props.hideHeader && (react_1.default.createElement(panel_header_1.PanelHeader, { getActionContextMenuPanel: this.getActionContextMenuPanel, hidePanelTitles: this.state.hidePanelTitles, isViewMode: viewOnlyMode, closeContextMenu: this.state.closeContextMenu, title: title, badges: this.state.badges, notifications: this.state.notifications, embeddable: this.props.embeddable, headerId: headerId })),
            react_1.default.createElement(embeddable_error_label_1.EmbeddableErrorLabel, { error: this.state.error }),
            react_1.default.createElement("div", Object.assign({ className: "embPanel__content", ref: this.embeddableRoot }, contentAttrs))));
    }
    componentDidMount() {
        if (this.embeddableRoot.current) {
            this.subscription.add(this.props.embeddable.getOutput$().subscribe((output) => {
                this.setState({
                    error: output.error,
                    loading: output.loading,
                });
            }));
            this.props.embeddable.render(this.embeddableRoot.current);
        }
    }
}
exports.EmbeddablePanel = EmbeddablePanel;
