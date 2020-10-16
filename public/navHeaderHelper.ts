import {EuiBreadcrumb} from '@elastic/eui';
import {ChromeBadge, ChromeBrand, ChromeHelpExtension, CoreStart} from "kibana/public";
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {PLUGIN_NAME} from "../common";
import {ActionCreators} from "./redux/rootActions";

export const setNavHeader = (core: CoreStart, breadcrumbs: EuiBreadcrumb[]) => {
  const darkMode: boolean = core.uiSettings.get('theme:darkMode');
  const basePath: string = core.http.basePath.get();
  const iconType = basePath + '/plugins/redelk/assets/redelklogo' + (darkMode ? '-light' : '') + '.svg'

  const badge: ChromeBadge = {
    iconType: iconType,
    text: PLUGIN_NAME,
    tooltip: PLUGIN_NAME
  }
  const brand: ChromeBrand = {
    logo: "url(" + iconType + ") center no-repeat",
    smallLogo: "url(" + iconType + ") center no-repeat",
  }

  const helpExtension: ChromeHelpExtension = {
    appName: PLUGIN_NAME,
    links: [{
      linkType: 'documentation',
      href: 'https://github.com/fastlorenzo/redelk-kibana-app'
    }]
  }
  //core.chrome.setHelpSupportUrl('https://github.com/fastlorenzo/redelk-kibana-app');
  core.chrome.setHelpExtension(helpExtension);
  core.chrome.setAppTitle(PLUGIN_NAME);
  core.chrome.setBadge(badge);
  core.chrome.setBrand(brand);
  core.chrome.setBreadcrumbs(breadcrumbs);
};

export const useTopNav = (show: boolean) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ActionCreators.setShowTopNav(show))
  });
}