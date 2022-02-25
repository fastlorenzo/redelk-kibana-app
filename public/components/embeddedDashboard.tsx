/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { concat } from 'lodash';
import { EmbeddableFactory } from '../../../../src/plugins/embeddable/public';
import {
  DashboardContainerInput,
  DashboardSavedObject,
  DashboardStart,
} from '../../../../src/plugins/dashboard/public';
import { getAppState, getRtopsLastRefreshDate } from '../redux/selectors';
import { useKibana } from '../../../../src/plugins/kibana_react/public';
import { ActionCreators } from '../redux/rootActions';
import { TopNavMenuData } from '../../../../src/plugins/navigation/public';
import { RedelkKibanaService } from '../types';
import { savedObjectToDashboardContainerInput } from '../helpers/dashboard_helper';

export const EmbeddedDashboard = ({
  dashboardId,
  extraTopNavMenu,
}: {
  dashboardId: string;
  extraTopNavMenu?: TopNavMenuData[];
}) => {
  const [dashboardDef, setDashboardDef] = useState<DashboardSavedObject>();
  const [dashboardConfig, setDashboardConfig] = useState<DashboardContainerInput>();

  const dispatch = useDispatch();
  const { services }: { services: RedelkKibanaService } = useKibana();

  const appState = useSelector(getAppState);
  const rtopsLastRefreshDate = useSelector(getRtopsLastRefreshDate);

  useEffect(() => {
    let topNav: TopNavMenuData[] = [
      {
        id: 'go-to-dashboard',
        label: 'Open in dashboard app',
        run: () => {
          services.application?.navigateToApp('dashboards', { path: '#/view/' + dashboardId });
        },
      },
    ];
    if (extraTopNavMenu !== undefined) {
      topNav = concat(topNav, extraTopNavMenu);
    }
    dispatch(ActionCreators.setTopNavMenu(topNav));
    return () => {
      dispatch(ActionCreators.setTopNavMenu([]));
    };
  }, []);

  let dashboard;
  useEffect(() => {
    if (dashboardDef !== undefined) {
      setDashboardConfig(
        savedObjectToDashboardContainerInput(dashboardDef, appState, rtopsLastRefreshDate)
      );
    }
  }, [dashboardDef, appState, rtopsLastRefreshDate]);

  if (dashboardConfig) {
    const DashboardContainerByValueRenderer: ReturnType<
      DashboardStart['getDashboardContainerByValueRenderer']
    > = services.dashboard.getDashboardContainerByValueRenderer();
    dashboard = <DashboardContainerByValueRenderer input={dashboardConfig} />;
  }

  useEffect(() => {
    const loader = services.dashboard.getSavedDashboardLoader();
    loader.get(dashboardId).then((res) => {
      setDashboardDef(res as DashboardSavedObject);
    });
  }, []);

  return (
    <div id="dashboardPage">
      <div id="dashboardViewport">{dashboard}</div>
    </div>
  );
};
