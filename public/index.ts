import {PluginInitializerContext} from 'kibana/public';
import './index.scss';

import {RedelkPlugin} from './plugin';

export const plugin = (context: PluginInitializerContext) => {
  return new RedelkPlugin(context);
}

export {RedelkPluginSetup, RedelkPluginStart} from './types';
