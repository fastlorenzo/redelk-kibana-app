import {EuiIconType} from '@elastic/eui/src/components/icon/icon';

export interface RedelkAppRoute {
  id: string;
  name: string;
  disabled: boolean;
  path: string;
  icon: EuiIconType;
}

export const DEFAULT_ROUTE_ID = 'summary';
export const routes: RedelkAppRoute[] = [
  {
    id: 'summary',
    name: 'Summary',
    disabled: false,
    path: '/home',
    icon: "dashboardApp"
  },
  {
    id: 'ioc',
    name: 'IOC',
    disabled: false,
    path: '/ioc',
    icon: 'securitySignal'
  }
];

