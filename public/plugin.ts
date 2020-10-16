import {AppCategory, AppMountParameters, CoreSetup, CoreStart, Plugin, PluginInitializerContext} from 'kibana/public';
import {
  RedelkPluginSetup,
  RedelkPluginSetupDependencies,
  RedelkPluginStart,
  RedelkPluginStartDependencies
} from './types';
import {PLUGIN_NAME} from '../common';

export class RedelkPlugin implements Plugin<RedelkPluginSetup, RedelkPluginStart> {
  initializerContext: PluginInitializerContext;
  // private appStateUpdater = new BehaviorSubject<AppUpdater>(() => ({}));
  // private stopUrlTracking: (() => void) | undefined = undefined;
  // private currentHistory: ScopedHistory | undefined = undefined;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public setup(core: CoreSetup, {data}: RedelkPluginSetupDependencies): RedelkPluginSetup {
    // const {appMounted, appUnMounted, stop: stopUrlTracker} = createKbnUrlTracker({
    //   baseUrl: core.http.basePath.prepend('/app/timelion'),
    //   defaultSubUrl: '#/',
    //   storageKey: `lastUrl:${core.http.basePath.get()}:timelion`,
    //   navLinkUpdater$: this.appStateUpdater,
    //   toastNotifications: core.notifications.toasts,
    //   stateParams: [
    //     {
    //       kbnUrlKey: '_g',
    //       stateUpdate$: data.query.state$.pipe(
    //         filter(
    //           ({changes}) => !!(changes.globalFilters || changes.time || changes.refreshInterval)
    //         ),
    //         map(({state}) => ({
    //           ...state,
    //           filters: state.filters?.filter(esFilters.isFilterPinned),
    //         }))
    //       ),
    //     },
    //   ],
    //   getHistory: () => this.currentHistory!,
    // });
    //
    // this.stopUrlTracking = () => {
    //   stopUrlTracker();
    // };

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
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        //this.currentHistory = params.history;

        // appMounted();

        // const unlistenParentHistory = params.history.listen(() => {
        //   window.dispatchEvent(new HashChangeEvent('hashchange'));
        // });

        // Load application bundle
        const {renderApp} = await import('./application');

        // Render the application
        const unmount = renderApp(coreStart, depsStart as RedelkPluginStartDependencies, params);
        return () => {
          // unlistenParentHistory();
          unmount();
          // appUnMounted();
        };
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
      // getGreeting() {
      //   return i18n.translate('redelk.greetingText', {
      //     defaultMessage: 'Hello from {name}!',
      //     values: {
      //       name: PLUGIN_NAME,
      //     },
      //   });
      // },
    };
  }

  public start(core: CoreStart, {data}: RedelkPluginStartDependencies): RedelkPluginStart {
    return {};
  }

  public stop() {
    // if (this.stopUrlTracking) {
    //   this.stopUrlTracking();
    // }
  }
}
