"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedelkPlugin = void 0;
const i18n_1 = require("@kbn/i18n");
const common_1 = require("../common");
class RedelkPlugin {
    setup(core) {
        const darkMode = core.uiSettings.get('theme:darkMode');
        const redelkCategory = {
            id: 'redelk',
            label: common_1.PLUGIN_NAME,
            order: 1,
            euiIconType: core.http.basePath.get() + '/plugins/redelk/assets/redelklogo' + (darkMode ? '-light' : '') + '.svg'
        };
        // Register an application into the side navigation menu
        core.application.register({
            id: 'redelk',
            title: common_1.PLUGIN_NAME,
            category: redelkCategory,
            async mount(params) {
                // Load application bundle
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application')));
                // Get start services as specified in kibana.json
                const [coreStart, depsStart] = await core.getStartServices();
                //console.log('mounting app', coreStart, depsStart);
                //setNavHeader(coreStart);
                // Render the application
                return renderApp(coreStart, depsStart, params);
            },
        });
        core.application.register({
            id: 'redelk:attack-navigator',
            title: 'MITRE ATT&CK Navigator',
            category: redelkCategory,
            async mount() {
                window.open(window.location.protocol + '//' + window.location.host + '/attack-navigator', '_blank');
                window.history.back();
                return () => {
                };
            }
        });
        core.application.register({
            id: 'redelk:jupyter-notebook',
            title: 'Jupyter Notebook',
            category: redelkCategory,
            async mount() {
                window.open(window.location.protocol + '//' + window.location.host + '/jupyter', '_blank');
                window.history.back();
                return () => {
                };
            }
        });
        core.application.register({
            id: 'redelk:neo4j-browser',
            title: 'Neo4J Browser',
            category: redelkCategory,
            async mount() {
                window.open(window.location.protocol + '//' + window.location.host + '/neo4j', '_blank');
                window.history.back();
                return () => {
                };
            }
        });
        // Return methods that should be available to other plugins
        return {
            getGreeting() {
                return i18n_1.i18n.translate('redelk.greetingText', {
                    defaultMessage: 'Hello from {name}!',
                    values: {
                        name: common_1.PLUGIN_NAME,
                    },
                });
            },
        };
    }
    start(core, { data }) {
        return {};
    }
    stop() {
    }
}
exports.RedelkPlugin = RedelkPlugin;
