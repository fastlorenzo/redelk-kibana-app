import React, {useEffect} from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {IOCTable} from "../features/rtops/iocTable";
import {EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiSpacer, EuiText, EuiTitle} from '@elastic/eui';
import {AddIOCForm} from "../features/rtops/addIocForm";
import {DataPublicPluginStart, Filter} from '../../../../src/plugins/data/public';
import {useDispatch, useSelector} from 'react-redux';
import IOCSlice from "../features/rtops/rtopsSlice";
import {useTopNav} from "../navHeaderHelper";
import {getRtopsShowAddIOCForm} from "../selectors";


interface IOCPageDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

const iocFilter: Filter = {
  meta: {
    alias: "ioc",
    disabled: false,
    index: "rtops",
    negate: false
  },
  query: {
    match_phrase: {
      "event.type": "ioc"
    }
  }
};
export const IOCPage = ({basename, notifications, http, navigation, data}: IOCPageDeps) => {

  const showAddIOCForm = useSelector(getRtopsShowAddIOCForm);

  const dispatch = useDispatch();
  useTopNav(true);
  useEffect(() => {
    dispatch(IOCSlice.actions.setHiddenFilters([iocFilter]));
  }, []);

  let addIOCFlyout;
  if (showAddIOCForm) {
    addIOCFlyout = (
      <EuiFlyout
        size="m"
        onClose={() => dispatch(IOCSlice.actions.setShowAddIOCForm(false))}
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
    <>
      {addIOCFlyout}
      <EuiText>
        <p>You can find below the list of IOC from RedELK. Use the top menu option "Add IOC" to manually add new
          IOC.</p>
      </EuiText>
      <EuiSpacer/>
      <IOCTable/>
    </>
  )
};
