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
exports.AppLeaveActionType = exports.AppNavLinkStatus = exports.AppStatus = void 0;
/**
 * Accessibility status of an application.
 *
 * @public
 */
var AppStatus;
(function (AppStatus) {
    /**
     * Application is accessible.
     */
    AppStatus[AppStatus["accessible"] = 0] = "accessible";
    /**
     * Application is not accessible.
     */
    AppStatus[AppStatus["inaccessible"] = 1] = "inaccessible";
})(AppStatus = exports.AppStatus || (exports.AppStatus = {}));
/**
 * Status of the application's navLink.
 *
 * @public
 */
var AppNavLinkStatus;
(function (AppNavLinkStatus) {
    /**
     * The application navLink will be `visible` if the application's {@link AppStatus} is set to `accessible`
     * and `hidden` if the application status is set to `inaccessible`.
     */
    AppNavLinkStatus[AppNavLinkStatus["default"] = 0] = "default";
    /**
     * The application navLink is visible and clickable in the navigation bar.
     */
    AppNavLinkStatus[AppNavLinkStatus["visible"] = 1] = "visible";
    /**
     * The application navLink is visible but inactive and not clickable in the navigation bar.
     */
    AppNavLinkStatus[AppNavLinkStatus["disabled"] = 2] = "disabled";
    /**
     * The application navLink does not appear in the navigation bar.
     */
    AppNavLinkStatus[AppNavLinkStatus["hidden"] = 3] = "hidden";
})(AppNavLinkStatus = exports.AppNavLinkStatus || (exports.AppNavLinkStatus = {}));
/**
 * Possible type of actions on application leave.
 *
 * @public
 */
var AppLeaveActionType;
(function (AppLeaveActionType) {
    AppLeaveActionType["confirm"] = "confirm";
    AppLeaveActionType["default"] = "default";
})(AppLeaveActionType = exports.AppLeaveActionType || (exports.AppLeaveActionType = {}));
