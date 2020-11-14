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
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiTitle} from '@elastic/eui';
import {AddIOCForm} from "../features/rtops/addIocForm";
import {DataPublicPluginStart} from '../../../../src/plugins/data/public';
import {useDispatch, useSelector} from 'react-redux';
import {useTopNav} from "../helpers/nav_header_helper";
import {getRtopsShowAddIOCForm} from "../redux/selectors";
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
