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
exports.UrlPanelContent = exports.ExportUrlAsType = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const url_1 = require("url");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const url_shortener_1 = require("../lib/url_shortener");
var ExportUrlAsType;
(function (ExportUrlAsType) {
    ExportUrlAsType["EXPORT_URL_AS_SAVED_OBJECT"] = "savedObject";
    ExportUrlAsType["EXPORT_URL_AS_SNAPSHOT"] = "snapshot";
})(ExportUrlAsType = exports.ExportUrlAsType || (exports.ExportUrlAsType = {}));
class UrlPanelContent extends react_1.Component {
    constructor(props) {
        super(props);
        this.isNotSaved = () => {
            return this.props.objectId === undefined || this.props.objectId === '';
        };
        this.resetUrl = () => {
            if (this.mounted) {
                this.shortUrlCache = undefined;
                this.setState({
                    useShortUrl: false,
                }, this.setUrl);
            }
        };
        this.updateUrlParams = (url) => {
            const embedUrl = this.props.isEmbedded ? this.makeUrlEmbeddable(url) : url;
            const extendUrl = this.state.urlParams ? this.getUrlParamExtensions(embedUrl) : embedUrl;
            return extendUrl;
        };
        this.getSavedObjectUrl = () => {
            if (this.isNotSaved()) {
                return;
            }
            const url = this.getSnapshotUrl();
            const parsedUrl = url_1.parse(url);
            if (!parsedUrl || !parsedUrl.hash) {
                return;
            }
            // Get the application route, after the hash, and remove the #.
            const parsedAppUrl = url_1.parse(parsedUrl.hash.slice(1), true);
            const formattedUrl = url_1.format({
                protocol: parsedUrl.protocol,
                auth: parsedUrl.auth,
                host: parsedUrl.host,
                pathname: parsedUrl.pathname,
                hash: url_1.format({
                    pathname: parsedAppUrl.pathname,
                    query: {
                        // Add global state to the URL so that the iframe doesn't just show the time range
                        // default.
                        _g: parsedAppUrl.query._g,
                    },
                }),
            });
            return this.updateUrlParams(formattedUrl);
        };
        this.getSnapshotUrl = () => {
            const url = this.props.shareableUrl || window.location.href;
            return this.updateUrlParams(url);
        };
        this.makeUrlEmbeddable = (url) => {
            const embedParam = '?embed=true';
            const urlHasQueryString = url.indexOf('?') !== -1;
            if (urlHasQueryString) {
                return url.replace('?', `${embedParam}&`);
            }
            return `${url}${embedParam}`;
        };
        this.getUrlParamExtensions = (url) => {
            const { urlParams } = this.state;
            return urlParams
                ? Object.keys(urlParams).reduce((urlAccumulator, key) => {
                    const urlParam = urlParams[key];
                    return urlParam
                        ? Object.keys(urlParam).reduce((queryAccumulator, queryParam) => {
                            const isQueryParamEnabled = urlParam[queryParam];
                            return isQueryParamEnabled
                                ? queryAccumulator + `&${queryParam}=true`
                                : queryAccumulator;
                        }, urlAccumulator)
                        : urlAccumulator;
                }, url)
                : url;
        };
        this.makeIframeTag = (url) => {
            if (!url) {
                return;
            }
            return `<iframe src="${url}" height="600" width="800"></iframe>`;
        };
        this.setUrl = () => {
            let url;
            if (this.state.exportUrlAs === ExportUrlAsType.EXPORT_URL_AS_SAVED_OBJECT) {
                url = this.getSavedObjectUrl();
            }
            else if (this.state.useShortUrl) {
                url = this.shortUrlCache;
            }
            else {
                url = this.getSnapshotUrl();
            }
            if (this.props.isEmbedded) {
                url = this.makeIframeTag(url);
            }
            this.setState({ url });
        };
        this.handleExportUrlAs = (optionId) => {
            this.setState({
                exportUrlAs: optionId,
            }, this.setUrl);
        };
        this.handleShortUrlChange = async (evt) => {
            const isChecked = evt.target.checked;
            if (!isChecked || this.shortUrlCache !== undefined) {
                this.setState({ useShortUrl: isChecked }, this.setUrl);
                return;
            }
            // "Use short URL" is checked but shortUrl has not been generated yet so one needs to be created.
            this.createShortUrl();
        };
        this.createShortUrl = async () => {
            this.setState({
                isCreatingShortUrl: true,
                shortUrlErrorMsg: undefined,
            });
            try {
                const shortUrl = await url_shortener_1.shortenUrl(this.getSnapshotUrl(), {
                    basePath: this.props.basePath,
                    post: this.props.post,
                });
                if (this.mounted) {
                    this.shortUrlCache = shortUrl;
                    this.setState({
                        isCreatingShortUrl: false,
                        useShortUrl: true,
                    }, this.setUrl);
                }
            }
            catch (fetchError) {
                if (this.mounted) {
                    this.shortUrlCache = undefined;
                    this.setState({
                        useShortUrl: false,
                        isCreatingShortUrl: false,
                        shortUrlErrorMsg: i18n_1.i18n.translate('share.urlPanel.unableCreateShortUrlErrorMessage', {
                            defaultMessage: 'Unable to create short URL. Error: {errorMessage}',
                            values: {
                                errorMessage: fetchError.message,
                            },
                        }),
                    }, this.setUrl);
                }
            }
        };
        this.renderExportUrlAsOptions = () => {
            return [
                {
                    id: ExportUrlAsType.EXPORT_URL_AS_SNAPSHOT,
                    label: this.renderWithIconTip(react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.snapshotLabel", defaultMessage: "Snapshot" }), react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.snapshotDescription", defaultMessage: "Snapshot URLs encode the current state of the {objectType} in the URL itself.\n            Edits to the saved {objectType} won't be visible via this URL.", values: { objectType: this.props.objectType } })),
                    ['data-test-subj']: 'exportAsSnapshot',
                },
                {
                    id: ExportUrlAsType.EXPORT_URL_AS_SAVED_OBJECT,
                    disabled: this.isNotSaved(),
                    label: this.renderWithIconTip(react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.savedObjectLabel", defaultMessage: "Saved object" }), react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.savedObjectDescription", defaultMessage: "You can share this URL with people to let them load the most recent saved version of this {objectType}.", values: { objectType: this.props.objectType } })),
                    ['data-test-subj']: 'exportAsSavedObject',
                },
            ];
        };
        this.renderWithIconTip = (child, tipContent) => {
            return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none", responsive: false },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, child),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiIconTip, { content: tipContent, position: "bottom" }))));
        };
        this.renderExportAsRadioGroup = () => {
            const generateLinkAsHelp = this.isNotSaved() ? (react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.canNotShareAsSavedObjectHelpText", defaultMessage: "Can't share as saved object until the {objectType} has been saved.", values: { objectType: this.props.objectType } })) : undefined;
            return (react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.generateLinkAsLabel", defaultMessage: "Generate the link as" }), helpText: generateLinkAsHelp },
                react_1.default.createElement(eui_1.EuiRadioGroup, { options: this.renderExportUrlAsOptions(), idSelected: this.state.exportUrlAs, onChange: this.handleExportUrlAs })));
        };
        this.renderShortUrlSwitch = () => {
            if (this.state.exportUrlAs === ExportUrlAsType.EXPORT_URL_AS_SAVED_OBJECT ||
                !this.props.allowShortUrl) {
                return;
            }
            const shortUrlLabel = (react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.shortUrlLabel", defaultMessage: "Short URL" }));
            const switchLabel = this.state.isCreatingShortUrl ? (react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }),
                " ",
                shortUrlLabel)) : (shortUrlLabel);
            const switchComponent = (react_1.default.createElement(eui_1.EuiSwitch, { label: switchLabel, checked: this.state.useShortUrl, onChange: this.handleShortUrlChange, "data-test-subj": "useShortUrl" }));
            const tipContent = (react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.shortUrlHelpText", defaultMessage: "We recommend sharing shortened snapshot URLs for maximum compatibility.\n        Internet Explorer has URL length restrictions,\n        and some wiki and markup parsers don't do well with the full-length version of the snapshot URL,\n        but the short URL should work great." }));
            return (react_1.default.createElement(eui_1.EuiFormRow, { helpText: this.state.shortUrlErrorMsg, "data-test-subj": "createShortUrl" }, this.renderWithIconTip(switchComponent, tipContent)));
        };
        this.renderUrlParamExtensions = () => {
            if (!this.props.urlParamExtensions) {
                return;
            }
            const setParamValue = (paramName) => (values = {}) => {
                const stateUpdate = {
                    urlParams: {
                        ...this.state.urlParams,
                        [paramName]: {
                            ...values,
                        },
                    },
                };
                this.setState(stateUpdate, this.state.useShortUrl ? this.createShortUrl : this.setUrl);
            };
            return (react_1.default.createElement(react_1.default.Fragment, null, this.props.urlParamExtensions.map(({ paramName, component: UrlParamComponent }) => (react_1.default.createElement(eui_1.EuiFormRow, { key: paramName },
                react_1.default.createElement(UrlParamComponent, { setParamValue: setParamValue(paramName) }))))));
        };
        this.shortUrlCache = undefined;
        this.state = {
            exportUrlAs: ExportUrlAsType.EXPORT_URL_AS_SNAPSHOT,
            useShortUrl: false,
            isCreatingShortUrl: false,
            url: '',
        };
    }
    componentWillUnmount() {
        window.removeEventListener('hashchange', this.resetUrl);
        this.mounted = false;
    }
    componentDidMount() {
        this.mounted = true;
        this.setUrl();
        window.addEventListener('hashchange', this.resetUrl, false);
    }
    render() {
        return (react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(eui_1.EuiForm, { className: "kbnShareContextMenu__finalPanel", "data-test-subj": "shareUrlForm" },
                this.renderExportAsRadioGroup(),
                this.renderUrlParamExtensions(),
                this.renderShortUrlSwitch(),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                react_1.default.createElement(eui_1.EuiCopy, { textToCopy: this.state.url || '', anchorClassName: "eui-displayBlock" }, (copy) => (react_1.default.createElement(eui_1.EuiButton, { fill: true, fullWidth: true, onClick: copy, disabled: this.state.isCreatingShortUrl || this.state.url === '', "data-share-url": this.state.url, "data-test-subj": "copyShareUrlButton", size: "s" }, this.props.isEmbedded ? (react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.copyIframeCodeButtonLabel", defaultMessage: "Copy iFrame code" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "share.urlPanel.copyLinkButtonLabel", defaultMessage: "Copy link" }))))))));
    }
}
exports.UrlPanelContent = UrlPanelContent;
