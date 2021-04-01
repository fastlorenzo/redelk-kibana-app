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
import {useKibana} from '../../../../src/plugins/kibana_react/public';
import {TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {RedelkKibanaService} from "../types";

export const HealthPage = () => {

  useTopNav(true);

  const {services}: { services: RedelkKibanaService } = useKibana();

  const discoverTopNavModules: TopNavMenuData = {
    id: "go-to-discover",
    label: "Open in discover app (Modules)",
    run: () => {
      services.application?.navigateToApp('discover', {path: "#/view/654f76a0-9269-11eb-a753-9da683898c26"})
    }
  }

  const discoverTopNavIPLists: TopNavMenuData = {
    id: "go-to-discover",
    label: "Open in discover app (IP Lists)",
    run: () => {
      services.application?.navigateToApp('discover', {path: "#/view/87530b40-9269-11eb-a753-9da683898c26"})
    }
  }

  return (
    <>
      <EmbeddedDashboard dashboardId="509e6a80-926a-11eb-a753-9da683898c26"
                         extraTopNavMenu={[discoverTopNavModules, discoverTopNavIPLists]}/>
    </>
  );
};
