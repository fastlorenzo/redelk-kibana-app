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
exports.createInfiniteScrollDirective = void 0;
const tslib_1 = require("tslib");
const jquery_1 = tslib_1.__importDefault(require("jquery"));
function createInfiniteScrollDirective() {
    return {
        restrict: 'E',
        scope: {
            more: '=',
        },
        link: ($scope, $element) => {
            const $window = jquery_1.default(window);
            let checkTimer;
            function onScroll() {
                if (!$scope.more)
                    return;
                const winHeight = Number($window.height());
                const winBottom = Number(winHeight) + Number($window.scrollTop());
                const offset = $element.offset();
                const elTop = offset ? offset.top : 0;
                const remaining = elTop - winBottom;
                if (remaining <= winHeight * 0.5) {
                    $scope[$scope.$$phase ? '$eval' : '$apply'](function () {
                        $scope.more();
                    });
                }
            }
            function scheduleCheck() {
                if (checkTimer)
                    return;
                checkTimer = setTimeout(function () {
                    checkTimer = null;
                    onScroll();
                }, 50);
            }
            $window.on('scroll', scheduleCheck);
            $scope.$on('$destroy', function () {
                clearTimeout(checkTimer);
                $window.off('scroll', scheduleCheck);
            });
            scheduleCheck();
        },
    };
}
exports.createInfiniteScrollDirective = createInfiniteScrollDirective;
