import React from 'react';
import {useTopNav} from "../navHeaderHelper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const ScreenshotsPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="a2dcebf0-d316-11ea-9301-a30a04251ae9"/>
    </>
  );
};
