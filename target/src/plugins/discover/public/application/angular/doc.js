"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const kibana_services_1 = require("../../kibana_services");
// @ts-ignore
const breadcrumbs_1 = require("../helpers/breadcrumbs");
const doc_html_1 = tslib_1.__importDefault(require("./doc.html"));
const doc_1 = require("../components/doc/doc");
const { timefilter } = kibana_services_1.getServices();
const app = kibana_services_1.getAngularModule();
app.directive('discoverDoc', function (reactDirective) {
    return reactDirective(doc_1.Doc, [
        ['id', { watchDepth: 'value' }],
        ['index', { watchDepth: 'value' }],
        ['indexPatternId', { watchDepth: 'reference' }],
        ['indexPatternService', { watchDepth: 'reference' }],
        ['esClient', { watchDepth: 'reference' }],
    ], { restrict: 'E' });
});
app.config(($routeProvider) => {
    $routeProvider
        .when('/doc/:indexPattern/:index/:type', {
        redirectTo: '/doc/:indexPattern/:index',
    })
        // the new route, es 7 deprecated types, es 8 removed them
        .when('/doc/:indexPattern/:index', {
        // have to be written as function expression, because it's not compiled in dev mode
        // eslint-disable-next-line object-shorthand
        controller: function ($scope, $route, es) {
            timefilter.disableAutoRefreshSelector();
            timefilter.disableTimeRangeSelector();
            $scope.esClient = es;
            $scope.id = $route.current.params.id;
            $scope.index = $route.current.params.index;
            $scope.indexPatternId = $route.current.params.indexPattern;
            $scope.indexPatternService = kibana_services_1.getServices().indexPatterns;
        },
        template: doc_html_1.default,
        k7Breadcrumbs: ($route) => [
            ...breadcrumbs_1.getRootBreadcrumbs(),
            {
                text: `${$route.current.params.index}#${$route.current.params.id}`,
            },
        ],
    });
});
