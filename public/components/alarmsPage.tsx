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
import {useTopNav} from "../helpers/nav_header_helper";
import {EmbeddedDashboard} from "./embeddedDashboard";
import {RedelkKibanaService} from "../types";
import {useKibana} from '../../../../src/plugins/kibana_react/public';
import {TopNavMenuData} from '../../../../src/plugins/navigation/public';

export const AlarmsPage = () => {

  useTopNav(true);

  const {services}: { services: RedelkKibanaService } = useKibana();

  const discoverIOCTopNav: TopNavMenuData = {
    id: "go-to-discover-ioc",
    label: "Open in discover app (Alarmed IOC)",
    run: () => {
      services.application?.navigateToApp('discover', {path: "#/view/10da2290-d4e2-11ea-9301-a30a04251ae9"})
    }
  }
  const discoverRedirtrafficTopNav: TopNavMenuData = {
    id: "go-to-discover-redirtraffic",
    label: "Open in discover app (Redirector traffic IOC)",
    run: () => {
      services.application?.navigateToApp('discover', {path: "#/view/658d7180-d4e1-11ea-9301-a30a04251ae9"})
    }
  }

  return (
    <>
      <EmbeddedDashboard dashboardId="53b69200-d4e3-11ea-9301-a30a04251ae9"
                         extraTopNavMenu={[discoverIOCTopNav, discoverRedirtrafficTopNav]}/>
    </>
  );
};
