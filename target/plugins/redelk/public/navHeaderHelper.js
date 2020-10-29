"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNavHeader = void 0;
const common_1 = require("../common");
exports.setNavHeader = (core, breadcrumbs) => {
    const darkMode = core.uiSettings.get('theme:darkMode');
    const basePath = core.http.basePath.get();
    const iconType = basePath + '/plugins/redelk/assets/redelklogo' + (darkMode ? '-light' : '') + '.svg';
    const badge = {
        iconType: iconType,
        text: common_1.PLUGIN_NAME,
        tooltip: common_1.PLUGIN_NAME
    };
    const brand = {
        logo: "url(" + iconType + ") center no-repeat",
        smallLogo: "url(" + iconType + ") center no-repeat",
    };
    const helpExtension = {
        appName: common_1.PLUGIN_NAME,
        links: [{
                linkType: 'documentation',
                href: 'https://github.com/fastlorenzo/redelk-kibana-app'
            }]
    };
    //core.chrome.setHelpSupportUrl('https://github.com/fastlorenzo/redelk-kibana-app');
    core.chrome.setHelpExtension(helpExtension);
    core.chrome.setAppTitle(common_1.PLUGIN_NAME);
    core.chrome.setBadge(badge);
    core.chrome.setBrand(brand);
    core.chrome.setBreadcrumbs(breadcrumbs);
};
