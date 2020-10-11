import React from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart, TopNavMenu, TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {EuiPage, EuiPageBody, EuiPageContent, EuiPageHeader, EuiTitle} from '@elastic/eui';
import {Link} from 'react-router-dom';
import {PLUGIN_ID} from "../../common";
import { useKibana } from '../../../../src/plugins/kibana_react/public';

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
};

export const SummaryPage = ({basename, notifications, http, navigation}: RedelkAppDeps) => {
  const navConfig: TopNavMenuData[] = [{
    id: 'new-item',
    label: 'New',
    run: () => {
      console.log('new item')
    }
  }, {
    id: 'save-item',
    label: 'Save',
    run: () => {
      console.log('Save')
    },
    disableButton: () => {
      return false;
    },
    tooltip: () => {
      return 'Nothing to save';
    }
  }];
  const kibana = useKibana();
  console.log('kbn',kibana);
  return (
    <>
      <TopNavMenu
        appName={PLUGIN_ID}
        config={navConfig}
        screenTitle='Summary'
        showSearchBar
        showQueryBar
        showQueryInput
        showDatePicker
        showFilterBar
      />
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="l">
              <>test</>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>
            <p>Summary dashboard</p>
            <Link to={'/ioc'}>IOC</Link>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
};
