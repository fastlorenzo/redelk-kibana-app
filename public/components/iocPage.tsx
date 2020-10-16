import React from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {IOCTable} from "../features/rtops/iocTable";
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiSpacer,
  EuiText,
  EuiTitle
} from '@elastic/eui';
import {AddIOCForm} from "../features/rtops/addIocForm";
import {DataPublicPluginStart} from '../../../../src/plugins/data/public';
import {useDispatch, useSelector} from 'react-redux';
import {useTopNav} from "../navHeaderHelper";
import {getRtopsShowAddIOCForm} from "../selectors";
import {ActionCreators} from "../redux/rootActions";


interface IOCPageDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

export const IOCPage = ({basename, notifications, http, navigation, data}: IOCPageDeps) => {

  const showAddIOCForm = useSelector(getRtopsShowAddIOCForm);

  const dispatch = useDispatch();
  useTopNav(true);

  let addIOCFlyout;
  if (showAddIOCForm) {
    addIOCFlyout = (
      <EuiFlyout
        size="m"
        onClose={() => dispatch(ActionCreators.setShowAddIOCForm(false))}
        aria-labelledby="flyoutTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutTitle">Add an IOC</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <AddIOCForm http={http}/>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageContent>
          {addIOCFlyout}
          <EuiText>
            <p>You can find below the list of IOC from RedELK. Use the top menu option "Add IOC" to manually add new
              IOC.</p>
          </EuiText>
          <EuiSpacer/>
          <IOCTable/>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
};
