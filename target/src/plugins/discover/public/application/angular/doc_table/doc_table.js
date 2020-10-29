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
exports.createDocTableDirective = void 0;
const tslib_1 = require("tslib");
const doc_table_html_1 = tslib_1.__importDefault(require("./doc_table.html"));
const public_1 = require("../../../../../kibana_utils/public");
const common_1 = require("../../../../common");
// @ts-ignore
const doc_table_strings_1 = require("./doc_table_strings");
const kibana_services_1 = require("../../../kibana_services");
require("./index.scss");
function createDocTableDirective(pagerFactory, $filter) {
    return {
        restrict: 'E',
        template: doc_table_html_1.default,
        scope: {
            sorting: '=',
            columns: '=',
            hits: '=',
            totalHitCount: '=',
            indexPattern: '=',
            isLoading: '=?',
            infiniteScroll: '=?',
            filter: '=?',
            minimumVisibleRows: '=?',
            onAddColumn: '=?',
            onChangeSortOrder: '=?',
            onMoveColumn: '=?',
            onRemoveColumn: '=?',
            inspectorAdapters: '=?',
        },
        link: ($scope, $el) => {
            $scope.$watch('minimumVisibleRows', (minimumVisibleRows) => {
                $scope.limit = Math.max(minimumVisibleRows || 50, $scope.limit || 50);
            });
            $scope.persist = {
                sorting: $scope.sorting,
                columns: $scope.columns,
            };
            const limitTo = $filter('limitTo');
            const calculateItemsOnPage = () => {
                $scope.pager.setTotalItems($scope.hits.length);
                $scope.pageOfItems = limitTo($scope.hits, $scope.pager.pageSize, $scope.pager.startIndex);
            };
            $scope.limitedResultsWarning = doc_table_strings_1.getLimitedSearchResultsMessage(kibana_services_1.getServices().uiSettings.get(common_1.SAMPLE_SIZE_SETTING, 500));
            $scope.addRows = function () {
                $scope.limit += 50;
            };
            $scope.$watch('hits', (hits) => {
                if (!hits)
                    return;
                // Reset infinite scroll limit
                $scope.limit = 50;
                if (hits.length === 0) {
                    public_1.dispatchRenderComplete($el[0]);
                }
                if ($scope.infiniteScroll)
                    return;
                $scope.pager = pagerFactory.create(hits.length, 50, 1);
                calculateItemsOnPage();
            });
            $scope.pageOfItems = [];
            $scope.onPageNext = () => {
                $scope.pager.nextPage();
                calculateItemsOnPage();
            };
            $scope.onPagePrevious = () => {
                $scope.pager.previousPage();
                calculateItemsOnPage();
            };
            $scope.shouldShowLimitedResultsWarning = () => !$scope.pager.hasNextPage && $scope.pager.totalItems < $scope.totalHitCount;
        },
    };
}
exports.createDocTableDirective = createDocTableDirective;
