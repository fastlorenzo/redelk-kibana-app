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
exports.plugin = exports.Plugin = void 0;
const tslib_1 = require("tslib");
require("./index.scss");
const plugin_1 = require("./plugin");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return plugin_1.ExpressionsPublicPlugin; } });
tslib_1.__exportStar(require("./plugin"), exports);
function plugin(initializerContext) {
    return new plugin_1.ExpressionsPublicPlugin(initializerContext);
}
exports.plugin = plugin;
var react_expression_renderer_1 = require("./react_expression_renderer");
Object.defineProperty(exports, "ReactExpressionRenderer", { enumerable: true, get: function () { return react_expression_renderer_1.ReactExpressionRenderer; } });
var render_1 = require("./render");
Object.defineProperty(exports, "ExpressionRenderHandler", { enumerable: true, get: function () { return render_1.ExpressionRenderHandler; } });
var common_1 = require("../common");
Object.defineProperty(exports, "buildExpression", { enumerable: true, get: function () { return common_1.buildExpression; } });
Object.defineProperty(exports, "buildExpressionFunction", { enumerable: true, get: function () { return common_1.buildExpressionFunction; } });
Object.defineProperty(exports, "Execution", { enumerable: true, get: function () { return common_1.Execution; } });
Object.defineProperty(exports, "ExecutionContract", { enumerable: true, get: function () { return common_1.ExecutionContract; } });
Object.defineProperty(exports, "Executor", { enumerable: true, get: function () { return common_1.Executor; } });
Object.defineProperty(exports, "ExpressionFunction", { enumerable: true, get: function () { return common_1.ExpressionFunction; } });
Object.defineProperty(exports, "ExpressionFunctionParameter", { enumerable: true, get: function () { return common_1.ExpressionFunctionParameter; } });
Object.defineProperty(exports, "ExpressionRenderer", { enumerable: true, get: function () { return common_1.ExpressionRenderer; } });
Object.defineProperty(exports, "ExpressionRendererRegistry", { enumerable: true, get: function () { return common_1.ExpressionRendererRegistry; } });
Object.defineProperty(exports, "ExpressionType", { enumerable: true, get: function () { return common_1.ExpressionType; } });
Object.defineProperty(exports, "FontStyle", { enumerable: true, get: function () { return common_1.FontStyle; } });
Object.defineProperty(exports, "FontWeight", { enumerable: true, get: function () { return common_1.FontWeight; } });
Object.defineProperty(exports, "format", { enumerable: true, get: function () { return common_1.format; } });
Object.defineProperty(exports, "formatExpression", { enumerable: true, get: function () { return common_1.formatExpression; } });
Object.defineProperty(exports, "FunctionsRegistry", { enumerable: true, get: function () { return common_1.FunctionsRegistry; } });
Object.defineProperty(exports, "isExpressionAstBuilder", { enumerable: true, get: function () { return common_1.isExpressionAstBuilder; } });
Object.defineProperty(exports, "Overflow", { enumerable: true, get: function () { return common_1.Overflow; } });
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return common_1.parse; } });
Object.defineProperty(exports, "parseExpression", { enumerable: true, get: function () { return common_1.parseExpression; } });
Object.defineProperty(exports, "TextAlignment", { enumerable: true, get: function () { return common_1.TextAlignment; } });
Object.defineProperty(exports, "TextDecoration", { enumerable: true, get: function () { return common_1.TextDecoration; } });
Object.defineProperty(exports, "TypesRegistry", { enumerable: true, get: function () { return common_1.TypesRegistry; } });
