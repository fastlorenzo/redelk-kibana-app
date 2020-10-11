import React, {useState} from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {IOCTable} from "../features/ioc/iocTable";
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiSpacer,
  EuiText,
  EuiTitle
} from '@elastic/eui';
import {AddIOCForm} from "../features/ioc/addIocForm";
import {DataPublicPluginStart} from 'src/plugins/data/public';


interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

export const IOCPage = ({basename, notifications, http, navigation, data}: RedelkAppDeps) => {

  const [isAddIOCFlyoutVisible, setIsAddIOCFlyoutVisible] = useState(false);

  let addIOCFlyout;
  if (isAddIOCFlyoutVisible) {
    addIOCFlyout = (
      <EuiFlyout
        size="m"
        onClose={() => setIsAddIOCFlyoutVisible(false)}
        aria-labelledby="flyoutTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutTitle">Add an IOC</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <AddIOCForm http={http} callback={() => setIsAddIOCFlyoutVisible(false)}/>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  const topNavMenu = '';

  return (
    <>
      {topNavMenu}
      <EuiPage>
        {addIOCFlyout}
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h2>IOC manual ingestion</h2>
              </EuiTitle>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiText>
                <p>In this page you can manually ingest IOC in RedELK.</p>
              </EuiText>
              <EuiSpacer/>
              <IOCTable http={http}/>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  )
};
