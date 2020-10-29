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
exports.NavigationPublicPlugin = void 0;
const top_nav_menu_1 = require("./top_nav_menu");
class NavigationPublicPlugin {
    constructor(initializerContext) {
        this.topNavMenuExtensionsRegistry = new top_nav_menu_1.TopNavMenuExtensionsRegistry();
    }
    setup(core) {
        return {
            registerMenuItem: this.topNavMenuExtensionsRegistry.register.bind(this.topNavMenuExtensionsRegistry),
        };
    }
    start({ i18n }, { data }) {
        const extensions = this.topNavMenuExtensionsRegistry.getAll();
        return {
            ui: {
                TopNavMenu: top_nav_menu_1.createTopNav(data, extensions, i18n),
            },
        };
    }
    stop() { }
}
exports.NavigationPublicPlugin = NavigationPublicPlugin;
