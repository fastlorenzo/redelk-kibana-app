"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServices = void 0;
const saved_searches_1 = require("./saved_searches");
const kibana_services_1 = require("./kibana_services");
async function buildServices(core, plugins, context) {
    const services = {
        savedObjectsClient: core.savedObjects.client,
        indexPatterns: plugins.data.indexPatterns,
        search: plugins.data.search,
        chrome: core.chrome,
        overlays: core.overlays,
    };
    const savedObjectService = saved_searches_1.createSavedSearchesLoader(services);
    return {
        addBasePath: core.http.basePath.prepend,
        capabilities: core.application.capabilities,
        chrome: core.chrome,
        core,
        data: plugins.data,
        docLinks: core.docLinks,
        theme: plugins.charts.theme,
        filterManager: plugins.data.query.filterManager,
        getSavedSearchById: async (id) => savedObjectService.get(id),
        getSavedSearchUrlById: async (id) => savedObjectService.urlFor(id),
        history: kibana_services_1.getHistory,
        indexPatterns: plugins.data.indexPatterns,
        inspector: plugins.inspector,
        metadata: {
            branch: context.env.packageInfo.branch,
        },
        share: plugins.share,
        kibanaLegacy: plugins.kibanaLegacy,
        timefilter: plugins.data.query.timefilter.timefilter,
        toastNotifications: core.notifications.toasts,
        uiSettings: core.uiSettings,
        visualizations: plugins.visualizations,
    };
}
exports.buildServices = buildServices;
