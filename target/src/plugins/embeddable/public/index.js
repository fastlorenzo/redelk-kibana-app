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
require("./index.scss");
const plugin_1 = require("./plugin");
var lib_1 = require("./lib");
Object.defineProperty(exports, "ACTION_ADD_PANEL", { enumerable: true, get: function () { return lib_1.ACTION_ADD_PANEL; } });
Object.defineProperty(exports, "ACTION_APPLY_FILTER", { enumerable: true, get: function () { return lib_1.ACTION_APPLY_FILTER; } });
Object.defineProperty(exports, "ACTION_EDIT_PANEL", { enumerable: true, get: function () { return lib_1.ACTION_EDIT_PANEL; } });
Object.defineProperty(exports, "AddPanelAction", { enumerable: true, get: function () { return lib_1.AddPanelAction; } });
Object.defineProperty(exports, "AttributeService", { enumerable: true, get: function () { return lib_1.AttributeService; } });
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return lib_1.Container; } });
Object.defineProperty(exports, "CONTEXT_MENU_TRIGGER", { enumerable: true, get: function () { return lib_1.CONTEXT_MENU_TRIGGER; } });
Object.defineProperty(exports, "contextMenuTrigger", { enumerable: true, get: function () { return lib_1.contextMenuTrigger; } });
Object.defineProperty(exports, "defaultEmbeddableFactoryProvider", { enumerable: true, get: function () { return lib_1.defaultEmbeddableFactoryProvider; } });
Object.defineProperty(exports, "EditPanelAction", { enumerable: true, get: function () { return lib_1.EditPanelAction; } });
Object.defineProperty(exports, "Embeddable", { enumerable: true, get: function () { return lib_1.Embeddable; } });
Object.defineProperty(exports, "EmbeddableChildPanel", { enumerable: true, get: function () { return lib_1.EmbeddableChildPanel; } });
Object.defineProperty(exports, "EmbeddableFactoryNotFoundError", { enumerable: true, get: function () { return lib_1.EmbeddableFactoryNotFoundError; } });
Object.defineProperty(exports, "EmbeddablePanel", { enumerable: true, get: function () { return lib_1.EmbeddablePanel; } });
Object.defineProperty(exports, "EmbeddableRoot", { enumerable: true, get: function () { return lib_1.EmbeddableRoot; } });
Object.defineProperty(exports, "ErrorEmbeddable", { enumerable: true, get: function () { return lib_1.ErrorEmbeddable; } });
Object.defineProperty(exports, "isErrorEmbeddable", { enumerable: true, get: function () { return lib_1.isErrorEmbeddable; } });
Object.defineProperty(exports, "openAddPanelFlyout", { enumerable: true, get: function () { return lib_1.openAddPanelFlyout; } });
Object.defineProperty(exports, "PANEL_BADGE_TRIGGER", { enumerable: true, get: function () { return lib_1.PANEL_BADGE_TRIGGER; } });
Object.defineProperty(exports, "panelBadgeTrigger", { enumerable: true, get: function () { return lib_1.panelBadgeTrigger; } });
Object.defineProperty(exports, "PANEL_NOTIFICATION_TRIGGER", { enumerable: true, get: function () { return lib_1.PANEL_NOTIFICATION_TRIGGER; } });
Object.defineProperty(exports, "panelNotificationTrigger", { enumerable: true, get: function () { return lib_1.panelNotificationTrigger; } });
Object.defineProperty(exports, "PanelNotFoundError", { enumerable: true, get: function () { return lib_1.PanelNotFoundError; } });
Object.defineProperty(exports, "ViewMode", { enumerable: true, get: function () { return lib_1.ViewMode; } });
Object.defineProperty(exports, "withEmbeddableSubscription", { enumerable: true, get: function () { return lib_1.withEmbeddableSubscription; } });
Object.defineProperty(exports, "isSavedObjectEmbeddableInput", { enumerable: true, get: function () { return lib_1.isSavedObjectEmbeddableInput; } });
Object.defineProperty(exports, "isRangeSelectTriggerContext", { enumerable: true, get: function () { return lib_1.isRangeSelectTriggerContext; } });
Object.defineProperty(exports, "isValueClickTriggerContext", { enumerable: true, get: function () { return lib_1.isValueClickTriggerContext; } });
Object.defineProperty(exports, "EmbeddableStateTransfer", { enumerable: true, get: function () { return lib_1.EmbeddableStateTransfer; } });
Object.defineProperty(exports, "EmbeddableRenderer", { enumerable: true, get: function () { return lib_1.EmbeddableRenderer; } });
function plugin(initializerContext) {
    return new plugin_1.EmbeddablePublicPlugin(initializerContext);
}
exports.plugin = plugin;
