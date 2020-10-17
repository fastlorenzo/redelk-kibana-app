import React, {useEffect, useState} from 'react';
import {SimpleSavedObject} from "kibana/public";
import {DashboardContainerInput, SavedObjectDashboard} from '../../../../src/plugins/dashboard/public';
import {getAppState, getRtopsHits} from "../selectors";
import {useDispatch, useSelector} from 'react-redux';
import {savedObjectToDashboardContainerInput} from '../dashboard_helper';
import {useKibana} from '../../../../src/plugins/kibana_react/public';
import {ActionCreators} from "../redux/rootActions";
import {TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {concat} from 'lodash';

export const EmbeddedDashboard = ({dashboardId, extraTopNavMenu}: { dashboardId: string, extraTopNavMenu?: TopNavMenuData[] }) => {

  const [dashboardDef, setDashboardDef] = useState<SimpleSavedObject<SavedObjectDashboard>>();
  const [dashboardConfig, setDashboardConfig] = useState<DashboardContainerInput>();

  const dispatch = useDispatch();
  const kibana = useKibana();

  const appState = useSelector(getAppState);
  const rtops = useSelector(getRtopsHits);

  useEffect(() => {
    let topNav: TopNavMenuData[] = [{
      id: "go-to-dashboard",
      label: "Open in dashboard app",
      run: () => {
        kibana.services.application?.navigateToApp('dashboards', {path: "#/view/" + dashboardId})
      }
    }];
    if (extraTopNavMenu !== undefined) {
      topNav = concat(topNav, extraTopNavMenu);
    }
    dispatch(ActionCreators.setTopNavMenu(topNav))
    return () => {
      dispatch(ActionCreators.setTopNavMenu([]))
    }
  }, [])

  let dashboard = (<p>Loading dashboard</p>);

  useEffect(() => {
    if (dashboardDef !== undefined) {
      setDashboardConfig(savedObjectToDashboardContainerInput(dashboardDef, appState));
    }
  }, [rtops, dashboardDef, appState]);

  if (dashboardConfig) {
    dashboard = (
      <kibana.services.dashboard.DashboardContainerByValueRenderer input={dashboardConfig}
                                                                   onInputUpdated={setDashboardConfig}/>
    );
  }

  useEffect(() => {
    kibana.services.savedObjects?.client?.get("dashboard", dashboardId).then(res => {
      setDashboardDef(res);
    })
  }, [rtops])

  return (
    <div id="dashboardPage">
      <div id="dashboardViewport">
        {dashboard}
      </div>
    </div>
  );
};
