import React, {useEffect} from 'react';
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
  EuiSpacer,
  EuiText,
  EuiTitle
} from '@elastic/eui';
import {AddIOCForm} from "../features/ioc/addIocForm";
import {DataPublicPluginStart} from 'src/plugins/data/public';


interface IOCPageDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
  showAddIOCFlyout: boolean | false;
  setIOCFlyoutVisible: (arg0: boolean) => void;
  showTopNav: (arg0: boolean) => void;
}

export const IOCPage = ({basename, notifications, http, navigation, data, showAddIOCFlyout, setIOCFlyoutVisible, showTopNav}: IOCPageDeps) => {

  let addIOCFlyout;
  if (showAddIOCFlyout) {
    addIOCFlyout = (
      <EuiFlyout
        size="m"
        onClose={() => setIOCFlyoutVisible(false)}
        aria-labelledby="flyoutTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutTitle">Add an IOC</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <AddIOCForm http={http} callback={() => setIOCFlyoutVisible(false)}/>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  useEffect(() => showTopNav(true), []);

  return (
    <>
      <EuiPage>
        {addIOCFlyout}
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiText>
                <p>You can find below the list of IOC from RedELK. Use the top menu option "Add IOC" to manually add new
                  IOC.</p>
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
