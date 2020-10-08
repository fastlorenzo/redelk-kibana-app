import {CoreSetup, CoreStart, Logger, Plugin, PluginInitializerContext,} from '../../../src/core/server';

import {RedelkPluginSetup, RedelkPluginStart} from './types';
import {defineRoutes} from './routes';

export class RedelkPlugin implements Plugin<RedelkPluginSetup, RedelkPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('redelk: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('redelk: Started');
    return {};
  }

  public stop() {
  }
}
