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
exports.plugin = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./code_editor"), exports);
tslib_1.__exportStar(require("./exit_full_screen_button"), exports);
tslib_1.__exportStar(require("./context"), exports);
tslib_1.__exportStar(require("./overlays"), exports);
tslib_1.__exportStar(require("./ui_settings"), exports);
tslib_1.__exportStar(require("./field_icon"), exports);
tslib_1.__exportStar(require("./table_list_view"), exports);
tslib_1.__exportStar(require("./split_panel"), exports);
tslib_1.__exportStar(require("./react_router_navigate"), exports);
var validated_range_1 = require("./validated_range");
Object.defineProperty(exports, "ValidatedDualRange", { enumerable: true, get: function () { return validated_range_1.ValidatedDualRange; } });
tslib_1.__exportStar(require("./notifications"), exports);
var markdown_1 = require("./markdown");
Object.defineProperty(exports, "Markdown", { enumerable: true, get: function () { return markdown_1.Markdown; } });
Object.defineProperty(exports, "MarkdownSimple", { enumerable: true, get: function () { return markdown_1.MarkdownSimple; } });
var adapters_1 = require("./adapters");
Object.defineProperty(exports, "reactToUiComponent", { enumerable: true, get: function () { return adapters_1.reactToUiComponent; } });
Object.defineProperty(exports, "uiToReactComponent", { enumerable: true, get: function () { return adapters_1.uiToReactComponent; } });
var use_url_tracker_1 = require("./use_url_tracker");
Object.defineProperty(exports, "useUrlTracker", { enumerable: true, get: function () { return use_url_tracker_1.useUrlTracker; } });
var util_1 = require("./util");
Object.defineProperty(exports, "toMountPoint", { enumerable: true, get: function () { return util_1.toMountPoint; } });
var app_links_1 = require("./app_links");
Object.defineProperty(exports, "RedirectAppLinks", { enumerable: true, get: function () { return app_links_1.RedirectAppLinks; } });
/** dummy plugin, we just want kibanaReact to have its own bundle */
function plugin() {
    return new (class KibanaReactPlugin {
        setup() { }
        start() { }
    })();
}
exports.plugin = plugin;
