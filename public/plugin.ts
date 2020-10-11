import {i18n} from '@kbn/i18n';
import {AppCategory, AppMountParameters, CoreSetup, CoreStart, Plugin} from 'kibana/public';
import {AppPluginStartDependencies, RedelkPluginSetup, RedelkPluginStart} from './types';
import {PLUGIN_NAME} from '../common';

export class RedelkPlugin implements Plugin<RedelkPluginSetup, RedelkPluginStart> {
  public setup(core: CoreSetup): RedelkPluginSetup {

    const darkMode: boolean = core.uiSettings.get('theme:darkMode');
    const redelkCategory: AppCategory = {
      id: 'redelk',
      label: PLUGIN_NAME,
      order: 1,
      euiIconType: core.http.basePath.get() + '/plugins/redelk/assets/redelklogo' + (darkMode ? '-light' : '') + '.svg'
    }
    // Register an application into the side navigation menu
    core.application.register({
      id: 'redelk',
      title: PLUGIN_NAME,
      category: redelkCategory,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const {renderApp} = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        //console.log('mounting app', coreStart, depsStart);

        //setNavHeader(coreStart);
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
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
        }
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
        }
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
        }
      }
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('redelk.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart, {data}: AppPluginStartDependencies): RedelkPluginStart {
    return {};
  }

  public stop() {
  }
}
