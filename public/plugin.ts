/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

import {AppCategory, AppMountParameters, CoreSetup, CoreStart, Plugin} from 'kibana/public';
import {
  RedelkPluginSetup,
  RedelkPluginSetupDependencies,
  RedelkPluginStart,
  RedelkPluginStartDependencies
} from './types';
import {PLUGIN_ID, PLUGIN_NAME} from '../common';
import {routes} from "./routes";

export class RedelkPlugin implements Plugin<RedelkPluginSetup, RedelkPluginStart> {
  // initializerContext: PluginInitializerContext;
  // private appStateUpdater = new BehaviorSubject<AppUpdater>(() => ({}));
  // private stopUrlTracking: (() => void) | undefined = undefined;
  // private currentHistory: ScopedHistory | undefined = undefined;

  // constructor(initializerContext: PluginInitializerContext) {
  //   this.initializerContext = initializerContext;
  // }

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

    // core.application.register({
    //   id: 'redelk:attack-navigator',
    //   title: 'MITRE ATT&CK Navigator',
    //   category: redelkCategory,
    //   async mount() {
    //     window.open(window.location.protocol + '//' + window.location.host + '/attack-navigator', '_blank');
    //     window.history.back();
    //     return () => {
    //     }
    //   }
    // });

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
        window.open(window.location.protocol + '//' + window.location.host + '/neo4jbrowser', '_blank');
        window.history.back();
        return () => {
        }
      }
    });

    core.application.register({
      id: 'redelk:attack-navigator',
      title: 'MITRE ATT&CK Navigator',
      category: redelkCategory,
      async mount() {
        const [coreStart] = await core.getStartServices();

        coreStart.application.navigateToApp(PLUGIN_ID, {
          path: routes.find(r => r.id === 'attack-navigator')!.path || "/"
        })
        return () => {
        }
      }
    });

    // Return methods that should be available to other plugins
    return {
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
