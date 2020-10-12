import './index.scss';

import {RedelkPlugin} from './plugin';

export function plugin() {
  return new RedelkPlugin();
}

export {RedelkPluginSetup, RedelkPluginStart} from './types';
