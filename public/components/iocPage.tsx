import React from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiTitle} from '@elastic/eui';
import {AddIOCForm} from "../features/rtops/addIocForm";
import {DataPublicPluginStart} from '../../../../src/plugins/data/public';
import {useDispatch, useSelector} from 'react-redux';
import {useTopNav} from "../navHeaderHelper";
import {getRtopsShowAddIOCForm} from "../selectors";
import {ActionCreators} from "../redux/rootActions";
import {EmbeddedDashboard} from "./embeddedDashboard";


interface IOCPageDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

export const IOCPage = ({basename, notifications, http, navigation, data}: IOCPageDeps) => {

  const showAddIOCForm = useSelector(getRtopsShowAddIOCForm);

  useTopNav(true);

  const dispatch = useDispatch();

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

  const addIOCNavMenu = {
    id: "add-ioc",
    label: "Add IOC",
    run: () => {
      dispatch(ActionCreators.setShowAddIOCForm(true))
    }
  };

  return (
    <>
      {addIOCFlyout}
      <EmbeddedDashboard dashboardId="86643e90-d4e4-11ea-9301-a30a04251ae9" extraTopNavMenu={[addIOCNavMenu]}/>
    </>
  )
};
