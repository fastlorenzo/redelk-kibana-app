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

import { CoreStart } from 'kibana/public';
import { PLUGIN_ID } from '../../common';

export const initSettings = async (core: CoreStart) => {
  const defaultRoute = await core.uiSettings.get('defaultRoute');
  if (defaultRoute !== `/app/${PLUGIN_ID}`) {
    console.debug('updating uiSettings');
    await core.uiSettings.set('theme:darkMode', true);
    await core.uiSettings.set('telemetry:optIn', false);
    await core.uiSettings.set('telemetry:enabled', false);
    await core.uiSettings.set('shortDots:enabled', true);
    await core.uiSettings.set('siem:enableNewsFeed', false);
    await core.uiSettings.set('siem:defaultIndex', [
      'apm-*-transaction*',
      'auditbeat-*',
      'endgame-*',
      'filebeat-*',
      'logs-*',
      'packetbeat-*',
      'winlogbeat-*',
      'rtops-*',
      'redirtraffic-*',
    ]);
    await core.uiSettings.set('securitySolution:enableNewsFeed', false);
    await core.uiSettings.set('securitySolution:defaultIndex', [
      'apm-*-transaction*',
      'auditbeat-*',
      'endgame-*',
      'filebeat-*',
      'logs-*',
      'packetbeat-*',
      'winlogbeat-*',
      'rtops-*',
      'redirtraffic-*',
    ]);
    await core.uiSettings.set('defaultIndex', '195a3f00-d04f-11ea-9301-a30a04251ae9');
    await core.uiSettings.set('defaultRoute', `/app/${PLUGIN_ID}`);
    // await core.uiSettings.set("query:queryString:options", {analyze_wildcard: true, default_field: "*"});
    console.debug('uiSettings updated');
    // window.location.reload();
  }
};
