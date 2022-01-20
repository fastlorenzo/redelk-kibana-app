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

import { EuiBreadcrumb } from '@elastic/eui';
import { ChromeBadge, ChromeBrand, ChromeHelpExtension, CoreStart } from 'kibana/public';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PLUGIN_NAME } from '../../common';
import { ActionCreators } from '../redux/rootActions';

export const setNavHeader = (core: CoreStart, breadcrumbs: EuiBreadcrumb[]) => {
  const darkMode: boolean = core.uiSettings.get('theme:darkMode');
  const basePath: string = core.http.basePath.get();
  const iconType =
    basePath + '/plugins/redelk/assets/redelklogo' + (darkMode ? '-light' : '') + '.svg';

  const badge: ChromeBadge = {
    iconType,
    text: PLUGIN_NAME,
    tooltip: PLUGIN_NAME,
  };
  const brand: ChromeBrand = {
    logo: 'url(' + iconType + ') center no-repeat',
    smallLogo: 'url(' + iconType + ') center no-repeat',
  };

  const helpExtension: ChromeHelpExtension = {
    appName: PLUGIN_NAME,
    links: [
      {
        linkType: 'documentation',
        href: 'https://github.com/fastlorenzo/redelk-kibana-app',
      },
    ],
  };
  // core.chrome.setHelpSupportUrl('https://github.com/fastlorenzo/redelk-kibana-app');
  core.chrome.setHelpExtension(helpExtension);
  //  core.chrome.setAppTitle(PLUGIN_NAME);
  core.chrome.setBadge(badge);
  //  core.chrome.setBrand(brand);
  core.chrome.setBreadcrumbs(breadcrumbs);
};

export const useTopNav = (show: boolean) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ActionCreators.setShowTopNav(show));
  });
};
