import React, {useEffect} from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {EuiPage, EuiPageBody, EuiPageContent, EuiPageHeader, EuiTitle} from '@elastic/eui';
import {Link} from 'react-router-dom';

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  showTopNav: (arg0: boolean) => void;
}

export const SummaryPage = ({basename, notifications, http, navigation, showTopNav}: RedelkAppDeps) => {
  useEffect(() => showTopNav(false), []);

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>Overview</h1>
          </EuiTitle>
        </EuiPageHeader>
        <EuiPageContent>
          <p>Summary dashboard</p>
          <Link to={'/ioc'}>IOC</Link>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
