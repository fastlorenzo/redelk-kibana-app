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
    id: 'home',
    name: 'Home',
    disabled: false,
    path: '/home',
    icon: "home"
  },
  {
    id: 'summary',
    name: 'Summary',
    disabled: false,
    path: '/summary',
    icon: "dashboardApp"
  },
  {
    id: 'alarms',
    name: 'Alarms',
    disabled: false,
    path: '/alarms',
    icon: 'alert'
  },
  {
    id: 'credentials',
    name: 'Credentials',
    disabled: false,
    path: '/credentials',
    icon: 'lock'
  },
  {
    id: 'downloads',
    name: 'Downloads',
    disabled: false,
    path: '/downloads',
    icon: 'download'
  },
  {
    id: 'implants',
    name: 'Implants',
    disabled: false,
    path: '/implants',
    icon: 'bug'
  },
  {
    id: 'ioc',
    name: 'IOC',
    disabled: false,
    path: '/ioc',
    icon: 'securitySignal'
  },
  {
    id: 'rtops',
    name: 'Red Team Operations',
    disabled: false,
    path: '/rtops',
    icon: 'reporter'
  },
  {
    id: 'screenshots',
    name: 'Screenshots',
    disabled: false,
    path: '/screenshots',
    icon: 'fullScreen'
  },
  {
    id: 'tasks',
    name: 'Tasks',
    disabled: false,
    path: '/tasks',
    icon: 'list'
  },
  {
    id: 'traffic',
    name: 'Traffic',
    disabled: false,
    path: '/traffic',
    icon: 'globe'
  },
  {
    id: 'ttp',
    name: 'Tactics, Techniques & Procedures',
    disabled: false,
    path: '/ttp',
    icon: 'aggregate'
  },
];

