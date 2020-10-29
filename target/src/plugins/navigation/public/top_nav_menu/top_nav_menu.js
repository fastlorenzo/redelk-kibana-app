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
exports.TopNavMenu = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const top_nav_menu_item_1 = require("./top_nav_menu_item");
/*
 * Top Nav Menu is a convenience wrapper component for:
 * - Top navigation menu - configured by an array of `TopNavMenuData` objects
 * - Search Bar - which includes Filter Bar \ Query Input \ Timepicker.
 *
 * See SearchBar documentation to learn more about its properties.
 *
 **/
function TopNavMenu(props) {
    const { config, showSearchBar, ...searchBarProps } = props;
    if ((!config || config.length === 0) && (!showSearchBar || !props.data)) {
        return null;
    }
    function renderItems() {
        if (!config || config.length === 0)
            return null;
        return config.map((menuItem, i) => {
            return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, key: `nav-menu-${i}`, className: menuItem.emphasize ? 'kbnTopNavItemEmphasized' : '' },
                react_1.default.createElement(top_nav_menu_item_1.TopNavMenuItem, Object.assign({}, menuItem))));
        });
    }
    function renderMenu(className) {
        if (!config || config.length === 0)
            return null;
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { "data-test-subj": "top-nav", justifyContent: "flexStart", alignItems: "center", gutterSize: "none", className: className, responsive: false }, renderItems()));
    }
    function renderSearchBar() {
        // Validate presense of all required fields
        if (!showSearchBar || !props.data)
            return null;
        const { SearchBar } = props.data.ui;
        return react_1.default.createElement(SearchBar, Object.assign({}, searchBarProps));
    }
    function renderLayout() {
        const className = classnames_1.default('kbnTopNavMenu', props.className);
        return (react_1.default.createElement("span", { className: "kbnTopNavMenu__wrapper" },
            renderMenu(className),
            renderSearchBar()));
    }
    return renderLayout();
}
exports.TopNavMenu = TopNavMenu;
TopNavMenu.defaultProps = {
    showSearchBar: false,
    showQueryBar: true,
    showQueryInput: true,
    showDatePicker: true,
    showFilterBar: true,
    screenTitle: '',
};
