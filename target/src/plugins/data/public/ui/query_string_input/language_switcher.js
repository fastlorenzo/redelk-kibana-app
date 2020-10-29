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
exports.QueryLanguageSwitcher = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importStar(require("react"));
const public_1 = require("../../../../kibana_react/public");
function QueryLanguageSwitcher(props) {
    const kibana = public_1.useKibana();
    const kueryQuerySyntaxDocs = kibana.services.docLinks.links.query.kueryQuerySyntax;
    const [isPopoverOpen, setIsPopoverOpen] = react_2.useState(false);
    const luceneLabel = (react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.luceneLanguageName", defaultMessage: "Lucene" }));
    const kqlLabel = (react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.kqlLanguageName", defaultMessage: "KQL" }));
    const kqlFullName = (react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.kqlFullLanguageName", defaultMessage: "Kibana Query Language" }));
    const button = (react_2.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", onClick: () => setIsPopoverOpen(!isPopoverOpen), className: "euiFormControlLayout__append kqlQueryBar__languageSwitcherButton", "data-test-subj": 'switchQueryLanguageButton' }, props.language === 'lucene' ? luceneLabel : kqlLabel));
    return (react_2.default.createElement(eui_1.EuiPopover, { id: "queryLanguageSwitcherPopover", anchorClassName: "euiFormControlLayout__append", ownFocus: true, anchorPosition: props.anchorPosition || 'downRight', button: button, isOpen: isPopoverOpen, closePopover: () => setIsPopoverOpen(false), withTitle: true, repositionOnScroll: true },
        react_2.default.createElement(eui_1.EuiPopoverTitle, null,
            react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.syntaxOptionsTitle", defaultMessage: "Syntax options" })),
        react_2.default.createElement("div", { style: { width: '350px' } },
            react_2.default.createElement(eui_1.EuiText, null,
                react_2.default.createElement("p", null,
                    react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.syntaxOptionsDescription", defaultMessage: "The {docsLink} (KQL) offers a simplified query\n              syntax and support for scripted fields. KQL also provides autocomplete if you have\n              a Basic license or above. If you turn off KQL, Kibana uses Lucene.", values: {
                            docsLink: (react_2.default.createElement(eui_1.EuiLink, { href: kueryQuerySyntaxDocs, target: "_blank" }, kqlFullName)),
                        } }))),
            react_2.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_2.default.createElement(eui_1.EuiForm, null,
                react_2.default.createElement(eui_1.EuiFormRow, { label: kqlFullName },
                    react_2.default.createElement(eui_1.EuiSwitch, { id: "queryEnhancementOptIn", name: "popswitch", label: props.language === 'kuery' ? (react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.kqlOnLabel", defaultMessage: "On" })) : (react_2.default.createElement(react_1.FormattedMessage, { id: "data.query.queryBar.kqlOffLabel", defaultMessage: "Off" })), checked: props.language === 'kuery', onChange: () => {
                            const newLanguage = props.language === 'lucene' ? 'kuery' : 'lucene';
                            props.onSelectLanguage(newLanguage);
                        }, "data-test-subj": "languageToggle" }))))));
}
exports.QueryLanguageSwitcher = QueryLanguageSwitcher;
