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
exports.createTableRowDirective = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
// @ts-ignore
const rison_node_1 = tslib_1.__importDefault(require("rison-node"));
require("../../doc_viewer");
// @ts-ignore
const no_white_space_1 = require("../../../../../../../legacy/core_plugins/kibana/common/utils/no_white_space");
const open_html_1 = tslib_1.__importDefault(require("./table_row/open.html"));
const details_html_1 = tslib_1.__importDefault(require("./table_row/details.html"));
const public_1 = require("../../../../../../kibana_utils/public");
const common_1 = require("../../../../../common");
const cell_html_1 = tslib_1.__importDefault(require("../components/table_row/cell.html"));
const truncate_by_height_html_1 = tslib_1.__importDefault(require("../components/table_row/truncate_by_height.html"));
const public_2 = require("../../../../../../data/public");
const kibana_services_1 = require("../../../../kibana_services");
// guesstimate at the minimum number of chars wide cells in the table should be
const MIN_LINE_LENGTH = 20;
function createTableRowDirective($compile, $httpParamSerializer) {
    const cellTemplate = lodash_1.default.template(no_white_space_1.noWhiteSpace(cell_html_1.default));
    const truncateByHeightTemplate = lodash_1.default.template(no_white_space_1.noWhiteSpace(truncate_by_height_html_1.default));
    return {
        restrict: 'A',
        scope: {
            columns: '=',
            filter: '=',
            indexPattern: '=',
            row: '=kbnTableRow',
            onAddColumn: '=?',
            onRemoveColumn: '=?',
        },
        link: ($scope, $el) => {
            $el.after('<tr data-test-subj="docTableDetailsRow" class="kbnDocTableDetails__row">');
            $el.empty();
            // when we compile the details, we use this $scope
            let $detailsScope;
            // when we compile the toggle button in the summary, we use this $scope
            let $toggleScope;
            // toggle display of the rows details, a full list of the fields from each row
            $scope.toggleRow = () => {
                const $detailsTr = $el.next();
                $scope.open = !$scope.open;
                ///
                // add/remove $details children
                ///
                $detailsTr.toggle($scope.open);
                if (!$scope.open) {
                    // close the child scope if it exists
                    $detailsScope.$destroy();
                    // no need to go any further
                    return;
                }
                else {
                    $detailsScope = $scope.$new();
                }
                // empty the details and rebuild it
                $detailsTr.html(details_html_1.default);
                $detailsScope.row = $scope.row;
                $detailsScope.hit = $scope.row;
                $detailsScope.uriEncodedId = encodeURIComponent($detailsScope.hit._id);
                $compile($detailsTr)($detailsScope);
            };
            $scope.$watchMulti(['indexPattern.timeFieldName', 'row.highlight', '[]columns'], () => {
                createSummaryRow($scope.row);
            });
            $scope.inlineFilter = function inlineFilter($event, type) {
                const column = jquery_1.default($event.target).data().column;
                const field = $scope.indexPattern.fields.getByName(column);
                $scope.filter(field, $scope.flattenedRow[column], type);
            };
            $scope.getContextAppHref = () => {
                const path = `#/context/${encodeURIComponent($scope.indexPattern.id)}/${encodeURIComponent($scope.row._id)}`;
                const globalFilters = kibana_services_1.getServices().filterManager.getGlobalFilters();
                const appFilters = kibana_services_1.getServices().filterManager.getAppFilters();
                const hash = $httpParamSerializer({
                    _g: encodeURI(rison_node_1.default.encode({
                        filters: globalFilters || [],
                    })),
                    _a: encodeURI(rison_node_1.default.encode({
                        columns: $scope.columns,
                        filters: (appFilters || []).map(public_2.esFilters.disableFilter),
                    })),
                });
                return `${path}?${hash}`;
            };
            // create a tr element that lists the value for each *column*
            function createSummaryRow(row) {
                const indexPattern = $scope.indexPattern;
                $scope.flattenedRow = indexPattern.flattenHit(row);
                // We just create a string here because its faster.
                const newHtmls = [open_html_1.default];
                const mapping = indexPattern.fields.getByName;
                const hideTimeColumn = kibana_services_1.getServices().uiSettings.get(common_1.DOC_HIDE_TIME_COLUMN_SETTING, false);
                if (indexPattern.timeFieldName && !hideTimeColumn) {
                    newHtmls.push(cellTemplate({
                        timefield: true,
                        formatted: _displayField(row, indexPattern.timeFieldName),
                        filterable: mapping(indexPattern.timeFieldName).filterable && $scope.filter,
                        column: indexPattern.timeFieldName,
                    }));
                }
                $scope.columns.forEach(function (column) {
                    const isFilterable = mapping(column) && mapping(column).filterable && $scope.filter;
                    newHtmls.push(cellTemplate({
                        timefield: false,
                        sourcefield: column === '_source',
                        formatted: _displayField(row, column, true),
                        filterable: isFilterable,
                        column,
                    }));
                });
                let $cells = $el.children();
                newHtmls.forEach(function (html, i) {
                    const $cell = $cells.eq(i);
                    if ($cell.data('discover:html') === html)
                        return;
                    const reuse = lodash_1.default.find($cells.slice(i + 1), function (cell) {
                        return jquery_1.default.data(cell, 'discover:html') === html;
                    });
                    const $target = reuse ? jquery_1.default(reuse).detach() : jquery_1.default(html);
                    $target.data('discover:html', html);
                    const $before = $cells.eq(i - 1);
                    if ($before.length) {
                        $before.after($target);
                    }
                    else {
                        $el.append($target);
                    }
                    // rebuild cells since we modified the children
                    $cells = $el.children();
                    if (!reuse) {
                        $toggleScope = $scope.$new();
                        $compile($target)($toggleScope);
                    }
                });
                if ($scope.open) {
                    $detailsScope.row = row;
                }
                // trim off cells that were not used rest of the cells
                $cells.filter(':gt(' + (newHtmls.length - 1) + ')').remove();
                public_1.dispatchRenderComplete($el[0]);
            }
            /**
             * Fill an element with the value of a field
             */
            function _displayField(row, fieldName, truncate = false) {
                const indexPattern = $scope.indexPattern;
                const text = indexPattern.formatField(row, fieldName);
                if (truncate && text.length > MIN_LINE_LENGTH) {
                    return truncateByHeightTemplate({
                        body: text,
                    });
                }
                return text;
            }
        },
    };
}
exports.createTableRowDirective = createTableRowDirective;
