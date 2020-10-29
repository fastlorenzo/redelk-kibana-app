"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doc = void 0;
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const use_es_doc_search_1 = require("./use_es_doc_search");
const kibana_services_1 = require("../../../kibana_services");
const doc_viewer_1 = require("../doc_viewer/doc_viewer");
function Doc(props) {
    const [reqState, hit, indexPattern] = use_es_doc_search_1.useEsDocSearch(props);
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(eui_1.EuiPageContent, null,
            reqState === use_es_doc_search_1.ElasticRequestState.NotFoundIndexPattern && (react_1.default.createElement(eui_1.EuiCallOut, { color: "danger", "data-test-subj": `doc-msg-notFoundIndexPattern`, iconType: "alert", title: react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.failedToLocateIndexPattern", defaultMessage: "No index pattern matches ID {indexPatternId}", values: { indexPatternId: props.indexPatternId } }) })),
            reqState === use_es_doc_search_1.ElasticRequestState.NotFound && (react_1.default.createElement(eui_1.EuiCallOut, { color: "danger", "data-test-subj": `doc-msg-notFound`, iconType: "alert", title: react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.failedToLocateDocumentDescription", defaultMessage: "Cannot find document" }) },
                react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.couldNotFindDocumentsDescription", defaultMessage: "No documents match that ID." }))),
            reqState === use_es_doc_search_1.ElasticRequestState.Error && (react_1.default.createElement(eui_1.EuiCallOut, { color: "danger", "data-test-subj": `doc-msg-error`, iconType: "alert", title: react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.failedToExecuteQueryDescription", defaultMessage: "Cannot run search" }) },
                react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.somethingWentWrongDescription", defaultMessage: "{indexName} is missing.", values: { indexName: props.index } }),
                ' ',
                react_1.default.createElement(eui_1.EuiLink, { href: `https://www.elastic.co/guide/en/elasticsearch/reference/${kibana_services_1.getServices().metadata.branch}/indices-exists.html`, target: "_blank" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.somethingWentWrongDescriptionAddon", defaultMessage: "Please ensure the index exists." })))),
            reqState === use_es_doc_search_1.ElasticRequestState.Loading && (react_1.default.createElement(eui_1.EuiCallOut, { "data-test-subj": `doc-msg-loading` },
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                ' ',
                react_1.default.createElement(react_2.FormattedMessage, { id: "discover.doc.loadingDescription", defaultMessage: "Loading\u2026" }))),
            reqState === use_es_doc_search_1.ElasticRequestState.Found && hit !== null && indexPattern && (react_1.default.createElement("div", { "data-test-subj": "doc-hit" },
                react_1.default.createElement(doc_viewer_1.DocViewer, { hit: hit, indexPattern: indexPattern }))))));
}
exports.Doc = Doc;
