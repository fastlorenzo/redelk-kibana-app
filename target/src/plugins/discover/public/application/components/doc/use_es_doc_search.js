"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEsDocSearch = exports.buildSearchBody = exports.ElasticRequestState = void 0;
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
const react_1 = require("react");
var ElasticRequestState;
(function (ElasticRequestState) {
    ElasticRequestState[ElasticRequestState["Loading"] = 0] = "Loading";
    ElasticRequestState[ElasticRequestState["NotFound"] = 1] = "NotFound";
    ElasticRequestState[ElasticRequestState["Found"] = 2] = "Found";
    ElasticRequestState[ElasticRequestState["Error"] = 3] = "Error";
    ElasticRequestState[ElasticRequestState["NotFoundIndexPattern"] = 4] = "NotFoundIndexPattern";
})(ElasticRequestState = exports.ElasticRequestState || (exports.ElasticRequestState = {}));
/**
 * helper function to build a query body for Elasticsearch
 * https://www.elastic.co/guide/en/elasticsearch/reference/current//query-dsl-ids-query.html
 */
function buildSearchBody(id, indexPattern) {
    const computedFields = indexPattern.getComputedFields();
    return {
        query: {
            ids: {
                values: [id],
            },
        },
        stored_fields: computedFields.storedFields,
        _source: true,
        script_fields: computedFields.scriptFields,
        docvalue_fields: computedFields.docvalueFields,
    };
}
exports.buildSearchBody = buildSearchBody;
/**
 * Custom react hook for querying a single doc in ElasticSearch
 */
function useEsDocSearch({ esClient, id, index, indexPatternId, indexPatternService, }) {
    const [indexPattern, setIndexPattern] = react_1.useState(null);
    const [status, setStatus] = react_1.useState(ElasticRequestState.Loading);
    const [hit, setHit] = react_1.useState(null);
    react_1.useEffect(() => {
        async function requestData() {
            try {
                const indexPatternEntity = await indexPatternService.get(indexPatternId);
                setIndexPattern(indexPatternEntity);
                const { hits } = await esClient.search({
                    index,
                    body: buildSearchBody(id, indexPatternEntity),
                });
                if (hits && hits.hits && hits.hits[0]) {
                    setStatus(ElasticRequestState.Found);
                    setHit(hits.hits[0]);
                }
                else {
                    setStatus(ElasticRequestState.NotFound);
                }
            }
            catch (err) {
                if (err.savedObjectId) {
                    setStatus(ElasticRequestState.NotFoundIndexPattern);
                }
                else if (err.status === 404) {
                    setStatus(ElasticRequestState.NotFound);
                }
                else {
                    setStatus(ElasticRequestState.Error);
                }
            }
        }
        requestData();
    }, [esClient, id, index, indexPatternId, indexPatternService]);
    return [status, hit, indexPattern];
}
exports.useEsDocSearch = useEsDocSearch;
