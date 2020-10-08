import './index.scss';

import {RedelkPlugin} from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new RedelkPlugin();
}

export {RedelkPluginSetup, RedelkPluginStart} from './types';
