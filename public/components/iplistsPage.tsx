/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Lorenzo Bernardi
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

import React from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart, TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiTitle} from '@elastic/eui';
import {DataPublicPluginStart} from '../../../../src/plugins/data/public';
import {useDispatch, useSelector} from 'react-redux';
import {useTopNav} from '../helpers/nav_header_helper';
import {getIPListsShowAddIPForm, getIPListsShowManageIPLists} from '../redux/selectors';
import {ActionCreators} from '../redux/rootActions';
import {AddIPForm} from '../features/iplists/addIPForm';
import {IplistsTable} from '../features/iplists/iplistsTable';
import {EmbeddedDashboard} from "./embeddedDashboard";
import {useKibana} from '../../../../src/plugins/kibana_react/public';
import {RedelkKibanaService} from "../types";

interface IPListsPageDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

export const IPListsPage = ({basename, notifications, http, navigation, data}: IPListsPageDeps) => {

  const showManageIPListsFlyout = useSelector(getIPListsShowManageIPLists);
  const showAddIPForm = useSelector(getIPListsShowAddIPForm);

  useTopNav(true);

  const dispatch = useDispatch();

  let manageIPListsFlyout;
  if (showManageIPListsFlyout) {
    manageIPListsFlyout = (
      <EuiFlyout
        size="l"
        onClose={() => dispatch(ActionCreators.setShowManageIPLists(false))}
        aria-labelledby="flyoutTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutLargeTitle">Manage IP lists</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <IplistsTable http={http}/>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  let addIPFlyout;
  if (showAddIPForm) {
    addIPFlyout = (
      <EuiFlyout
        size="m"
        onClose={() => dispatch(ActionCreators.setShowAddIPForm(false))}
        aria-labelledby="flyoutTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutTitle">Add an IP</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <AddIPForm http={http}/>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }
  const {services}: { services: RedelkKibanaService } = useKibana();

  const discoverTopNavModules: TopNavMenuData = {
    id: "go-to-discover",
    label: "Open in discover app (modules)",
    run: () => {
      services.application?.navigateToApp('discover', {path: "#/view/654f76a0-9269-11eb-a753-9da683898c26"})
    }
  }
  const discoverTopNavIPLists: TopNavMenuData = {
    id: "go-to-discover",
    label: "Open in discover app (IP lists)",
    run: () => {
      services.application?.navigateToApp('discover', {path: "#/view/87530b40-9269-11eb-a753-9da683898c26"})
    }
  }

  const manageIPListsNavMenu = {
    id: "manage-iplists",
    label: "Manage IP lists",
    run: () => {
      dispatch(ActionCreators.setShowManageIPLists(true))
    }
  };


  return (
    <>
      {manageIPListsFlyout}
      {addIPFlyout}
      <EmbeddedDashboard dashboardId="509e6a80-926a-11eb-a753-9da683898c26"
                         extraTopNavMenu={[discoverTopNavModules, discoverTopNavIPLists, manageIPListsNavMenu]}/>
    </>
  )
};
