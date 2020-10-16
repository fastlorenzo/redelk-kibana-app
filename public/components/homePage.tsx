import React from 'react';
import {EuiIcon, EuiKeyPadMenu, EuiKeyPadMenuItem} from '@elastic/eui';
import {useTopNav} from "../navHeaderHelper";

export const HomePage = () => {

  useTopNav(false);

  return (
    <>
      <EuiKeyPadMenu>

        <EuiKeyPadMenuItem
          label="Dashboard"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>
        <EuiKeyPadMenuItem
          label="Alarms"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>
        <EuiKeyPadMenuItem
          label="Traffic"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="Implants"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="Red Team Operations"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="Tasks"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="Downloads"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="Credentials"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="Screenshots"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="IOC"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

        <EuiKeyPadMenuItem
          label="TTP"
          onClick={() => window.alert('Clicked')}>
          <EuiIcon type="dashboardApp" size="l"/>
        </EuiKeyPadMenuItem>

      </EuiKeyPadMenu>
    </>
  );
};

//Summary | Alarms | Traffic | Implants | Red Team Operations | Tasks | Downloads | Credentials | Screenshots | IOC | TTP
