"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
require("./index.scss");
const plugin_1 = require("./plugin");
// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
function plugin() {
    return new plugin_1.RedelkPlugin();
}
exports.plugin = plugin;
