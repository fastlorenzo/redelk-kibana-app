"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedelkPlugin = void 0;
const routes_1 = require("./routes");
class RedelkPlugin {
    constructor(initializerContext) {
        this.logger = initializerContext.logger.get();
    }
    setup(core) {
        this.logger.debug('redelk: Setup');
        const router = core.http.createRouter();
        // Register server side APIs
        routes_1.defineRoutes(router);
        return {};
    }
    start(core) {
        this.logger.debug('redelk: Started');
        return {};
    }
    stop() {
    }
}
exports.RedelkPlugin = RedelkPlugin;
