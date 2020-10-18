import React, {useEffect, useState} from 'react';
import {SimpleSavedObject} from "kibana/public";
import {DashboardContainerInput, SavedObjectDashboard} from '../../../../src/plugins/dashboard/public';
import {getAppState, getRtopsLastRefreshDate} from "../redux/selectors";
import {useDispatch, useSelector} from 'react-redux';
import {savedObjectToDashboardContainerInput} from '../helpers/dashboard_helper';
import {useKibana} from '../../../../src/plugins/kibana_react/public';
import {ActionCreators} from "../redux/rootActions";
import {TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {concat} from 'lodash';
import {RedelkKibanaService} from "../types";


export const EmbeddedDashboard = ({dashboardId, extraTopNavMenu}: { dashboardId: string, extraTopNavMenu?: TopNavMenuData[] }) => {

  const [dashboardDef, setDashboardDef] = useState<SimpleSavedObject<SavedObjectDashboard>>();
  const [dashboardConfig, setDashboardConfig] = useState<DashboardContainerInput>();
  // const [dashboard, setDashboard] = useState<ReactElement>(<p>Loading dashboard</p>);

  const dispatch = useDispatch();
  const {services}: { services: RedelkKibanaService } = useKibana();

  const appState = useSelector(getAppState);
  const rtopsLastRefreshDate = useSelector(getRtopsLastRefreshDate);

  useEffect(() => {
    let topNav: TopNavMenuData[] = [{
      id: "go-to-dashboard",
      label: "Open in dashboard app",
      run: () => {
        services.application?.navigateToApp('dashboards', {path: "#/view/" + dashboardId})
      }
    }];
    if (extraTopNavMenu !== undefined) {
      topNav = concat(topNav, extraTopNavMenu);
    }
    dispatch(ActionCreators.setTopNavMenu(topNav))
    return () => {
      dispatch(ActionCreators.setTopNavMenu([]))
    }
  }, []);

  let dashboard;
  useEffect(() => {
    if (dashboardDef !== undefined) {
      setDashboardConfig(savedObjectToDashboardContainerInput(dashboardDef, appState, rtopsLastRefreshDate));
    }
  }, [dashboardDef, appState, rtopsLastRefreshDate]);

  if (dashboardConfig) {
    dashboard = (
      <services.dashboard.DashboardContainerByValueRenderer input={dashboardConfig}
                                                            onInputUpdated={setDashboardConfig}/>
    );
  }

  useEffect(() => {
    services.savedObjects?.client?.get("dashboard", dashboardId).then(res => {
      setDashboardDef(res as SimpleSavedObject<SavedObjectDashboard>);
    })
  }, [])

  return (
    <div id="dashboardPage">
      <div id="dashboardViewport">
        {dashboard}
      </div>
    </div>
  );
};
