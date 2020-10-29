"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const plugin_1 = require("./plugin");
//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
function plugin(initializerContext) {
    return new plugin_1.RedelkPlugin(initializerContext);
}
exports.plugin = plugin;
