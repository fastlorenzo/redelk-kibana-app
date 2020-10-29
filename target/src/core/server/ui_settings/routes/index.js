"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const delete_1 = require("./delete");
const get_1 = require("./get");
const set_many_1 = require("./set_many");
const set_1 = require("./set");
function registerRoutes(router) {
    get_1.registerGetRoute(router);
    delete_1.registerDeleteRoute(router);
    set_1.registerSetRoute(router);
    set_many_1.registerSetManyRoute(router);
}
exports.registerRoutes = registerRoutes;
