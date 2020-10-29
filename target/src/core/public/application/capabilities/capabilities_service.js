"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapabilitiesService = void 0;
const utils_1 = require("../../../utils");
/**
 * Service that is responsible for UI Capabilities.
 * @internal
 */
class CapabilitiesService {
    async start({ appIds, http }) {
        const capabilities = await http.post('/api/core/capabilities', {
            body: JSON.stringify({ applications: appIds }),
        });
        return {
            capabilities: utils_1.deepFreeze(capabilities),
        };
    }
}
exports.CapabilitiesService = CapabilitiesService;
