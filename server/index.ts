import {PluginInitializerContext} from '../../../src/core/server';
import {RedelkPlugin} from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new RedelkPlugin(initializerContext);
}

export {RedelkPluginSetup, RedelkPluginStart} from './types';
