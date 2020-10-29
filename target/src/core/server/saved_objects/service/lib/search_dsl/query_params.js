"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParams = void 0;
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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const server_1 = require("../../../../../../plugins/data/server");
const mappings_1 = require("../../../mappings");
/**
 * Gets the types based on the type. Uses mappings to support
 * null type (all types), a single type string or an array
 */
function getTypes(mappings, type) {
    if (!type) {
        return Object.keys(mappings_1.getRootPropertiesObjects(mappings));
    }
    if (Array.isArray(type)) {
        return type;
    }
    return [type];
}
/**
 *  Get the field params based on the types and searchFields
 */
function getFieldsForTypes(types, searchFields) {
    if (!searchFields || !searchFields.length) {
        return {
            lenient: true,
            fields: ['*'],
        };
    }
    let fields = [];
    for (const field of searchFields) {
        fields = fields.concat(types.map((prefix) => `${prefix}.${field}`));
    }
    return { fields };
}
/**
 *  Gets the clause that will filter for the type in the namespace.
 *  Some types are namespace agnostic, so they must be treated differently.
 */
function getClauseForType(registry, namespaces = ['default'], type) {
    if (namespaces.length === 0) {
        throw new Error('cannot specify empty namespaces array');
    }
    if (registry.isMultiNamespace(type)) {
        return {
            bool: {
                must: [{ term: { type } }, { terms: { namespaces } }],
                must_not: [{ exists: { field: 'namespace' } }],
            },
        };
    }
    else if (registry.isSingleNamespace(type)) {
        const should = [];
        const eligibleNamespaces = namespaces.filter((namespace) => namespace !== 'default');
        if (eligibleNamespaces.length > 0) {
            should.push({ terms: { namespace: eligibleNamespaces } });
        }
        if (namespaces.includes('default')) {
            should.push({ bool: { must_not: [{ exists: { field: 'namespace' } }] } });
        }
        if (should.length === 0) {
            // This is indicitive of a bug, and not user error.
            throw new Error('unhandled search condition: expected at least 1 `should` clause.');
        }
        return {
            bool: {
                must: [{ term: { type } }],
                should,
                minimum_should_match: 1,
                must_not: [{ exists: { field: 'namespaces' } }],
            },
        };
    }
    // isNamespaceAgnostic
    return {
        bool: {
            must: [{ term: { type } }],
            must_not: [{ exists: { field: 'namespace' } }, { exists: { field: 'namespaces' } }],
        },
    };
}
/**
 *  Get the "query" related keys for the search body
 */
function getQueryParams({ mappings, registry, namespaces, type, search, searchFields, defaultSearchOperator, hasReference, kueryNode, }) {
    const types = getTypes(mappings, type);
    // A de-duplicated set of namespaces makes for a more effecient query.
    //
    // Additonally, we treat the `*` namespace as the `default` namespace.
    // In the Default Distribution, the `*` is automatically expanded to include all available namespaces.
    // However, the OSS distribution (and certain configurations of the Default Distribution) can allow the `*`
    // to pass through to the SO Repository, and eventually to this module. When this happens, we translate to `default`,
    // since that is consistent with how a single-namespace search behaves in the OSS distribution. Leaving the wildcard in place
    // would result in no results being returned, as the wildcard is treated as a literal, and not _actually_ as a wildcard.
    // We had a good discussion around the tradeoffs here: https://github.com/elastic/kibana/pull/67644#discussion_r441055716
    const normalizedNamespaces = namespaces
        ? Array.from(new Set(namespaces.map((namespace) => (namespace === '*' ? 'default' : namespace))))
        : undefined;
    const bool = {
        filter: [
            ...(kueryNode != null ? [server_1.esKuery.toElasticsearchQuery(kueryNode)] : []),
            {
                bool: {
                    must: hasReference
                        ? [
                            {
                                nested: {
                                    path: 'references',
                                    query: {
                                        bool: {
                                            must: [
                                                {
                                                    term: {
                                                        'references.id': hasReference.id,
                                                    },
                                                },
                                                {
                                                    term: {
                                                        'references.type': hasReference.type,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        ]
                        : undefined,
                    should: types.map((shouldType) => getClauseForType(registry, normalizedNamespaces, shouldType)),
                    minimum_should_match: 1,
                },
            },
        ],
    };
    if (search) {
        bool.must = [
            {
                simple_query_string: {
                    query: search,
                    ...getFieldsForTypes(types, searchFields),
                    ...(defaultSearchOperator ? { default_operator: defaultSearchOperator } : {}),
                },
            },
        ];
    }
    return { query: { bool } };
}
exports.getQueryParams = getQueryParams;
