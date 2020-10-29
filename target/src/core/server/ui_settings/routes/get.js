"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGetRoute = void 0;
const saved_objects_1 = require("../../saved_objects");
function registerGetRoute(router) {
    router.get({ path: '/api/kibana/settings', validate: false }, async (context, request, response) => {
        try {
            const uiSettingsClient = context.core.uiSettings.client;
            return response.ok({
                body: {
                    settings: await uiSettingsClient.getUserProvided(),
                },
            });
        }
        catch (error) {
            if (saved_objects_1.SavedObjectsErrorHelpers.isSavedObjectsClientError(error)) {
                return response.customError({
                    body: error,
                    statusCode: error.output.statusCode,
                });
            }
            throw error;
        }
    });
}
exports.registerGetRoute = registerGetRoute;
