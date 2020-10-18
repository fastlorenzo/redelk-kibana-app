import React from 'react';
import {useTopNav} from "../helpers/nav_header_helper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const HomePage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="02486040-d355-11ea-9301-a30a04251ae9"/>
    </>
  );
};
