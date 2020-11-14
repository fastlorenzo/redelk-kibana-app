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

import {SimpleSavedObject} from "kibana/public";
import {GridData} from '../../../../src/plugins/dashboard/common';
import {DashboardContainerInput, SavedObjectDashboard} from '../../../../src/plugins/dashboard/public';
import {DashboardPanelState} from '../../../../src/plugins/dashboard/public/application';
import {EmbeddableInput, ViewMode} from '../../../../src/plugins/embeddable/public';
import {AppState} from "../redux/types";
import {find} from "lodash";

const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export const savedObjectToDashboardContainerInput = (savedObj: SimpleSavedObject<SavedObjectDashboard>, appState: AppState, lastRefreshDate?: Date): DashboardContainerInput => {
  const initialInput: DashboardContainerInput = {
    viewMode: ViewMode.VIEW,
    panels: {
      '1': {
        gridData: {
          w: 10,
          h: 10,
          x: 0,
          y: 0,
          i: '1',
        },
        type: "visualization",
        explicitInput: {
          id: '1',
          savedObjectId: "b19d4790-d35f-11ea-9301-a30a04251ae9"
        },
      },
    },
    isFullScreenMode: false,
    filters: [],
    useMargins: false,
    id: uuidv4(),
    timeRange: {
      to: 'now',
      from: 'now-1y',
    },
    title: 'test',
    query: {
      query: '',
      language: 'lucene',
    },
    refreshConfig: {
      pause: true,
      value: 15,
    },
  };
  if (savedObj !== undefined) {
    const panels = JSON.parse(savedObj.attributes.panelsJSON);
    let panelsOut: {
      [panelId: string]: DashboardPanelState<EmbeddableInput & { [k: string]: unknown }>;
    } = {};
    panels.forEach((p: { panelRefName: string, gridData: GridData, panelIndex: string, embeddableConfig: {} }) => {
      const pr = find(savedObj.references, r => r.name === p.panelRefName);
      // Don't show top menu bars for embedded dashboards
      if (pr && pr.id !== "0f82b540-d237-11ea-9301-a30a04251ae9" && pr.id !== "45491770-0886-11eb-a2d2-171dc8941414") {
        const tmpPanel = {
          gridData: p.gridData,
          type: pr.type,
          explicitInput: {
            id: p.panelIndex,
            savedObjectId: pr.id,
            ...p.embeddableConfig
          }
        }
        panelsOut[p.panelIndex] = tmpPanel;
      }
    });
    const dashboardOptions = JSON.parse(savedObj.attributes.optionsJSON || "") as { useMargins: boolean, hidePanelTitles: boolean };
    const dashboardConfig: DashboardContainerInput = {
      viewMode: ViewMode.VIEW,
      panels: panelsOut,
      filters: appState.filters || [],
      useMargins: dashboardOptions.useMargins,
      id: savedObj.id,
      timeRange: {
        from: appState.time?.from || savedObj.attributes.timeFrom || "",
        to: appState.time?.to || savedObj.attributes.timeTo || "",
      },
      title: savedObj.attributes.title,
      query: appState.query || {
        language: "kuery",
        query: ""
      },
      isFullScreenMode: false,
      refreshConfig: {
        pause: false,
        value: 5,
      },
      lastReloadRequestTime: lastRefreshDate?.getTime() || new Date().getTime()
    }
    return dashboardConfig;
  }
  return initialInput;
}
