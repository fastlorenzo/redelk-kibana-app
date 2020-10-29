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
exports.pollEsNodesVersion = exports.mapNodesVersionCompatibility = void 0;
/**
 * ES and Kibana versions are locked, so Kibana should require that ES has the same version as
 * that defined in Kibana's package.json.
 */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const es_kibana_version_compatability_1 = require("./es_kibana_version_compatability");
function getHumanizedNodeName(node) {
    const publishAddress = node?.http?.publish_address + ' ' || '';
    return 'v' + node.version + ' @ ' + publishAddress + '(' + node.ip + ')';
}
function mapNodesVersionCompatibility(nodesInfo, kibanaVersion, ignoreVersionMismatch) {
    if (Object.keys(nodesInfo.nodes).length === 0) {
        return {
            isCompatible: false,
            message: 'Unable to retrieve version information from Elasticsearch nodes.',
            incompatibleNodes: [],
            warningNodes: [],
            kibanaVersion,
        };
    }
    const nodes = Object.keys(nodesInfo.nodes)
        .sort() // Sorting ensures a stable node ordering for comparison
        .map((key) => nodesInfo.nodes[key])
        .map((node) => Object.assign({}, node, { name: getHumanizedNodeName(node) }));
    // Aggregate incompatible ES nodes.
    const incompatibleNodes = nodes.filter((node) => !es_kibana_version_compatability_1.esVersionCompatibleWithKibana(node.version, kibanaVersion));
    // Aggregate ES nodes which should prompt a Kibana upgrade. It's acceptable
    // if ES and Kibana versions are not the same as long as they are not
    // incompatible, but we should warn about it.
    // Ignore version qualifiers https://github.com/elastic/elasticsearch/issues/36859
    const warningNodes = nodes.filter((node) => !es_kibana_version_compatability_1.esVersionEqualsKibana(node.version, kibanaVersion));
    // Note: If incompatible and warning nodes are present `message` only contains
    // an incompatibility notice.
    let message;
    if (incompatibleNodes.length > 0) {
        const incompatibleNodeNames = incompatibleNodes.map((node) => node.name).join(', ');
        if (ignoreVersionMismatch) {
            message = `Ignoring version incompatibility between Kibana v${kibanaVersion} and the following Elasticsearch nodes: ${incompatibleNodeNames}`;
        }
        else {
            message = `This version of Kibana (v${kibanaVersion}) is incompatible with the following Elasticsearch nodes in your cluster: ${incompatibleNodeNames}`;
        }
    }
    else if (warningNodes.length > 0) {
        const warningNodeNames = warningNodes.map((node) => node.name).join(', ');
        message =
            `You're running Kibana ${kibanaVersion} with some different versions of ` +
                'Elasticsearch. Update Kibana or Elasticsearch to the same ' +
                `version to prevent compatibility issues: ${warningNodeNames}`;
    }
    return {
        isCompatible: ignoreVersionMismatch || incompatibleNodes.length === 0,
        message,
        incompatibleNodes,
        warningNodes,
        kibanaVersion,
    };
}
exports.mapNodesVersionCompatibility = mapNodesVersionCompatibility;
// Returns true if two NodesVersionCompatibility entries match
function compareNodes(prev, curr) {
    const nodesEqual = (n, m) => n.ip === m.ip && n.version === m.version;
    return (curr.isCompatible === prev.isCompatible &&
        curr.incompatibleNodes.length === prev.incompatibleNodes.length &&
        curr.warningNodes.length === prev.warningNodes.length &&
        curr.incompatibleNodes.every((node, i) => nodesEqual(node, prev.incompatibleNodes[i])) &&
        curr.warningNodes.every((node, i) => nodesEqual(node, prev.warningNodes[i])));
}
exports.pollEsNodesVersion = ({ callWithInternalUser, log, kibanaVersion, ignoreVersionMismatch, esVersionCheckInterval: healthCheckInterval, }) => {
    log.debug('Checking Elasticsearch version');
    return rxjs_1.timer(0, healthCheckInterval).pipe(operators_1.exhaustMap(() => {
        return rxjs_1.from(callWithInternalUser('nodes.info', {
            filterPath: ['nodes.*.version', 'nodes.*.http.publish_address', 'nodes.*.ip'],
        })).pipe(operators_1.catchError((_err) => {
            return rxjs_1.of({ nodes: {} });
        }));
    }), operators_1.map((nodesInfo) => mapNodesVersionCompatibility(nodesInfo, kibanaVersion, ignoreVersionMismatch)), operators_1.distinctUntilChanged(compareNodes) // Only emit if there are new nodes or versions
    );
};
