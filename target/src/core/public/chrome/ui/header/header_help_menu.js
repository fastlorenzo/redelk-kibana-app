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
exports.HeaderHelpMenu = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const rxjs_1 = require("rxjs");
const header_extension_1 = require("./header_extension");
const constants_1 = require("../../constants");
class HeaderHelpMenuUI extends react_1.Component {
    constructor(props) {
        super(props);
        this.createGithubUrl = (labels, title) => {
            const url = new URL('https://github.com/elastic/kibana/issues/new?');
            if (labels.length) {
                url.searchParams.set('labels', labels.join(','));
            }
            if (title) {
                url.searchParams.set('title', title);
            }
            return url.toString();
        };
        this.createCustomLink = (index, text, addSpacer, buttonProps) => {
            return (react_1.default.createElement(react_1.Fragment, { key: `helpButton${index}` },
                react_1.default.createElement(eui_1.EuiButtonEmpty, Object.assign({}, buttonProps, { size: "xs", flush: "left" }), text),
                addSpacer && react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })));
        };
        this.onMenuButtonClick = () => {
            this.setState({
                isOpen: !this.state.isOpen,
            });
        };
        this.closeMenu = () => {
            this.setState({
                isOpen: false,
            });
        };
        this.state = {
            isOpen: false,
            helpExtension: undefined,
            helpSupportUrl: '',
        };
    }
    componentDidMount() {
        this.subscription = rxjs_1.combineLatest(this.props.helpExtension$, this.props.helpSupportUrl$).subscribe(([helpExtension, helpSupportUrl]) => {
            this.setState({
                helpExtension,
                helpSupportUrl,
            });
        });
    }
    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
    render() {
        const { intl, kibanaVersion, useDefaultContent, kibanaDocLink } = this.props;
        const { helpExtension, helpSupportUrl } = this.state;
        const defaultContent = useDefaultContent ? (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiButtonEmpty, { href: kibanaDocLink, target: "_blank", size: "xs", flush: "left" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuKibanaDocumentationTitle", defaultMessage: "Kibana documentation" })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(eui_1.EuiButtonEmpty, { href: helpSupportUrl, target: "_blank", size: "xs", flush: "left" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuAskElasticTitle", defaultMessage: "Ask Elastic" })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(eui_1.EuiButtonEmpty, { href: constants_1.KIBANA_FEEDBACK_LINK, target: "_blank", size: "xs", flush: "left" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuGiveFeedbackTitle", defaultMessage: "Give feedback" })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(eui_1.EuiButtonEmpty, { href: constants_1.GITHUB_CREATE_ISSUE_LINK, target: "_blank", size: "xs", iconType: "logoGithub", flush: "left" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuOpenGitHubIssueTitle", defaultMessage: "Open an issue in GitHub" })))) : null;
        let customContent;
        if (helpExtension) {
            const { appName, links, content } = helpExtension;
            const getFeedbackText = () => i18n_1.i18n.translate('core.ui.chrome.headerGlobalNav.helpMenuGiveFeedbackOnApp', {
                defaultMessage: 'Give feedback on {appName}',
                values: { appName: helpExtension.appName },
            });
            const customLinks = links &&
                links.map((link, index) => {
                    const { linkType, title, labels = [], content: text, ...rest } = link;
                    switch (linkType) {
                        case 'documentation':
                            return this.createCustomLink(index, react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuDocumentation", defaultMessage: "Documentation" }), index < links.length - 1, {
                                target: '_blank',
                                rel: 'noopener',
                                ...rest,
                            });
                        case 'github':
                            return this.createCustomLink(index, getFeedbackText(), index < links.length - 1, {
                                iconType: 'logoGithub',
                                href: this.createGithubUrl(labels, title),
                                target: '_blank',
                                rel: 'noopener',
                                ...rest,
                            });
                        case 'discuss':
                            return this.createCustomLink(index, getFeedbackText(), index < links.length - 1, {
                                iconType: 'editorComment',
                                target: '_blank',
                                rel: 'noopener',
                                ...rest,
                            });
                        case 'custom':
                            return this.createCustomLink(index, text, index < links.length - 1, { ...rest });
                        default:
                            break;
                    }
                });
            customContent = (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
                    react_1.default.createElement("h3", null, appName)),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                customLinks,
                content && (react_1.default.createElement(react_1.default.Fragment, null,
                    customLinks && react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                    react_1.default.createElement(header_extension_1.HeaderExtension, { extension: content })))));
        }
        const button = (react_1.default.createElement(eui_1.EuiHeaderSectionItemButton, { "aria-expanded": this.state.isOpen, "aria-haspopup": "true", "aria-label": intl.formatMessage({
                id: 'core.ui.chrome.headerGlobalNav.helpMenuButtonAriaLabel',
                defaultMessage: 'Help menu',
            }), onClick: this.onMenuButtonClick },
            react_1.default.createElement(eui_1.EuiIcon, { type: "help", size: "m" })));
        return (react_1.default.createElement(eui_1.EuiPopover, { anchorPosition: "downRight", button: button, closePopover: this.closeMenu, "data-test-subj": "helpMenuButton", id: "headerHelpMenu", isOpen: this.state.isOpen, ownFocus: true, repositionOnScroll: true },
            react_1.default.createElement(eui_1.EuiPopoverTitle, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false },
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement("h2", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuTitle", defaultMessage: "Help" }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "chrHeaderHelpMenu__version" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "core.ui.chrome.headerGlobalNav.helpMenuVersion", defaultMessage: "v {version}", values: { version: kibanaVersion } })))),
            react_1.default.createElement("div", { style: { maxWidth: 240 } },
                defaultContent,
                defaultContent && customContent && react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "m" }),
                customContent)));
    }
}
exports.HeaderHelpMenu = react_2.injectI18n(HeaderHelpMenuUI);
exports.HeaderHelpMenu.defaultProps = {
    useDefaultContent: true,
};
