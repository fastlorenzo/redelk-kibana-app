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
exports.Plugin = exports.plugin = void 0;
require("./index.scss");
function plugin(initializerContext) {
    return new plugin_1.NavigationPublicPlugin(initializerContext);
}
exports.plugin = plugin;
var top_nav_menu_1 = require("./top_nav_menu");
Object.defineProperty(exports, "TopNavMenu", { enumerable: true, get: function () { return top_nav_menu_1.TopNavMenu; } });
// Export plugin after all other imports
const plugin_1 = require("./plugin");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return plugin_1.NavigationPublicPlugin; } });
